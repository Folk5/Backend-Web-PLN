const prisma = require('./config/db');

async function main() {
  const users = await prisma.user.findMany({
    where: { email: { in: ['tester@gmail.com', 'instruktur@gmail.com', 'updl@gmail.com', 'admin@gmail.com'] } }
  });
  const katalog = await prisma.katalogInstruktur.findMany();
  console.log(JSON.stringify({ users, katalog }, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
