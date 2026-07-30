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
      // Hapus data lama agar tidak bentrok NIP atau ID
      await prisma.katalogInstruktur.deleteMany();
      
      let successKatalog = 0;
      for (const item of data.katalog) {
        try {
          await prisma.katalogInstruktur.create({ data: item });
          successKatalog++;
        } catch(e) {
          if (e.message.includes('Unique constraint failed on the fields: (`nip`)')) {
            try {
               item.nip = item.nip + '-' + Math.floor(Math.random() * 10000);
               await prisma.katalogInstruktur.create({ data: item });
               successKatalog++;
            } catch(e2) {
               console.log(`Gagal insert katalog (retry) ${item.nama_instruktur}: ${e2.message}`);
            }
          } else {
             console.log(`Gagal insert katalog ${item.nama_instruktur}: ${e.message}`);
          }
        }
      }
      console.log(`Berhasil insert ${successKatalog} katalog!`);
    }

    // 3. Import Jadwal Instruktur
    if (data.jadwal && data.jadwal.length > 0) {
      console.log(`Mengimport ${data.jadwal.length} jadwal instruktur...`);
      await prisma.jadwalInstruktur.deleteMany();

      let successJadwal = 0;
      for (const item of data.jadwal) {
        try {
          await prisma.jadwalInstruktur.create({ data: item });
          successJadwal++;
        } catch(e) {
          console.log(`Gagal insert jadwal: ${e.message}`);
        }
      }
      console.log(`Berhasil insert ${successJadwal} jadwal!`);
    }

    console.log('Import data berhasil diselesaikan!');
  } catch (error) {
    console.error('Gagal mengimport data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
