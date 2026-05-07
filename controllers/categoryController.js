/**
 * controllers/categoryController.js
 * CRUD untuk entitas Categories (kategori dinamis).
 */

const supabase = require('../config/supabase');

// ── GET ────────────────────────────────────────────────────
exports.getCategories = async (req, res) => {
    try {
        const { type } = req.query; // Opsional: ?type=material atau ?type=tool
        
        let query = supabase.from('categories').select('*').order('created_at', { ascending: true });
        
        if (type) {
            query = query.eq('type', type);
        }

        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        
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

    const { data, error } = await supabase
        .from('categories')
        .insert([{ name, value, type }])
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Kategori berhasil ditambahkan', data: data[0] });
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
        const { error } = await supabase.from('categories').update(updateData).eq('id', id);
        if (error) throw error;

        res.json({ message: 'Kategori berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal update kategori', details: err.message });
    }
};

// ── DELETE ─────────────────────────────────────────────────
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: 'Kategori berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal menghapus kategori', details: err.message });
    }
};
