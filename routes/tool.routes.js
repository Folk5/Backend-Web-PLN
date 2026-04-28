const router      = require('express').Router();
const requireAuth = require('../middleware/authMiddleware');
const toolController = require('../controllers/toolController');

// Tools CRUD
router.get('/tools',       toolController.getTools);
router.post('/tools',      requireAuth, toolController.createTool);
router.put('/tools/:id',   requireAuth, toolController.updateTool);
router.delete('/tools/:id', requireAuth, toolController.deleteTool);

module.exports = router;
