const router = require('express').Router();
const requireAuth = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const backgroundController = require('../controllers/backgroundController');

router.get('/backgrounds', backgroundController.getBackgrounds);
router.post('/backgrounds', requireAuth, upload.single('file'), backgroundController.addBackground);
router.delete('/backgrounds/:id', requireAuth, backgroundController.deleteBackground);

module.exports = router;
