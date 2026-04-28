require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Daftar origin yang diizinkan dibaca dari .env, fallback ke localhost dev
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map(o => o.trim());

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

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Route Configuration
// Semua auth request akan diarahkan ke /api/auth/...
app.use('/api/auth', authRoutes);

// Permintaan data diarahkan ke /api/...
app.use('/api', dataRoutes);

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

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend API Server running on port ${PORT}`);
    console.log(`🌍 Untuk akses dari device lain : http://192.168.137.1:${PORT}`);
});
