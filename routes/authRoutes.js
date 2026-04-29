const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/authMiddleware');

router.post('/register', authLimiter, requireAuth, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/verify', authController.verify);

module.exports = router;
