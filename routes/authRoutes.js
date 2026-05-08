const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter, loginLimiter } = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const authValidator = require('../middleware/validators/authValidator');

// Catatan: Route /register membutuhkan middleware requireAuth karena sistem
// ini menggunakan closed registration (hanya admin yang sudah login yang
// bisa membuat akun baru).
router.post(
  '/register',
  authLimiter,
  requireAuth,
  authValidator.register,
  validateRequest,
  authController.register
);
router.post('/login', loginLimiter, authValidator.login, validateRequest, authController.login);
router.post('/logout', authController.logout);
router.get('/verify', authController.verify);

module.exports = router;
