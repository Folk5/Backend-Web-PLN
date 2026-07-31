const router = require('express').Router();
const prisma = require('../config/db');
const requireAuth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi multer untuk upload file ke /public/uploads/backgrounds
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../public/uploads/backgrounds');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET semua backgrounds
router.get('/', async (req, res) => {
  try {
    const backgrounds = await prisma.background.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(backgrounds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data background' });
  }
});

// POST background baru
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File tidak ditemukan' });
    }
    
    // Simpan path ke database
    const fileUrl = `/uploads/backgrounds/${req.file.filename}`;
    
    const bg = await prisma.background.create({
      data: {
        file: fileUrl
      }
    });
    
    res.json(bg);
  } catch (err) {
    console.error('ERROR POST BACKGROUND:', err);
    res.status(500).json({ error: 'Gagal upload background: ' + (err.message || 'Unknown error') });
  }
});

// DELETE background
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const bg = await prisma.background.findUnique({ where: { id: req.params.id } });
    if (!bg) {
      return res.status(404).json({ error: 'Background tidak ditemukan' });
    }
    
    // Hapus file fisik
    const filePath = path.join(__dirname, '../public', bg.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await prisma.background.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus background' });
  }
});

module.exports = router;
