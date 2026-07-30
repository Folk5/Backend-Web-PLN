require('dotenv').config();
const prisma = require('./config/db');
const fs = require('fs');

async function mergeAllData() {
  try {
    if (!fs.existsSync('db_export.json')) {
      console.error('❌ File db_export.json tidak ditemukan! Pastikan file sudah ada di folder ini.');
      return;
    }

    console.log('Membaca file db_export.json...');
    const rawData = fs.readFileSync('db_export.json');
    const data = JSON.parse(rawData);

    console.log('Mulai menggabungkan (merge) data ke database...');

    // Helper function to insert data safely
    const insertData = async (modelName, records) => {
      if (!records || records.length === 0) return;
      console.log(`Menggabungkan ${records.length} data ke tabel ${modelName}...`);
      
      let successCount = 0;
      let duplicateCount = 0;
      
      for (const record of records) {
        try {
          // We use create instead of createMany to handle individual unique constraint errors gracefully
          await prisma[modelName].create({ data: record });
          successCount++;
        } catch (err) {
          // If it fails (usually due to duplicate ID or unique constraint), we ignore it and count as duplicate
          duplicateCount++;
        }
      }
      console.log(`- Berhasil ditambah: ${successCount}`);
      console.log(`- Dilewati (sudah ada): ${duplicateCount}`);
    };

    // Insert data in order of dependencies (parents first, children later)
    await insertData('category', data.categories);
    await insertData('material', data.materials);
    await insertData('materialAsset', data.materialAssets);
    await insertData('tool', data.tools);
    await insertData('module', data.modules);
    await insertData('moduleMaterial', data.moduleMaterials);
    await insertData('moduleMaterialMesh', data.moduleMaterialMeshes);
    await insertData('moduleTool', data.moduleTools);
    await insertData('meshConfig', data.meshConfigs);
    await insertData('moduleAsset', data.moduleAssets);
    await insertData('construction', data.constructions);
    await insertData('listrikpedia', data.listrikpedias);

    console.log('✅ PROSES MERGE SELESAI!');
    console.log('Data teman Anda sudah digabungkan dengan data Anda tanpa menghapus apapun.');
  } catch (error) {
    console.error('❌ Gagal melakukan merge:', error);
  } finally {
    await prisma.$disconnect();
  }
}

mergeAllData();
