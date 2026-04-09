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

// Fallback jika API endpoint tidak ditemukan
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint URL not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend API Server running on port ${PORT}`);
});
