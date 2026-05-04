const router             = require('express').Router();
const requireAuth        = require('../middleware/authMiddleware');
const validateRequest    = require('../middleware/validateRequest');
const moduleValidator    = require('../middleware/validators/moduleValidator');
const moduleController   = require('../controllers/moduleController');
const relationController = require('../controllers/relationController');

// Modules CRUD
router.get('/modules',       moduleController.getModules);
router.get('/modules/:id',   moduleController.getModuleById);
router.post('/modules',      requireAuth, moduleValidator.create, validateRequest, moduleController.createModule);
router.put('/modules/:id',   requireAuth, moduleValidator.update, validateRequest, moduleController.updateModule);
router.delete('/modules/:id', requireAuth, moduleController.deleteModule);

// Relasi module
router.post('/module-assets',    requireAuth, relationController.addModuleAsset);
router.post('/module-materials', requireAuth, relationController.addModuleMaterial);
router.post('/module-tools',     requireAuth, relationController.addModuleTool);

module.exports = router;
