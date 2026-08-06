const prisma = require('./config/db');

async function check() {
  try {
    const res = await prisma.quiz.findMany({
      include: { _count: { select: { questions: true } } }
    });
    console.log('Quizzes in DB:', res.map(r => ({ code: r.code, active: r.is_active, count: r._count.questions })));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
