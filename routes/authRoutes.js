const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const requireAuth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const authValidator = require('../middleware/validators/authValidator');

router.post('/register', authLimiter, requireAuth, authValidator.register, validateRequest, authController.register);
router.post('/login',    authLimiter, authValidator.login, validateRequest, authController.login);
router.post('/logout',   authController.logout);
router.get('/verify',    authController.verify);

module.exports = router;

