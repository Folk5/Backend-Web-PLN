require('dotenv').config();
const prisma = require('./config/db');
const fs = require('fs');

async function forceImport() {
  try {
    if (!fs.existsSync('db_export.json')) {
      console.error('❌ File db_export.json tidak ditemukan!');
      return;
    }

    console.log('Membaca file db_export.json...');
    const rawData = fs.readFileSync('db_export.json');
    const data = JSON.parse(rawData);

    console.log('🗑️ Menghapus data lama agar tidak terjadi konflik ID (Foreign Key / Unique Constraint)...');
    
    // Delete in reverse dependency order
    await prisma.moduleAsset.deleteMany();
    await prisma.meshConfig.deleteMany();
    await prisma.moduleMaterialMesh.deleteMany();
    await prisma.moduleMaterial.deleteMany();
    await prisma.moduleTool.deleteMany();
    await prisma.module.deleteMany();
    await prisma.construction.deleteMany();
    await prisma.tool.deleteMany();
    await prisma.materialAsset.deleteMany();
    await prisma.material.deleteMany();
    await prisma.category.deleteMany();
    await prisma.listrikpedia.deleteMany();

    console.log('📥 Memulai proses impor data baru...');

    // Helper function to insert data safely
    const insertData = async (modelName, records) => {
      if (!records || records.length === 0) return;
      console.log(`Menggabungkan ${records.length} data ke tabel ${modelName}...`);
      
      let successCount = 0;
      let duplicateCount = 0;
      
      for (const record of records) {
        try {
          await prisma[modelName].create({ data: record });
          successCount++;
        } catch (err) {
          duplicateCount++;
          console.error(`Gagal insert ${modelName}:`, err.message);
        }
      }
      console.log(`- Berhasil ditambah: ${successCount}`);
      if(duplicateCount > 0) console.log(`- Gagal/Dilewati: ${duplicateCount}`);
    };

    // Correct order: Parents first, then children
    await insertData('category', data.categories);
    await insertData('material', data.materials);
    await insertData('materialAsset', data.materialAssets);
    await insertData('tool', data.tools);
    
    // FIX: construction MUST be before module!
    await insertData('construction', data.constructions);
    await insertData('module', data.modules);
    
    await insertData('moduleMaterial', data.moduleMaterials);
    await insertData('moduleMaterialMesh', data.moduleMaterialMeshes);
    await insertData('moduleTool', data.moduleTools);
    await insertData('meshConfig', data.meshConfigs);
    await insertData('moduleAsset', data.moduleAssets);
    await insertData('listrikpedia', data.listrikpedias);

    console.log('✅ PROSES IMPOR SELESAI!');
  } catch (error) {
    console.error('❌ Gagal melakukan impor:', error);
  } finally {
    await prisma.$disconnect();
  }
}

forceImport();
