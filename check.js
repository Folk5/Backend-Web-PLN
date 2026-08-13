require('dotenv').config();
const prisma = require('./config/db');
async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'instruktur@gmail.com' } });
  console.log('User data:', user);
}
main().finally(() => prisma.$disconnect());
