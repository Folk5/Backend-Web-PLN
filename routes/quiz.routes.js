const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/', quizController.createQuiz);
router.get('/', quizController.getAllQuizzes);
router.get('/:code', quizController.getQuizByCode);
router.post('/:code/submit', quizController.submitQuiz);

module.exports = router;
