require('dotenv').config();
const prisma = require('./config/db.js');
const bcrypt = require('bcrypt');

async function updateUsers() {
  const hash = await bcrypt.hash('qwertyui', 10);
  
  // 1. Update updl account
  await prisma.user.updateMany({
    where: { email: 'updl@pln.co.id' },
    data: { email: 'updl@gmail.com', password_hash: hash }
  });

  // If it didn't exist before or was already updated, upsert using gmail
  await prisma.user.upsert({
    where: { email: 'updl@gmail.com' },
    update: { password_hash: hash, role: 'UPDL' },
    create: { email: 'updl@gmail.com', name: 'User UPDL', password_hash: hash, role: 'UPDL' }
  });

  // 2. Update instruktur account
  await prisma.user.updateMany({
    where: { email: 'instruktur@pln.co.id' },
    data: { email: 'instruktur@gmail.com', password_hash: hash }
  });

  await prisma.user.upsert({
    where: { email: 'instruktur@gmail.com' },
    update: { password_hash: hash, role: 'Instruktur' },
    create: { email: 'instruktur@gmail.com', name: 'User Instruktur', password_hash: hash, role: 'Instruktur' }
  });

  // 3. Delete peserta dummy account
  try {
    await prisma.user.delete({
      where: { email: 'peserta@pln.co.id' }
    });
  } catch (err) {
    // ignore if doesn't exist
  }

  // 4. Update farrel and yongky to have "qwertyui" as password (and ensure they are Peserta)
  // Assuming their emails might contain farrel or yongky, let's find them
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: 'farrel', mode: 'insensitive' } },
        { email: { contains: 'yongky', mode: 'insensitive' } },
        { name: { contains: 'farrel', mode: 'insensitive' } },
        { name: { contains: 'yongky', mode: 'insensitive' } }
      ]
    }
  });

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hash, role: 'Peserta' }
    });
    console.log(`Updated password for existing user: ${user.email} (${user.name})`);
  }

  console.log('User accounts updated successfully.');
}

updateUsers().catch(console.error).finally(() => process.exit(0));
