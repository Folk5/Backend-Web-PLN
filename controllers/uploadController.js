/**
 * controllers/uploadController.js
 * Menangani upload file fisik ke Supabase Storage.
 * - uploadFile  → bucket 'assets-3d' (file .glb / .gltf)
 * - uploadImage → bucket 'images'    (file JPG / PNG / WEBP)
 */

const supabase = require('../config/supabase');

// ── Upload File 3D ─────────────────────────────────────────

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'Tidak ada file fisik yang ditemukan. Pastikan parameter key bernama "file".'
            });
        }

        const fileExt  = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}_${Math.round(Math.random() * 1e5)}.${fileExt}`;

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
        res.status(500).json({ error: 'Kesalahan server pada proses upload file', details: err.message });
    }
};

// ── Upload Gambar ──────────────────────────────────────────

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Tidak ada file gambar terdeteksi dalam payload.' });
        }

        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimes.includes(req.file.mimetype)) {
            return res.status(400).json({
                error: 'Format file tidak didukung. Harap gunakan format gambar (JPG, PNG, WEBP).'
            });
        }

        const fileExt  = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}_${Math.round(Math.random() * 1e5)}.${fileExt}`;

        const { error } = await supabase.storage
            .from('images')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (error) {
            console.error('[uploadImage] Supabase error:', error);
            return res.status(500).json({
                error: 'Gagal mengunggah foto ke Supabase Storage (images).',
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
        res.status(500).json({ error: 'Kesalahan server pada proses upload gambar', details: err.message });
    }
};
