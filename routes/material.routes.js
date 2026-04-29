const router          = require('express').Router();
const requireAuth     = require('../middleware/authMiddleware');
const materialController = require('../controllers/materialController');
const relationController = require('../controllers/relationController');

// Materials CRUD
router.get('/materials',       materialController.getMaterials);
router.post('/materials',      requireAuth, materialController.createMaterial);
router.put('/materials/:id',   requireAuth, materialController.updateMaterial);
router.delete('/materials/:id', requireAuth, materialController.deleteMaterial);

// Relasi material
router.post('/material-assets', requireAuth, relationController.addMaterialAsset);

module.exports = router;
