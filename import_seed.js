const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = require('./config/db');

async function main() {
  if (!fs.existsSync('seed_data.json')) {
    console.error('❌ seed_data.json tidak ditemukan! Minta temanmu mengirimkan file ini.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync('seed_data.json', 'utf8'));
  
  console.log('🔄 Memulai proses impor data...');

  // 1. Upsert Users
  if (data.users && data.users.length > 0) {
    let usersAdded = 0;
    for (const u of data.users) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          id: u.id,
          email: u.email,
          password_hash: u.password_hash,
          name: u.name,
          unit: u.unit,
          status: 'Offline',
          role: u.role
        }
      });
      usersAdded++;
    }
    console.log(`✅ ${usersAdded} User (tester, instruktur, updl) berhasil dipastikan ada.`);
  }

  // 2. Clear and Insert Katalog Instruktur
  if (data.katalog && data.katalog.length > 0) {
    console.log('🗑️  Menghapus data Katalog Instruktur lama (jika ada)...');
    await prisma.katalogInstruktur.deleteMany();
    
    console.log('📥 Memasukkan data Katalog Instruktur dari temanmu...');
    const result = await prisma.katalogInstruktur.createMany({
      data: data.katalog
    });
    console.log(`✅ ${result.count} data Katalog Instruktur berhasil dimasukkan!`);
  } else {
    console.log('⚠️  Tidak ada data Katalog Instruktur di seed_data.json');
  }

  console.log('🎉 Selesai! Semua data telah tergabung.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
