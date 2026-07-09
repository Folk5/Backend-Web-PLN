const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const m = await prisma.module.findMany({
    where: { title: { contains: 'rumah', mode: 'insensitive' } },
    include: { assets: true }
  });
  console.log(JSON.stringify(m, null, 2));
}

main().finally(() => prisma.$disconnect());
