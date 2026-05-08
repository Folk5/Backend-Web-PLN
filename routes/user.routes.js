const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/authMiddleware');

// Change password endpoint (harus login)
router.put('/change-password', requireAuth, userController.changePassword);

// Update profile endpoint (harus login)
router.put('/profile', requireAuth, userController.updateProfile);

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
