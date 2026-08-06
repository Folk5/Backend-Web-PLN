const prisma = require('./config/db');

async function test() {
  const code = 'SEFJC1';
  let is_active = false;
  
  const quiz = await prisma.quiz.update({
    where: { code },
    data: { is_active }
  });
  console.log('Quiz updated to:', quiz.is_active);
}
test();
