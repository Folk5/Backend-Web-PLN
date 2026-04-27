/**
 * controllers/materialController.js
 * CRUD untuk entitas Material (materials, material_assets).
 */

const supabase = require('../config/supabase');
const { extractStoragePath, deleteFromStorage } = require('./helpers/storage');

// ── GET ────────────────────────────────────────────────────

exports.getMaterials = async (req, res) => {
    const { data, error } = await supabase
        .from('materials')
        .select('*, assets:material_assets(*)');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

// ── POST ───────────────────────────────────────────────────

exports.createMaterial = async (req, res) => {
    const { data, error } = await supabase.from('materials').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Material berhasil ditambahkan', data: data[0] });
};

// ── PUT ────────────────────────────────────────────────────

exports.updateMaterial = async (req, res) => {
    const { id } = req.params;
    const { assets, ...materialData } = req.body;

    try {
        // 0. Hapus gambar lama jika image diubah/dihapus
        if ('image' in materialData) {
            const { data: oldMaterial } = await supabase.from('materials').select('image').eq('id', id).single();
            if (oldMaterial && oldMaterial.image && oldMaterial.image !== materialData.image) {
                await deleteFromStorage('images', oldMaterial.image);
            }
        }

        // 1. Update data material
        const { error: errMat } = await supabase.from('materials').update(materialData).eq('id', id);
        if (errMat) throw errMat;

        // 2. Ambil assets lama
        const { data: oldAssets } = await supabase.from('material_assets').select('*').eq('material_id', id);

        // 3. Sinkronisasi assets
        if (assets && Array.isArray(assets)) {
            const newAssetIds = assets.map(a => a.id).filter(Boolean);
            const assetsToDelete = oldAssets.filter(oa => !newAssetIds.includes(oa.id));

            if (assetsToDelete.length > 0) {
                const pathsToDelete = assetsToDelete
                    .map(a => extractStoragePath(a.file, 'assets-3d'))
                    .filter(Boolean);
                if (pathsToDelete.length > 0) {
                    await supabase.storage.from('assets-3d').remove(pathsToDelete);
                }
                await supabase.from('material_assets').delete().in('id', assetsToDelete.map(a => a.id));
            }

            for (let a of assets) {
                const existing = oldAssets.find(oa => oa.id === a.id);
                if (existing) {
                    if (existing.name !== a.name || existing.file !== a.file) {
                        if (existing.file !== a.file && existing.file !== '-') {
                            await deleteFromStorage('assets-3d', existing.file);
                        }
                        await supabase.from('material_assets').update({ name: a.name, file: a.file }).eq('id', a.id);
                    }
                } else {
                    await supabase.from('material_assets').insert([{
                        id: a.id, material_id: id, name: a.name, file: a.file
                    }]);
                }
            }
        }

        res.json({ message: 'Material berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal update material', details: err.message });
    }
};

// ── DELETE ─────────────────────────────────────────────────

exports.deleteMaterial = async (req, res) => {
    const { id } = req.params;
    try {
        const [{ data: material }, { data: assets }] = await Promise.all([
            supabase.from('materials').select('image').eq('id', id).single(),
            supabase.from('material_assets').select('file').eq('material_id', id)
        ]);

        // Hapus file 3D
        if (assets && assets.length > 0) {
            const paths = assets.map(a => extractStoragePath(a.file, 'assets-3d')).filter(Boolean);
            if (paths.length > 0) {
                const { error: storageErr } = await supabase.storage.from('assets-3d').remove(paths);
                if (storageErr) console.error('[deleteMaterial] Storage 3D error:', storageErr.message);
                else console.log(`[deleteMaterial] Hapus ${paths.length} file 3D`);
            }
        }

        // Hapus gambar thumbnail
        if (material && material.image) {
            await deleteFromStorage('images', material.image);
        }

        // Hapus dari database (CASCADE ke material_assets)
        const { error } = await supabase.from('materials').delete().eq('id', id);
        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: 'Material, file 3D, dan gambar berhasil dihapus permanen' });
    } catch (err) {
        console.error('[deleteMaterial] Error:', err);
        res.status(500).json({ error: 'Gagal menghapus material', details: err.message });
    }
};
