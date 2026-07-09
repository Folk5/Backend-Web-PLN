const express = require('express');
const router = express.Router();
const listrikpediaController = require('../controllers/listrikpediaController');

router.get('/', listrikpediaController.getAllTerms);
router.post('/', listrikpediaController.createTerm);
router.put('/:id', listrikpediaController.updateTerm);
router.delete('/:id', listrikpediaController.deleteTerm);

module.exports = router;
