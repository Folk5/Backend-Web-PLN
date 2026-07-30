require('dotenv').config();
const prisma = require('./config/db');
const fs = require('fs');

async function exportAllData() {
  try {
    console.log('Mengekspor seluruh data dari database...');
    
    const categories = await prisma.category.findMany();
    const materials = await prisma.material.findMany();
    const materialAssets = await prisma.materialAsset.findMany();
    const tools = await prisma.tool.findMany();
    const modules = await prisma.module.findMany();
    const moduleMaterials = await prisma.moduleMaterial.findMany();
    const moduleMaterialMeshes = await prisma.moduleMaterialMesh.findMany();
    const moduleTools = await prisma.moduleTool.findMany();
    const meshConfigs = await prisma.meshConfig.findMany();
    const moduleAssets = await prisma.moduleAsset.findMany();
    const constructions = await prisma.construction.findMany();
    const listrikpedias = await prisma.listrikpedia.findMany();
    
    const exportData = {
      categories,
      materials,
      materialAssets,
      tools,
      modules,
      moduleMaterials,
      moduleMaterialMeshes,
      moduleTools,
      meshConfigs,
      moduleAssets,
      constructions,
      listrikpedias
    };

    fs.writeFileSync('db_export.json', JSON.stringify(exportData, null, 2));
    console.log('✅ Berhasil mengekspor data ke db_export.json!');
    console.log('Silakan kirim file db_export.json ini ke teman Anda.');
  } catch (error) {
    console.error('❌ Gagal mengekspor data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportAllData();
