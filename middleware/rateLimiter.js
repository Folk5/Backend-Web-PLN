const rateLimit = require('express-rate-limit');

// Untuk login & register — cegah brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10,
  message: { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Khusus endpoint /login — batas lebih ketat untuk mencegah brute-force credential
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5,
  message: {
    error: 'Terlalu banyak percobaan login. Akun sementara diblokir, coba lagi dalam 15 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Untuk upload file — cegah abuse storage
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 500,
  message: { error: 'Batas upload tercapai. Coba lagi dalam 1 jam.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Untuk seluruh API — batas umum per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5000,
  message: { error: 'Terlalu banyak request. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, loginLimiter, uploadLimiter, apiLimiter };
