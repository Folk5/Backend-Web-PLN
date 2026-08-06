const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  const quiz = await prisma.quiz.findFirst();
  console.log('Quiz id:', quiz?.id);
  if (quiz) {
    try {
      await prisma.quiz.delete({ where: { id: quiz.id } });
      console.log('Deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }
}
test().catch(console.error).finally(() => prisma.$disconnect());
