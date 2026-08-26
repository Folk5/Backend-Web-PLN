require('dotenv').config({ override: true });
// trigger nodemon restart
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const os = require('os');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const moduleRoutes = require('./routes/module.routes');
const materialRoutes = require('./routes/material.routes');
const toolRoutes = require('./routes/tool.routes');
const uploadRoutes = require('./routes/upload.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/categoryRoutes');
const constructionRoutes = require('./routes/constructions.routes');

const app = express();

const staticOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

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

const allowedOrigins = [...new Set([...staticOrigins, ...localIPs])];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin '${origin}' tidak diizinkan.`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

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
app.use(helmet({ crossOriginResourcePolicy: false })); // allow cross origin for images/assets
app.use(morgan('dev'));
app.use('/api', apiLimiter);

// Serve static files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const listrikpediaRoutes = require('./routes/listrikpedia.routes');

app.use('/api/auth', authRoutes);
app.use('/api', moduleRoutes);
app.use('/api', materialRoutes);
app.use('/api', toolRoutes);
app.use('/api', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/construction', constructionRoutes);
app.use('/api/quiz', require('./routes/quiz.routes'));
app.use('/api/listrikpedia', listrikpediaRoutes);
app.use('/api/pembelajaran', require('./routes/pembelajaran.routes'));
app.use('/api', require('./routes/background.routes'));
app.use('/api/box', require('./routes/box.routes'));

app.get('/', (req, res) => {
  res.json({
    status: '✅ PLN Pusdiklat Backend API is running',
    endpoints: {
      auth: '/api/auth/login',
      modules: '/api/modules',
      tools: '/api/tools',
      materials: '/api/materials',
      upload: '/api/upload-file',
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint URL not found' });
});

app.use(errorHandler);

module.exports = app;
