const router = require('express').Router();
const requireAuth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const toolValidator = require('../middleware/validators/toolValidator');
const toolController = require('../controllers/toolController');

// Tools CRUD
router.get('/tools', toolController.getTools);
router.get('/tools/by-construction/:slug', toolController.getToolsByConstruction);
router.post(
  '/tools',
  requireAuth,
  toolValidator.create,
  validateRequest,
  toolController.createTool
);
router.put(
  '/tools/:id',
  requireAuth,
  toolValidator.update,
  validateRequest,
  toolController.updateTool
);
router.delete('/tools/:id', requireAuth, toolController.deleteTool);

module.exports = router;
