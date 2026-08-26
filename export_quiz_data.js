require('dotenv').config();
const prisma = require('./config/db');
const fs = require('fs');

async function exportQuiz() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: {
          include: {
            options: true
          }
        },
        submissions: true
      }
    });
    
    fs.writeFileSync('quiz_seed.json', JSON.stringify(quizzes, null, 2));
    console.log(`Berhasil mengekspor ${quizzes.length} kuis beserta soal dan pesertanya ke quiz_seed.json!`);
  } catch (err) {
    console.error('Error exporting quiz data:', err);
  } finally {
    process.exit(0);
  }
}

exportQuiz();
