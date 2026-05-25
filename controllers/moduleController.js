/**
 * controllers/moduleController.js
 * CRUD untuk entitas Modul Konstruksi (modules, module_assets, module_materials, module_tools).
 */

const prisma = require('../config/db');
const { deleteFromStorage } = require('./helpers/storage');
const { randomUUID } = require('crypto');

// ── GET ────────────────────────────────────────────────────

exports.getModules = async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const sort = req.query.sort || 'newest';
    const search = req.query.search;
    const statusFilter = req.query.status;

    const where = {};
    if (statusFilter) {
      where.status = statusFilter;
    } else if (!showAll) {
      where.status = 'Aktif';
    }
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    let orderBy = { created_at: 'desc' };
    if (sort === 'name_asc') orderBy = { title: 'asc' };
    else if (sort === 'name_desc') orderBy = { title: 'desc' };

    const data = await prisma.module.findMany({
      where,
      orderBy,
      include: {
        assets: true,
        _count: {
          select: { materials: true, tools: true }
        }
      }
    });

    const result = data.map((m) => {
      const { _count, ...rest } = m;
      return {
        ...rest,
        materialCount: _count.materials,
        equipmentCount: _count.tools,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data modul', details: err.message });
  }
};

exports.getModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await prisma.module.findUnique({
      where: { id },
      include: {
        assets: true,
        materials: {
          select: {
            id: true,
            quantity: true,
            mesh_name: true,
            material: {
              include: { 
                assets: true,
                category: true
              }
            }
          }
        },
        tools: {
          select: {
            id: true,
            mesh_name: true,
            tool: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!data) return res.status(404).json({ error: 'Modul tidak ditemukan' });

    const result = {
      ...data,
      materialCount: data.materials ? data.materials.length : 0,
      equipmentCount: data.tools ? data.tools.length : 0,
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data modul', details: err.message });
  }
};

// ── POST ───────────────────────────────────────────────────

exports.createModule = async (req, res) => {
  const { assets, materials, tools, ...moduleData } = req.body;

  if (!moduleData.id) {
    moduleData.id = randomUUID();
  }

  try {
    const newModule = await prisma.module.create({
      data: {
        ...moduleData,
        materials: materials && materials.length > 0 ? {
          create: materials.map(m => ({
            material_id: m.material_id,
            quantity: m.quantity || 1
          }))
        } : undefined,
        tools: tools && tools.length > 0 ? {
          create: tools.map(t => ({
            tool_id: t.tool_id
          }))
        } : undefined
      }
    });

    console.log(`[INFO] Modul Konstruksi Baru Ditambahkan: ${newModule.title} (ID: ${newModule.id})`);
    res.json({ message: 'Module berhasil dibuat', data: newModule });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

// ── PUT ────────────────────────────────────────────────────

exports.updateModule = async (req, res) => {
  const { id } = req.params;
  const { assets, materials, tools, ...moduleData } = req.body;

  try {
    // 0. Hapus gambar lama jika image diubah/dihapus
    if ('image' in moduleData) {
      const oldModule = await prisma.module.findUnique({
        where: { id },
        select: { image: true },
      });
      if (oldModule && oldModule.image && oldModule.image !== moduleData.image) {
        await deleteFromStorage('images', oldModule.image);
      }
    }

    // 1. Update data modul
    await prisma.module.update({
      where: { id },
      data: moduleData,
    });

    // 2. Ambil assets lama
    const oldAssets = await prisma.moduleAsset.findMany({
      where: { module_id: id },
    });

    // 3. Sinkronisasi assets
    if (assets && Array.isArray(assets)) {
      const newAssetIds = assets.map((a) => a.id).filter(Boolean);
      const assetsToDelete = oldAssets.filter((oa) => !newAssetIds.includes(oa.id));

      if (assetsToDelete.length > 0) {
        for (const file of assetsToDelete.map(a => a.file).filter(Boolean)) {
           await deleteFromStorage('assets-3d', file);
        }
        await prisma.moduleAsset.deleteMany({
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
            await prisma.moduleAsset.update({
              where: { id: a.id },
              data: { name: a.name, file: a.file },
            });
          }
        } else {
          // Varian baru dari edit modal — generate UUID jika tidak ada id
          const newId = a.id || randomUUID();
          await prisma.moduleAsset.create({
            data: {
              id: newId,
              module_id: id,
              name: a.name,
              file: a.file || '-',
            },
          });
        }
      }
    }

    // 4. Sinkronisasi materials
    if (materials && Array.isArray(materials)) {
      await prisma.moduleMaterial.deleteMany({ where: { module_id: id } });
      if (materials.length > 0) {
        await prisma.moduleMaterial.createMany({
          data: materials.map(m => ({
            module_id: id,
            material_id: m.material_id,
            quantity: m.quantity || 1
          }))
        });
      }
    }

    // 5. Sinkronisasi tools
    if (tools && Array.isArray(tools)) {
      await prisma.moduleTool.deleteMany({ where: { module_id: id } });
      if (tools.length > 0) {
        await prisma.moduleTool.createMany({
          data: tools.map(t => ({
            module_id: id,
            tool_id: t.tool_id
          }))
        });
      }
    }

    res.json({ message: 'Module berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal update module', details: err.message });
  }
};

// ── DELETE ─────────────────────────────────────────────────

exports.deleteModule = async (req, res) => {
  const { id } = req.params;
  try {
    const moduleItem = await prisma.module.findUnique({
      where: { id },
      select: { image: true },
    });
    const assets = await prisma.moduleAsset.findMany({
      where: { module_id: id },
      select: { file: true },
    });

    // Hapus file 3D
    if (assets && assets.length > 0) {
      for (const a of assets) {
         await deleteFromStorage('assets-3d', a.file);
      }
    }

    // Hapus gambar thumbnail
    if (moduleItem && moduleItem.image) {
      await deleteFromStorage('images', moduleItem.image);
    }

    // Hapus dari database (CASCADE ke module_assets, module_materials, module_tools)
    await prisma.module.delete({ where: { id } });

    res.json({ message: 'Module, file 3D, dan gambar berhasil dihapus permanen' });
  } catch (err) {
    console.error('[deleteModule] Error:', err);
    res.status(500).json({ error: 'Gagal menghapus module', details: err.message });
  }
};
