require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
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
