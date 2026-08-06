const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const requireAuth = require('../middleware/authMiddleware');

router.post('/', quizController.createQuiz);
router.get('/', quizController.getAllQuizzes);
router.get('/:code', quizController.getQuizByCode);
router.post('/:code/submit', quizController.submitQuiz);
router.put('/:code/toggle-status', requireAuth, quizController.toggleQuizStatus);
router.delete('/:id', requireAuth, quizController.deleteQuiz);

module.exports = router;
