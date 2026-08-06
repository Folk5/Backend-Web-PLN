const prisma = require('./config/db');
async function check() {
  const quiz = await prisma.quiz.findUnique({where: {code: '7AY4B8'}});
  console.dir(quiz, { depth: null });
}
check().finally(() => process.exit(0));
