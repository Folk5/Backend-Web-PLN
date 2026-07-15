require('dotenv').config();
const prisma = require('./config/db');
const fs = require('fs');

async function exportData() {
  try {
    console.log('Mengekspor data User (UPDL & Instruktur)...');
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['UPDL', 'Instruktur']
        }
      }
    });

    console.log('Mengekspor data Katalog Instruktur...');
    const katalog = await prisma.katalogInstruktur.findMany();

    console.log('Mengekspor data Jadwal Instruktur...');
    const jadwal = await prisma.jadwalInstruktur.findMany();

    const exportData = {
      users,
      katalog,
      jadwal
    };

    fs.writeFileSync('pembelajaran_data.json', JSON.stringify(exportData, null, 2));
    console.log('Berhasil mengekspor data ke pembelajaran_data.json!');
  } catch (error) {
    console.error('Gagal mengekspor data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
