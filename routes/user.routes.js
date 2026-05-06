const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// TODO: Tambahkan middleware requireAuth/requireAdmin jika perlu,
// Saat ini kita menggunakan open endpoint atau bisa ditambahkan nanti.

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
