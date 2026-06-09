const router = require('express').Router();
const requireAuth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const moduleValidator = require('../middleware/validators/moduleValidator');
const moduleController = require('../controllers/moduleController');
const relationController = require('../controllers/relationController');
const meshConfigController = require('../controllers/meshConfigController');

// Modules CRUD
router.get('/modules', moduleController.getModules);
router.get('/modules/:id', moduleController.getModuleById);
router.post(
  '/modules',
  requireAuth,
  moduleValidator.create,
  validateRequest,
  moduleController.createModule
);
router.put(
  '/modules/:id',
  requireAuth,
  moduleValidator.update,
  validateRequest,
  moduleController.updateModule
);
router.delete('/modules/:id', requireAuth, moduleController.deleteModule);

// Relasi module
router.post('/module-assets', requireAuth, relationController.addModuleAsset);
router.post('/module-materials', requireAuth, relationController.addModuleMaterial);
router.delete('/module-materials/:module_id/:material_id', requireAuth, relationController.removeModuleMaterial);
router.post('/module-tools', requireAuth, relationController.addModuleTool);

// Mesh mapping
router.patch('/module-materials/:id/mesh-names', requireAuth, relationController.updateMaterialMeshNames);
router.patch('/module-tools/:id/mesh-name', requireAuth, relationController.updateToolMeshName);

// Mesh config (display name + visibility)
router.get('/modules/:id/mesh-config', meshConfigController.getMeshConfig);
router.post('/modules/:id/mesh-config', requireAuth, meshConfigController.upsertMeshConfig);

// Mapped mesh names (public — dipakai viewer publik)
router.get('/modules/:id/mapped-meshes', meshConfigController.getMappedMeshes);

module.exports = router;
