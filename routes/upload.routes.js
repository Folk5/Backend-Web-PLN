const router = require('express').Router();
const requireAuth = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadLimiter } = require('../middleware/rateLimiter');
const uploadController = require('../controllers/uploadController');

router.post(
  '/upload-file',
  requireAuth,
  uploadLimiter,
  upload.single('file'),
  uploadController.uploadFile
);
router.post(
  '/upload-image',
  requireAuth,
  uploadLimiter,
  upload.single('file'),
  uploadController.uploadImage
);

module.exports = router;
