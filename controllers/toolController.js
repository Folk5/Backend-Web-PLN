/**
 * controllers/toolController.js
 * CRUD untuk entitas Peralatan/Tools (tools).
 */

const prisma = require('../config/db');
const { deleteFromStorage } = require('./helpers/storage');

// ── GET ────────────────────────────────────────────────────

exports.getTools = async (req, res) => {
  try {
    const search = req.query.search;
    
    const data = await prisma.tool.findMany({
      where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
      include: {
        category: {
          select: { id: true, name: true, value: true }
        }
      }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data peralatan', details: err.message });
  }
};

// ── POST ───────────────────────────────────────────────────

exports.createTool = async (req, res) => {
  const toolData = { ...req.body };
  if (!toolData.id) {
    const { randomUUID } = require('crypto');
    toolData.id = randomUUID();
  }
  
  try {
    const tool = await prisma.tool.create({ data: toolData });
    console.log(`[INFO] Peralatan Baru Ditambahkan: ${tool.name} (ID: ${tool.id})`);
    res.json({ message: 'Peralatan/Tool berhasil ditambahkan', data: tool });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// ── PUT ────────────────────────────────────────────────────

exports.updateTool = async (req, res) => {
  const { id } = req.params;
  const bodyArgs = req.body;

  try {
    // Ambil data lama (file3d + image) untuk komparasi
    const oldTool = await prisma.tool.findUnique({
      where: { id },
      select: { file3d: true, image: true },
    });

    if (oldTool) {
      // Hapus file3d lama jika diganti
      if (bodyArgs.file3d && oldTool.file3d && oldTool.file3d !== bodyArgs.file3d) {
        await deleteFromStorage('assets-3d', oldTool.file3d);
      }
      // Hapus gambar lama jika diganti atau dihapus (image: null)
      if ('image' in bodyArgs && oldTool.image && oldTool.image !== bodyArgs.image) {
        await deleteFromStorage('images', oldTool.image);
      }
    }

    await prisma.tool.update({ where: { id }, data: bodyArgs });

    res.json({ message: 'Peralatan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal update peralatan', details: err.message });
  }
};

// ── DELETE ─────────────────────────────────────────────────

exports.deleteTool = async (req, res) => {
  const { id } = req.params;
  try {
    const tool = await prisma.tool.findUnique({
      where: { id },
      select: { file3d: true, image: true },
    });

    if (tool) {
      await deleteFromStorage('assets-3d', tool.file3d);
      await deleteFromStorage('images', tool.image);
    }

    await prisma.tool.delete({ where: { id } });

    res.json({ message: 'Peralatan, file 3D, dan gambar berhasil dihapus permanen' });
  } catch (err) {
    console.error('[deleteTool] Error:', err);
    res.status(500).json({ error: 'Gagal menghapus peralatan', details: err.message });
  }
};
