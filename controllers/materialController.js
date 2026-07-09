/**
 * controllers/materialController.js
 * CRUD untuk entitas Material (materials, material_assets).
 */

const prisma = require('../config/db');
const { extractStoragePath, deleteFromStorage } = require('./helpers/storage');
const { randomUUID } = require('crypto');

async function autoSyncMaterialToConstruction(materialId) {
  return; // DISABLED: Mencegah material otomatis masuk ke manajemen konstruksi
  try {
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      include: { categories: true }
    });
    if (!material) return;

    const allConstructions = await prisma.construction.findMany();
    const materialCatNames = material.categories.map(c => c.name.toLowerCase());
    const matchingConstructions = allConstructions.filter(c => materialCatNames.includes(c.name.toLowerCase()));
    const matchingConstructionIds = matchingConstructions.map(c => c.id);

    const candidateModules = await prisma.module.findMany({
      where: { materials: { some: { material_id: material.id } } },
      include: { materials: true, tools: true }
    });

    const shadowModules = candidateModules.filter(m => m.materials.length === 1 && m.tools.length === 0);

    for (const shadow of shadowModules) {
      if (!shadow.construction_id || !matchingConstructionIds.includes(shadow.construction_id)) {
        await prisma.module.delete({ where: { id: shadow.id } });
        console.log(`[SYNC] Deleted orphan auto-module '${shadow.title}'`);
      }
    }

    for (const construction of matchingConstructions) {
      let existingMod = shadowModules.find(m => m.construction_id === construction.id);

      if (!existingMod) {
        const mod = await prisma.module.create({
          data: {
            title: material.name,
            description: material.description || '',
            image: material.image || null,
            status: 'Aktif',
            construction_id: construction.id
          }
        });
        await prisma.moduleMaterial.create({
          data: {
            module_id: mod.id,
            material_id: material.id,
            quantity: 1
          }
        });
        console.log(`[SYNC] Auto-created module '${mod.title}' for construction '${construction.name}'`);
      } else {
        await prisma.module.update({
          where: { id: existingMod.id },
          data: { 
            title: material.name,
            image: material.image || null,
            description: material.description || '' 
          }
        });
      }
    }
  } catch (err) {
    console.error('[SYNC ERROR] Failed to auto-sync material:', err);
  }
}


// ── GET ────────────────────────────────────────────────────

exports.getMaterials = async (req, res) => {
  try {
    const data = await prisma.material.findMany({
      include: {
        assets: true,
        categories: {
          select: { id: true, name: true, value: true },
        },
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data material', details: err.message });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await prisma.material.findUnique({
      where: { id },
      include: {
        assets: true,
        categories: {
          select: { id: true, name: true, value: true },
        },
      },
    });
    if (!data) return res.status(404).json({ error: 'Material tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data material', details: err.message });
  }
};

// ── GET ────────────────────────────────────────────────────

exports.getMaterialsByConstruction = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Cari relasi ModuleMaterial dimana modul-nya memiliki construction dengan slug tersebut
    const moduleMaterials = await prisma.moduleMaterial.findMany({
      where: {
        module: {
          construction: {
            slug: slug
          }
        }
      },
      include: {
        material: {
          include: {
            assets: true,
            categories: {
              select: { id: true, name: true, value: true },
            },
          }
        }
      }
    });

    // Ambil material unik dari modul-modul tersebut
    const materialsMap = new Map();
    moduleMaterials.forEach(mm => {
      if (mm.material && !materialsMap.has(mm.material.id)) {
        materialsMap.set(mm.material.id, mm.material);
      }
    });

    res.json(Array.from(materialsMap.values()));
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data material berdasarkan konstruksi', details: err.message });
  }
};

exports.createMaterial = async (req, res) => {
  const { categories, ...materialData } = req.body;
  if (!materialData.id) {
    materialData.id = randomUUID();
  }
  try {
    const data = await prisma.material.create({
      data: {
        ...materialData,
        categories: categories && categories.length > 0 ? {
          connect: categories.map(id => ({ id }))
        } : undefined
      },
    });
    console.log(`[INFO] Material Baru Ditambahkan: ${data.name} (ID: ${data.id})`);
    
    // Trigger auto-sync (Disabled)
    // await autoSyncMaterialToConstruction(data.id);
    
    res.json({ message: 'Material berhasil ditambahkan', data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// ── PUT ────────────────────────────────────────────────────

exports.updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { assets, categories, ...materialData } = req.body;

  try {
    // 0. Hapus gambar lama jika image diubah/dihapus
    if ('image' in materialData) {
      const oldMaterial = await prisma.material.findUnique({
        where: { id },
        select: { image: true },
      });
      if (oldMaterial && oldMaterial.image && oldMaterial.image !== materialData.image) {
        await deleteFromStorage('images', oldMaterial.image);
      }
    }

    // 1. Update data material
    await prisma.material.update({
      where: { id },
      data: {
        ...materialData,
        categories: categories ? {
          set: categories.map(catId => ({ id: catId }))
        } : undefined
      },
    });

    // 2. Ambil assets lama
    const oldAssets = await prisma.materialAsset.findMany({
      where: { material_id: id },
    });

    // 3. Sinkronisasi assets
    if (assets && Array.isArray(assets)) {
      const newAssetIds = assets.map((a) => a.id).filter(Boolean);
      const assetsToDelete = oldAssets.filter((oa) => !newAssetIds.includes(oa.id));

      if (assetsToDelete.length > 0) {
        for (const file of assetsToDelete.map(a => a.file).filter(Boolean)) {
           await deleteFromStorage('assets-3d', file);
        }
        await prisma.materialAsset.deleteMany({
          where: { id: { in: assetsToDelete.map((a) => a.id) } },
        });
      }

      for (const a of assets) {
        const existing = oldAssets.find((oa) => oa.id === a.id);
        if (existing) {
          if (existing.name !== a.name || existing.file !== a.file) {
            if (existing.file !== a.file && existing.file !== '-') {
              await deleteFromStorage('assets-3d', existing.file);
            }
            await prisma.materialAsset.update({
              where: { id: a.id },
              data: { name: a.name, file: a.file },
            });
          }
        } else {
          // Varian baru dari edit modal — generate UUID jika tidak ada id
          const newId = a.id || randomUUID();
          await prisma.materialAsset.create({
            data: {
              id: newId,
              material_id: id,
              name: a.name,
              file: a.file || '-',
            },
          });
        }
      }
    }

    // Trigger auto-sync (Disabled)
    // await autoSyncMaterialToConstruction(id);

    res.json({ message: 'Material berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal update material', details: err.message });
  }
};

// ── DELETE ─────────────────────────────────────────────────

exports.deleteMaterial = async (req, res) => {
  const { id } = req.params;
  try {
    const material = await prisma.material.findUnique({
      where: { id },
      select: { image: true },
    });
    
    const assets = await prisma.materialAsset.findMany({
      where: { material_id: id },
      select: { file: true },
    });

    // Hapus file 3D
    if (assets && assets.length > 0) {
      for (const a of assets) {
        await deleteFromStorage('assets-3d', a.file);
      }
    }

    // Hapus gambar thumbnail
    if (material && material.image) {
      await deleteFromStorage('images', material.image);
    }

    // Hapus shadow modules sebelum material dihapus (Disabled)
    /*
    const candidateModules = await prisma.module.findMany({
      where: { materials: { some: { material_id: id } } },
      include: { materials: true, tools: true }
    });
    const shadowModules = candidateModules.filter(m => m.materials.length === 1 && m.tools.length === 0);
    for (const shadow of shadowModules) {
      await prisma.module.delete({ where: { id: shadow.id } });
      console.log(`[SYNC] Deleted auto-module '${shadow.title}' prior to material deletion.`);
    }
    */

    // Hapus dari database (CASCADE ke material_assets akan jalan karena relasi prisma/DB onDelete: Cascade)
    await prisma.material.delete({ where: { id } });

    res.json({ message: 'Material, file 3D, dan gambar berhasil dihapus permanen' });
  } catch (err) {
    console.error('[deleteMaterial] Error:', err);
    res.status(500).json({ error: 'Gagal menghapus material', details: err.message });
  }
};
