/**
 * controllers/categoryController.js
 * CRUD untuk entitas Categories (kategori dinamis).
 */

const prisma = require('../config/db');

// ── GET ────────────────────────────────────────────────────
exports.getCategories = async (req, res) => {
  try {
    const { type } = req.query; // Opsional: ?type=material atau ?type=tool

    const data = await prisma.category.findMany({
      where: type ? { type } : undefined,
      orderBy: { created_at: 'asc' },
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data kategori', details: err.message });
  }
};

// ── POST ───────────────────────────────────────────────────
exports.createCategory = async (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: 'Nama dan Tipe kategori wajib diisi' });
  }

  // Buat value dari name (huruf kecil, spasi diganti strip)
  const value = name.toLowerCase().replace(/\s+/g, '-');

  try {
    const category = await prisma.category.create({
      data: { name, value, type },
    });

    res.json({ message: 'Kategori berhasil ditambahkan', data: category });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// ── PUT ────────────────────────────────────────────────────
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;

  const updateData = {};
  if (name) {
    updateData.name = name;
    updateData.value = name.toLowerCase().replace(/\s+/g, '-');
  }
  if (type) updateData.type = type;

  try {
    await prisma.category.update({
      where: { id },
      data: updateData,
    });

    res.json({ message: 'Kategori berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal update kategori', details: err.message });
  }
};

// ── DELETE ─────────────────────────────────────────────────
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus kategori', details: err.message });
  }
};
