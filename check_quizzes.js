const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const quizzes = await prisma.quiz.findMany();
  console.log(quizzes.map(q => ({ code: q.code, is_active: q.is_active })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
