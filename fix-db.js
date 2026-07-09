require('dotenv').config();
const prisma = require('./config/db');
async function fixDB() {
  try {
    const moduleId = 'f3ed4576-c0a0-4601-9f52-db483eb87cc0';
    // Update all assets for this module to use an existing GLB file
    const res = await prisma.moduleAsset.updateMany({
      where: { module_id: moduleId },
      data: { file: '/uploads/assets-3d/1783051488076_18712.glb' }
    });
    console.log('Fixed DB successfully:', res);
  } catch (err) {
    console.error('Failed to fix DB:', err);
  } finally {
    await prisma.$disconnect();
  }
}

fixDB();
