const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const quizController = require('./controllers/quizController');

async function run() {
  const q = await prisma.quiz.findFirst();
  if(!q) return console.log('No quiz');
  const req = { params: { id: q.id }, user: { role: 'Admin' } };
  const res = {
    status: (code) => ({ json: (data) => console.log(code, data) }),
    json: (data) => console.log('200', data)
  };
  await quizController.deleteQuiz(req, res);
}
run().finally(()=>prisma.$disconnect());
