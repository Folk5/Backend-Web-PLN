require('dotenv').config();
const prisma = require('./config/db');
async function main() {
  const adminUser = await prisma.user.update({
    where: { email: 'admin@gmail.com' },
    data: { role: 'Admin' }
  });
  console.log('Updated Admin User:', adminUser);
}
main().catch(console.error).finally(() => prisma.$disconnect());
