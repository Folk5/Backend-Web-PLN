const prisma = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getBackgrounds = async (req, res) => {
  try {
    const backgrounds = await prisma.backgroundImage.findMany({
      orderBy: { created_at: 'asc' },
    });
    res.json(backgrounds);
  } catch (error) {
    console.error('Error fetching backgrounds:', error);
    res.status(500).json({ error: 'Terjadi kesalahan internal' });
  }
};

exports.addBackground = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
    }

    const ext = req.file.originalname.split('.').pop().toLowerCase();
    const fileName = `bg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const dir = path.join(__dirname, '../public/uploads/backgrounds');
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, req.file.buffer);

    const fileUrl = `/uploads/backgrounds/${fileName}`;

    const newBg = await prisma.backgroundImage.create({
      data: { file: fileUrl },
    });

    res.status(201).json(newBg);
  } catch (error) {
    console.error('Error adding background:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan background' });
  }
};

exports.deleteBackground = async (req, res) => {
  try {
    const { id } = req.params;
    const bg = await prisma.backgroundImage.findUnique({ where: { id } });
    
    if (!bg) {
      return res.status(404).json({ error: 'Background tidak ditemukan' });
    }

    // Hapus file dari sistem
    const fileName = bg.file.split('/').pop();
    const filePath = path.join(__dirname, '../public/uploads/backgrounds', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.backgroundImage.delete({ where: { id } });
    res.json({ message: 'Background berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting background:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus background' });
  }
};
