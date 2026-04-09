const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const requireAuth = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Rute GET (Akses Publik / Frontend Web / Bebas dibaca siapa saja)
router.get('/modules', dataController.getModules);
router.get('/modules/:id', dataController.getModuleById);
router.get('/tools', dataController.getTools);
router.get('/materials', dataController.getMaterials);

// Rute POST (Akses Admin / Hanya untuk user yang sudah Login)
// Diaplikasikan fungsi pengaman 'requireAuth' sebelum masuk ke 'createModule', dsb.
router.post('/modules', requireAuth, dataController.createModule);
router.post('/materials', requireAuth, dataController.createMaterial);
router.post('/tools', requireAuth, dataController.createTool);

// Rute POST (Input relasional menyambungkan modul dengan material/tool/asset)
router.post('/module-assets', requireAuth, dataController.addModuleAsset);
router.post('/module-materials', requireAuth, dataController.addModuleMaterial);
router.post('/module-tools', requireAuth, dataController.addModuleTool);

// Rute POST (Pengunggahan File Fisik via Multer)
router.post('/upload-file', requireAuth, upload.single('file'), dataController.uploadFile);

module.exports = router;
