/**
 * controllers/toolController.js
 * CRUD untuk entitas Peralatan/Tools (tools).
 */

const supabase = require('../config/supabase');
const { deleteFromStorage } = require('./helpers/storage');

// ── GET ────────────────────────────────────────────────────

exports.getTools = async (req, res) => {
    try {
        const search = req.query.search;
        let query = supabase.from('tools').select('*');

        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
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
    const { data, error } = await supabase.from('tools').insert([toolData]).select();
    if (error) return res.status(400).json({ error: error.message });
    console.log(`[INFO] Peralatan Baru Ditambahkan: ${data[0].name} (ID: ${data[0].id})`);
    res.json({ message: 'Peralatan/Tool berhasil ditambahkan', data: data[0] });
};

// ── PUT ────────────────────────────────────────────────────

exports.updateTool = async (req, res) => {
    const { id } = req.params;
    const bodyArgs = req.body;

    try {
        // Ambil data lama (file3d + image) untuk komparasi
        const { data: oldTool } = await supabase.from('tools').select('file3d, image').eq('id', id).single();

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

        const { error } = await supabase.from('tools').update(bodyArgs).eq('id', id);
        if (error) throw error;

        res.json({ message: 'Peralatan berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal update peralatan', details: err.message });
    }
};

// ── DELETE ─────────────────────────────────────────────────

exports.deleteTool = async (req, res) => {
    const { id } = req.params;
    try {
        const { data: tool } = await supabase.from('tools').select('file3d, image').eq('id', id).single();

        if (tool) {
            await deleteFromStorage('assets-3d', tool.file3d);
            await deleteFromStorage('images', tool.image);
        }

        const { error } = await supabase.from('tools').delete().eq('id', id);
        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: 'Peralatan, file 3D, dan gambar berhasil dihapus permanen' });
    } catch (err) {
        console.error('[deleteTool] Error:', err);
        res.status(500).json({ error: 'Gagal menghapus peralatan', details: err.message });
    }
};
