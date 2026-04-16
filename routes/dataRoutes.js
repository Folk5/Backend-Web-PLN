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
router.post('/material-assets', requireAuth, dataController.addMaterialAsset);
router.post('/module-materials', requireAuth, dataController.addModuleMaterial);
router.post('/module-tools', requireAuth, dataController.addModuleTool);

// Rute PUT (Update data yang sudah ada beserta sinkronisasi file)
router.put('/modules/:id', requireAuth, dataController.updateModule);
router.put('/materials/:id', requireAuth, dataController.updateMaterial);
router.put('/tools/:id', requireAuth, dataController.updateTool);

// Rute DELETE (Hapus permanen)
router.delete('/modules/:id', requireAuth, dataController.deleteModule);
router.delete('/materials/:id', requireAuth, dataController.deleteMaterial);
router.delete('/tools/:id', requireAuth, dataController.deleteTool);

// Rute POST (Pengunggahan File Fisik via Multer)
router.post('/upload-file', requireAuth, upload.single('file'), dataController.uploadFile);

// Rute POST (Pengunggahan Khusus Gambar secara Terpisah agar tidak merusak 3D API)
router.post('/upload-image', requireAuth, upload.single('file'), dataController.uploadImage);

module.exports = router;
