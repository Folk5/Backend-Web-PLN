const fs = require('fs');
const prisma = require('./config/db');

async function main() {
  const users = await prisma.user.findMany({
    where: { email: { in: ['tester@gmail.com', 'instruktur@gmail.com', 'updl@gmail.com', 'admin@gmail.com'] } }
  });
  
  const katalog = await prisma.katalogInstruktur.findMany();
  
  const data = {
    users,
    katalog
  };

  fs.writeFileSync('seed_data.json', JSON.stringify(data, null, 2));
  console.log('✅ Data berhasil diekspor ke seed_data.json');
}

main().catch(console.error).finally(() => prisma.$disconnect());
