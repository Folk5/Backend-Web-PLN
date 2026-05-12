const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/authMiddleware');

router.get('/', requireAuth, userController.getAllUsers);
router.post('/', requireAuth, userController.createUser);
router.put('/change-password', requireAuth, userController.changePassword);
router.put('/profile', requireAuth, userController.updateProfile);
router.put('/:id', requireAuth, userController.updateUser);
router.delete('/:id', requireAuth, userController.deleteUser);

module.exports = router;
