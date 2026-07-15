require('dotenv').config();
const prisma = require('./config/db.js');
const bcrypt = require('bcrypt');

async function seed() {
  const hash = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'updl@pln.co.id' },
    update: { role: 'UPDL', password_hash: hash },
    create: { email: 'updl@pln.co.id', name: 'User UPDL', password_hash: hash, role: 'UPDL' }
  });
  
  await prisma.user.upsert({
    where: { email: 'instruktur@pln.co.id' },
    update: { role: 'Instruktur', password_hash: hash },
    create: { email: 'instruktur@pln.co.id', name: 'User Instruktur', password_hash: hash, role: 'Instruktur' }
  });
  
  await prisma.user.upsert({
    where: { email: 'peserta@pln.co.id' },
    update: { role: 'Peserta', password_hash: hash },
    create: { email: 'peserta@pln.co.id', name: 'User Peserta', password_hash: hash, role: 'Peserta' }
  });
  
  console.log('Users seeded');
}

seed().catch(console.error).finally(() => process.exit(0));
