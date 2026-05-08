const router = require('express').Router();
const requireAuth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const materialValidator = require('../middleware/validators/materialValidator');
const materialController = require('../controllers/materialController');
const relationController = require('../controllers/relationController');

// Materials CRUD
router.get('/materials', materialController.getMaterials);
router.get('/materials/:id', materialController.getMaterialById);
router.post(
  '/materials',
  requireAuth,
  materialValidator.create,
  validateRequest,
  materialController.createMaterial
);
router.put(
  '/materials/:id',
  requireAuth,
  materialValidator.update,
  validateRequest,
  materialController.updateMaterial
);
router.delete('/materials/:id', requireAuth, materialController.deleteMaterial);

// Relasi material
router.post('/material-assets', requireAuth, relationController.addMaterialAsset);

module.exports = router;
