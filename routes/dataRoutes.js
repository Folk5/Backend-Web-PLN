const express    = require('express');
const router     = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const multer     = require('multer');

// Batas ukuran di level multer (50MB) mencegah file besar masuk ke memori sebelum divalidasi controller
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});

// ── Import Controllers ─────────────────────────────────────
const moduleController   = require('../controllers/moduleController');
const materialController = require('../controllers/materialController');
const toolController     = require('../controllers/toolController');
const uploadController   = require('../controllers/uploadController');
const relationController = require('../controllers/relationController');

// ── GET (Publik) ───────────────────────────────────────────
router.get('/modules',      moduleController.getModules);
router.get('/modules/:id',  moduleController.getModuleById);
router.get('/tools',        toolController.getTools);
router.get('/materials',    materialController.getMaterials);

// ── POST (Admin) ───────────────────────────────────────────
router.post('/modules',    requireAuth, moduleController.createModule);
router.post('/materials',  requireAuth, materialController.createMaterial);
router.post('/tools',      requireAuth, toolController.createTool);

// ── POST Relasi ────────────────────────────────────────────
router.post('/module-assets',    requireAuth, relationController.addModuleAsset);
router.post('/material-assets',  requireAuth, relationController.addMaterialAsset);
router.post('/module-materials', requireAuth, relationController.addModuleMaterial);
router.post('/module-tools',     requireAuth, relationController.addModuleTool);

// ── PUT (Admin) ────────────────────────────────────────────
router.put('/modules/:id',   requireAuth, moduleController.updateModule);
router.put('/materials/:id', requireAuth, materialController.updateMaterial);
router.put('/tools/:id',     requireAuth, toolController.updateTool);

// ── DELETE (Admin) ─────────────────────────────────────────
router.delete('/modules/:id',   requireAuth, moduleController.deleteModule);
router.delete('/materials/:id', requireAuth, materialController.deleteMaterial);
router.delete('/tools/:id',     requireAuth, toolController.deleteTool);

// ── Upload File ke Storage ─────────────────────────────────
router.post('/upload-file',  requireAuth, upload.single('file'), uploadController.uploadFile);
router.post('/upload-image', requireAuth, upload.single('file'), uploadController.uploadImage);

module.exports = router;

