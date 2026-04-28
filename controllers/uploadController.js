/**
 * controllers/uploadController.js
 * Menangani upload file fisik ke Supabase Storage.
 * - uploadFile  → bucket 'assets-3d' (file .glb / .gltf)
 * - uploadImage → bucket 'images'    (file JPG / PNG / WEBP)
 */

const supabase = require('../config/supabase');

const ALLOWED_3D_EXTS  = ['glb', 'gltf'];
// Browser bisa kirim application/octet-stream untuk .glb, jadi keduanya diizinkan
const ALLOWED_3D_MIMES = ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'];
const MAX_3D_SIZE      = 50 * 1024 * 1024; // 50 MB

const ALLOWED_IMG_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const MIME_TO_EXT       = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_IMG_SIZE      = 5 * 1024 * 1024; // 5 MB

// ── Upload File 3D ─────────────────────────────────────────

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'Tidak ada file yang diterima. Pastikan parameter key bernama "file".'
            });
        }

        const ext = req.file.originalname.split('.').pop().toLowerCase();
        if (!ALLOWED_3D_EXTS.includes(ext)) {
            return res.status(400).json({
                error: 'Format tidak didukung. Hanya file .glb atau .gltf yang diizinkan.'
            });
        }

        if (!ALLOWED_3D_MIMES.includes(req.file.mimetype)) {
            return res.status(400).json({
                error: `MIME type "${req.file.mimetype}" tidak valid untuk file 3D.`
            });
        }

        if (req.file.size > MAX_3D_SIZE) {
            return res.status(400).json({ error: 'Ukuran file melebihi batas maksimal 50 MB.' });
        }

        const fileName = `${Date.now()}_${Math.round(Math.random() * 1e5)}.${ext}`;

        const { error } = await supabase.storage
            .from('assets-3d')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (error) {
            return res.status(500).json({
                error: 'Gagal mengunggah file ke Supabase Storage (assets-3d).',
                details: error.message
            });
        }

        const { data: publicUrlData } = supabase.storage.from('assets-3d').getPublicUrl(fileName);

        res.json({
            message: 'File 3D berhasil diunggah!',
            fileName,
            publicUrl: publicUrlData.publicUrl
        });

    } catch (err) {
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
                error: 'Format tidak didukung. Hanya JPG, PNG, atau WEBP yang diizinkan.'
            });
        }

        if (req.file.size > MAX_IMG_SIZE) {
            return res.status(400).json({ error: 'Ukuran gambar melebihi batas maksimal 5 MB.' });
        }

        // Ekstensi ditentukan dari MIME type, bukan dari nama file asli (mencegah spoofing)
        const ext      = MIME_TO_EXT[req.file.mimetype];
        const fileName = `${Date.now()}_${Math.round(Math.random() * 1e5)}.${ext}`;

        const { error } = await supabase.storage
            .from('images')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (error) {
            console.error('[uploadImage] Supabase error:', error);
            return res.status(500).json({
                error: 'Gagal mengunggah gambar ke Supabase Storage (images).',
                details: error.message
            });
        }

        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);

        res.json({
            message: 'Gambar berhasil diunggah!',
            fileName,
            publicUrl: publicUrlData.publicUrl
        });

    } catch (err) {
        console.error('[uploadImage] Internal error:', err);
        res.status(500).json({ error: 'Kesalahan server saat upload gambar', details: err.message });
    }
};
