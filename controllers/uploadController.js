/**
 * controllers/uploadController.js
 * Menangani upload file fisik ke Local Storage (public/uploads).
 * - uploadFile  → bucket 'assets-3d' (file .glb / .gltf)
 * - uploadImage → bucket 'images'    (file JPG / PNG / WEBP)
 */

const fs = require('fs');
const path = require('path');

const ALLOWED_3D_EXTS = ['glb', 'gltf', 'png', 'jpg', 'jpeg', 'webp'];
const ALLOWED_3D_MIMES = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'image/png', 'image/jpeg', 'image/webp'];
const MAX_3D_SIZE = 100 * 1024 * 1024; // 100 MB

const ALLOWED_IMG_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const MIME_TO_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_IMG_SIZE = 5 * 1024 * 1024; // 5 MB

// ── Helper: Save File ──────────────────────────────────────

const saveFile = (buffer, bucket, fileName) => {
  const dir = path.join(__dirname, '../public/uploads', bucket);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, buffer);
};

// ── Upload File 3D ─────────────────────────────────────────

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Tidak ada file yang diterima. Pastikan parameter key bernama "file".',
      });
    }

    const ext = req.file.originalname.split('.').pop().toLowerCase();
    if (!ALLOWED_3D_EXTS.includes(ext)) {
      return res.status(400).json({
        error: 'Format tidak didukung. Hanya file .glb, .gltf, .png, .jpg, atau .webp yang diizinkan.',
      });
    }

    if (!ALLOWED_3D_MIMES.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: `MIME type "${req.file.mimetype}" tidak valid untuk file media.`,
      });
    }

    if (req.file.size > MAX_3D_SIZE) {
      return res.status(400).json({ error: 'Ukuran file melebihi batas maksimal 100 MB.' });
    }

    const fileName = `${Date.now()}_${Math.round(Math.random() * 1e5)}.${ext}`;

    // Save to local filesystem
    saveFile(req.file.buffer, 'assets-3d', fileName);

    // Simpan sebagai relative path agar tidak terikat pada IP/hostname saat ini.
    // Frontend (PLN-WEB) sudah memiliki proxy /uploads → backend, sehingga
    // path relative ini selalu bisa diakses tanpa perlu tahu IP backend.
    const relativePath = `/uploads/assets-3d/${fileName}`;

    res.json({
      message: 'File 3D berhasil diunggah!',
      fileName,
      publicUrl: relativePath,
    });
  } catch (err) {
    console.error('[uploadFile] Internal error:', err);
    res.status(500).json({ error: 'Kesalahan server saat upload file', details: err.message });
  }
};

// ── Upload Gambar ──────────────────────────────────────────

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada gambar yang diterima.' });
    }

    if (!ALLOWED_IMG_MIMES.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: 'Format tidak didukung. Hanya JPG, PNG, atau WEBP yang diizinkan.',
      });
    }

    if (req.file.size > MAX_IMG_SIZE) {
      return res.status(400).json({ error: 'Ukuran gambar melebihi batas maksimal 5 MB.' });
    }

    const ext = MIME_TO_EXT[req.file.mimetype];
    const fileName = `${Date.now()}_${Math.round(Math.random() * 1e5)}.${ext}`;

    // Save to local filesystem
    saveFile(req.file.buffer, 'images', fileName);

    // Simpan sebagai relative path agar tidak terikat pada IP/hostname saat ini.
    const relativePath = `/uploads/images/${fileName}`;

    res.json({
      message: 'Gambar berhasil diunggah!',
      fileName,
      publicUrl: relativePath,
    });
  } catch (err) {
    console.error('[uploadImage] Internal error:', err);
    res.status(500).json({ error: 'Kesalahan server saat upload gambar', details: err.message });
  }
};
