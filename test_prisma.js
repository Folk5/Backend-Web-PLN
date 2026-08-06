const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const start = Date.now();
prisma.user.findUnique({ where: { email: 'admin@gmail.com' } })
  .then(u => console.log('Found in', Date.now() - start, 'ms'))
  .finally(() => prisma.$disconnect());
