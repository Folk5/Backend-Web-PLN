require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const os = require('os');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes     = require('./routes/authRoutes');
const moduleRoutes   = require('./routes/module.routes');
const materialRoutes = require('./routes/material.routes');
const toolRoutes     = require('./routes/tool.routes');
const uploadRoutes   = require('./routes/upload.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// ── CORS ─────────────────────────────────────────────────────────────────────

// Ambil origin dari .env (statis) — WAJIB diisi di production
const staticOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

// Auto-detect semua IP lokal aktif di mesin ini (WiFi, hotspot, WSL, dsb.)
// HANYA di development — di production, gunakan ALLOWED_ORIGINS dari .env saja
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;
const localIPs = [];
if (process.env.NODE_ENV !== 'production') {
    for (const nets of Object.values(os.networkInterfaces())) {
        for (const net of nets) {
            if (net.family === 'IPv4' && !net.internal) {
                localIPs.push(`http://${net.address}:${FRONTEND_PORT}`);
            }
        }
    }
}

// Gabungkan: statis (.env) + dinamis (IP lokal saat ini, hanya dev)
const allowedOrigins = [...new Set([...staticOrigins, ...localIPs])];

const corsOptions = {
    origin: (origin, callback) => {
        // Izinkan request tanpa origin (curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: Origin '${origin}' tidak diizinkan.`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Wrap cors agar error origin ditolak dengan 403, bukan 500
const corsMiddleware = cors(corsOptions);
app.use((req, res, next) => {
    corsMiddleware(req, res, (err) => {
        if (err) {
            const origin = req.headers.origin || 'unknown';
            console.warn(`[CORS] Akses ditolak dari origin: ${origin} → ${req.method} ${req.path}`);
            return res.status(403).json({ error: 'Akses ditolak: origin tidak diizinkan.' });
        }
        next();
    });
});
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use('/api', apiLimiter);

// ── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api', moduleRoutes);
app.use('/api', materialRoutes);
app.use('/api', toolRoutes);
app.use('/api', uploadRoutes);

// Health check — agar tidak 404 ketika buka di browser
app.get('/', (req, res) => {
    res.json({ 
        status: '✅ PLN Pusdiklat Backend API is running',
        endpoints: {
            auth: '/api/auth/login',
            modules: '/api/modules',
            tools: '/api/tools',
            materials: '/api/materials',
            upload: '/api/upload-file'
        }
    });
});

// Fallback jika API endpoint tidak ditemukan
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint URL not found' });
});

// ── Start Server ──────────────────────────────────────────────────────────────

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend API Server running on port ${PORT}`);
    if (localIPs.length > 0) {
        localIPs.forEach(ip => console.log(`🌍 Akses jaringan lokal : ${ip.replace(`:${FRONTEND_PORT}`, `:${PORT}`)}`));
    }
    console.log(`🔒 CORS diizinkan untuk: ${allowedOrigins.join(', ')}`);
});
