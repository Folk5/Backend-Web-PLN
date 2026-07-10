/**
 * controllers/moduleController.js
 * CRUD untuk entitas Modul Konstruksi (modules, module_assets, module_materials, module_tools).
 */

const prisma = require('../config/db');
const { deleteFromStorage } = require('./helpers/storage');
const { randomUUID } = require('crypto');

const parseFloatOrNull = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
};

// ── GET ────────────────────────────────────────────────────

exports.getModules = async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const sort = req.query.sort || 'newest';
    const search = req.query.search;
    const statusFilter = req.query.status;
    const categorySlug = req.query.category;

    const where = {};
    if (statusFilter) {
      where.status = statusFilter;
    } else if (!showAll) {
      where.status = 'Aktif';
    }
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (categorySlug) {
      const rootCat = await prisma.construction.findUnique({ where: { slug: categorySlug } });
      if (rootCat) {
        let catIds = [rootCat.id];
        const children = await prisma.construction.findMany({ where: { parent_id: rootCat.id } });
        if (children.length > 0) {
          const childIds = children.map(c => c.id);
          catIds.push(...childIds);
          const grandchildren = await prisma.construction.findMany({ where: { parent_id: { in: childIds } } });
          catIds.push(...grandchildren.map(c => c.id));
        }
        where.construction_id = { in: catIds };
      } else {
        // If category slug is invalid, force empty result
        where.construction_id = '00000000-0000-0000-0000-000000000000';
      }
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
        },
        construction: {
          select: { id: true, name: true, slug: true, level: true }
        }
      }
    });

    let result = data.map((m) => {
      const { _count, ...rest } = m;
      return {
        ...rest,
        materialCount: _count.materials,
        equipmentCount: _count.tools,
      };
    });

    // Deduplikasi berdasar title agar shadow modules (auto-sync) tidak tampil ganda di view
    const uniqueModules = [];
    const seenTitles = new Set();
    for (const m of result) {
      if (!seenTitles.has(m.title)) {
        seenTitles.add(m.title);
        uniqueModules.push(m);
      }
    }
    result = uniqueModules;

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
        construction: {
          select: { id: true, name: true, slug: true, level: true }
        },
        materials: {
          orderBy: { sequence: 'asc' },
          select: {
            id: true,
            quantity: true,
            sequence: true,
            meshes: {
              select: { id: true, mesh_name: true }
            },
            material: {
              include: {
                assets: true,
                categories: true
              }
            }
          }
        },
        tools: {
          orderBy: { sequence: 'asc' },
          select: {
            id: true,
            mesh_name: true,
            sequence: true,
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

    if (assets && assets.length > 0) {
      await prisma.moduleAsset.createMany({
        data: assets.map(a => ({
          module_id: newModule.id,
          name: a.name,
          file: a.file,
          cam_pos_x: parseFloatOrNull(a.cam_pos_x),
          cam_pos_y: parseFloatOrNull(a.cam_pos_y),
          cam_pos_z: parseFloatOrNull(a.cam_pos_z),
          target_x: parseFloatOrNull(a.target_x),
          target_y: parseFloatOrNull(a.target_y),
          target_z: parseFloatOrNull(a.target_z),
          animation: a.animation || 'none'
        }))
      });
    }

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
        const assetData = {
          name: a.name,
          file: a.file || '-',
          cam_pos_x: parseFloatOrNull(a.cam_pos_x),
          cam_pos_y: parseFloatOrNull(a.cam_pos_y),
          cam_pos_z: parseFloatOrNull(a.cam_pos_z),
          target_x: parseFloatOrNull(a.target_x),
          target_y: parseFloatOrNull(a.target_y),
          target_z: parseFloatOrNull(a.target_z),
          animation: a.animation || 'none'
        };

        if (existing) {
          if (
            existing.name !== a.name || 
            existing.file !== a.file ||
            existing.cam_pos_x !== assetData.cam_pos_x ||
            existing.cam_pos_y !== assetData.cam_pos_y ||
            existing.cam_pos_z !== assetData.cam_pos_z ||
            existing.target_x !== assetData.target_x ||
            existing.target_y !== assetData.target_y ||
            existing.target_z !== assetData.target_z ||
            existing.animation !== assetData.animation
          ) {
            if (existing.file !== a.file && existing.file !== '-') {
              await deleteFromStorage('assets-3d', existing.file);
            }
            await prisma.moduleAsset.update({
              where: { id: a.id },
              data: assetData,
            });
          }
        } else {
          // Varian baru dari edit modal — generate UUID jika tidak ada id
          await prisma.moduleAsset.create({
            data: {
              id: a.id || randomUUID(),
              module_id: id,
              ...assetData
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
          data: materials.map((m, i) => ({
            module_id: id,
            material_id: m.material_id,
            quantity: m.quantity || 1,
            sequence: i
          }))
        });
      }
    }

    // 5. Sinkronisasi tools
    if (tools && Array.isArray(tools)) {
      await prisma.moduleTool.deleteMany({ where: { module_id: id } });
      if (tools.length > 0) {
        await prisma.moduleTool.createMany({
          data: tools.map((t, i) => ({
            module_id: id,
            tool_id: t.tool_id,
            sequence: i
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
