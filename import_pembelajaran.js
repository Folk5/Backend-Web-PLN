require('dotenv').config();
const prisma = require('./config/db');
const fs = require('fs');

async function importData() {
  try {
    if (!fs.existsSync('pembelajaran_data.json')) {
      console.error('File pembelajaran_data.json tidak ditemukan!');
      return;
    }

    const data = JSON.parse(fs.readFileSync('pembelajaran_data.json', 'utf8'));
    console.log('Data ditemukan. Memulai proses import...');

    // 1. Import Users
    if (data.users && data.users.length > 0) {
      console.log(`Mengimport ${data.users.length} users...`);
      for (const user of data.users) {
        await prisma.user.upsert({
          where: { email: user.email },
          update: user,
          create: user
        });
      }
    }

    // 2. Import Katalog Instruktur
    if (data.katalog && data.katalog.length > 0) {
      console.log(`Mengimport ${data.katalog.length} katalog instruktur...`);
      for (const item of data.katalog) {
        await prisma.katalogInstruktur.upsert({
          where: { nip: item.nip },
          update: item,
          create: item
        });
      }
    }

    // 3. Import Jadwal Instruktur
    if (data.jadwal && data.jadwal.length > 0) {
      console.log(`Mengimport ${data.jadwal.length} jadwal instruktur...`);
      for (const item of data.jadwal) {
        await prisma.jadwalInstruktur.upsert({
          where: { id: item.id },
          update: item,
          create: item
        });
      }
    }

    console.log('Import data berhasil diselesaikan tanpa mengganggu tabel lain!');
  } catch (error) {
    console.error('Gagal mengimport data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
