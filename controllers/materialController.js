/**
 * controllers/materialController.js
 * CRUD untuk entitas Material (materials, material_assets).
 */

const prisma = require('../config/db');
const { extractStoragePath, deleteFromStorage } = require('./helpers/storage');
const { randomUUID } = require('crypto');

// ── GET ────────────────────────────────────────────────────

exports.getMaterials = async (req, res) => {
  try {
    const data = await prisma.material.findMany({
      include: {
        assets: true,
        category: {
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
        category: {
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

// ── POST ───────────────────────────────────────────────────

exports.createMaterial = async (req, res) => {
  const materialData = { ...req.body };
  if (!materialData.id) {
    materialData.id = randomUUID();
  }
  try {
    const data = await prisma.material.create({
      data: materialData,
    });
    console.log(`[INFO] Material Baru Ditambahkan: ${data.name} (ID: ${data.id})`);
    res.json({ message: 'Material berhasil ditambahkan', data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// ── PUT ────────────────────────────────────────────────────

exports.updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { assets, ...materialData } = req.body;

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
      data: materialData,
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

    // Hapus dari database (CASCADE ke material_assets akan jalan karena relasi prisma/DB onDelete: Cascade)
    await prisma.material.delete({ where: { id } });

    res.json({ message: 'Material, file 3D, dan gambar berhasil dihapus permanen' });
  } catch (err) {
    console.error('[deleteMaterial] Error:', err);
    res.status(500).json({ error: 'Gagal menghapus material', details: err.message });
  }
};
