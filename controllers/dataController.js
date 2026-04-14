const supabase = require('../config/supabase');

// ==========================================
// RUTE GET (MENGAMBIL DATA UNTUK DITAMPILKAN)
// ==========================================

exports.getModules = async (req, res) => {
    // Query param: ?all=true dari admin untuk lihat semua, publik hanya dapat yang Aktif
    const showAll = req.query.all === 'true';

    let query = supabase
        .from('modules')
        .select(`
            *,
            assets:module_assets(*),
            materials:module_materials(
               quantity,
               material:materials(*)
            ),
            tools:module_tools(
               tool:tools(*)
            )
        `);
    
    // Filter: jika tidak minta semua, hanya tampilkan yang Aktif
    if (!showAll) {
        query = query.eq('status', 'Aktif');
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

exports.getModuleById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('modules')
        .select(`
            *,
            assets:module_assets(*),
            materials:module_materials(
               quantity,
               material:materials(*)
            ),
            tools:module_tools(
               tool:tools(*)
            )
        `)
        .eq('id', id)
        .single();
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

exports.getTools = async (req, res) => {
    const { data, error } = await supabase.from('tools').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

exports.getMaterials = async (req, res) => {
    const { data, error } = await supabase.from('materials').select('*, assets:material_assets(*)');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

// ==========================================
// RUTE POST (INPUT DATA DARI ADMIN)
// ==========================================

exports.createModule = async (req, res) => {
    // req.body expects: { id, title, description, image, ... }
    const { data, error } = await supabase.from('modules').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Module berhasil dibuat', data: data[0] });
};

exports.createMaterial = async (req, res) => {
    const { data, error } = await supabase.from('materials').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Material berhasil ditambahkan', data: data[0] });
};

exports.createTool = async (req, res) => {
    const { data, error } = await supabase.from('tools').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Peralatan/Tool berhasil ditambahkan', data: data[0] });
};

// ==========================================
// RUTE PUT (UPDATE DATA)
// ==========================================

exports.updateModule = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('modules').update(req.body).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Module berhasil diperbarui', data: data[0] });
};

exports.updateMaterial = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('materials').update(req.body).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Material berhasil diperbarui', data: data[0] });
};

exports.updateTool = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('tools').update(req.body).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Peralatan berhasil diperbarui', data: data[0] });
};

// ==========================================
// RUTE DELETE (HAPUS PERMANEN)
// ==========================================

// ==========================================
// HELPER: Ekstrak path file dari public URL Supabase Storage
// ==========================================
function extractStoragePath(publicUrl) {
    if (!publicUrl || publicUrl === '-') return null;
    // Supabase public URL format:
    // https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const marker = '/object/public/assets-3d/';
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(publicUrl.substring(idx + marker.length));
}

exports.deleteModule = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Ambil semua assets dari tabel module_assets
        const { data: assets, error: assetErr } = await supabase
            .from('module_assets')
            .select('file')
            .eq('module_id', id);

        if (assetErr) console.error('[deleteModule] Gagal query assets:', assetErr.message);

        // 2. Hapus file dari Supabase Storage
        if (assets && assets.length > 0) {
            const paths = assets.map(a => extractStoragePath(a.file)).filter(Boolean);
            if (paths.length > 0) {
                const { error: storageErr } = await supabase.storage.from('assets-3d').remove(paths);
                if (storageErr) console.error('[deleteModule] Storage delete error:', storageErr.message);
                else console.log(`[deleteModule] Berhasil hapus ${paths.length} file dari storage`);
            }
        }

        // 3. Hapus dari database (CASCADE hapus module_assets otomatis)
        const { error: dbError } = await supabase.from('modules').delete().eq('id', id);
        if (dbError) return res.status(400).json({ error: dbError.message });

        res.json({ message: 'Module & file 3D berhasil dihapus permanen' });

    } catch (err) {
        console.error('[deleteModule] Error:', err);
        res.status(500).json({ error: 'Gagal menghapus module', details: err.message });
    }
};

exports.deleteMaterial = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Ambil semua assets dari tabel material_assets
        const { data: assets, error: assetErr } = await supabase
            .from('material_assets')
            .select('file')
            .eq('material_id', id);

        if (assetErr) console.error('[deleteMaterial] Gagal query assets:', assetErr.message);

        // 2. Hapus file dari Supabase Storage
        if (assets && assets.length > 0) {
            const paths = assets.map(a => extractStoragePath(a.file)).filter(Boolean);
            if (paths.length > 0) {
                const { error: storageErr } = await supabase.storage.from('assets-3d').remove(paths);
                if (storageErr) console.error('[deleteMaterial] Storage delete error:', storageErr.message);
                else console.log(`[deleteMaterial] Berhasil hapus ${paths.length} file dari storage`);
            }
        }

        // 3. Hapus dari database (CASCADE hapus material_assets otomatis)
        const { error } = await supabase.from('materials').delete().eq('id', id);
        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: 'Material & file 3D berhasil dihapus permanen' });
    } catch (err) {
        console.error('[deleteMaterial] Error:', err);
        res.status(500).json({ error: 'Gagal menghapus material', details: err.message });
    }
};

exports.deleteTool = async (req, res) => {
    const { id } = req.params;
    try {
        const { data: tool } = await supabase.from('tools').select('file3d').eq('id', id).single();
        if (tool && tool.file3d) {
            const path = extractStoragePath(tool.file3d);
            if (path) {
                const { error: storageErr } = await supabase.storage.from('assets-3d').remove([path]);
                if (storageErr) console.error('[deleteTool] Storage delete error:', storageErr.message);
            }
        }
        const { error } = await supabase.from('tools').delete().eq('id', id);
        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: 'Peralatan & file 3D berhasil dihapus permanen' });
    } catch (err) {
        console.error('[deleteTool] Error:', err);
        res.status(500).json({ error: 'Gagal menghapus peralatan', details: err.message });
    }
};

// ==========================================
// RUTE UPDATE (PUT) - Sinkronisasi Edit Data
// ==========================================

exports.updateModule = async (req, res) => {
    const { id } = req.params;
    // Data module tanpa assets
    const { assets, ...moduleData } = req.body;

    try {
        // 1. Update data modul
        const { error: errMod } = await supabase.from('modules').update(moduleData).eq('id', id);
        if (errMod) throw errMod;

        // 2. Ambil semua assets lama dari db
        const { data: oldAssets } = await supabase.from('module_assets').select('*').eq('module_id', id);
        
        // 3. Sinkronisasi assets
        if (assets && Array.isArray(assets)) {
            // Hapus yang lama tetapi tidak ada di array baru
            const newAssetIds = assets.map(a => a.id).filter(Boolean);
            const assetsToDelete = oldAssets.filter(oa => !newAssetIds.includes(oa.id));

            if (assetsToDelete.length > 0) {
                // Delete s3
                const filePathsToDelete = assetsToDelete
                    .map(a => extractStoragePath(a.file))
                    .filter(Boolean);
                
                if (filePathsToDelete.length > 0) {
                    await supabase.storage.from('assets-3d').remove(filePathsToDelete);
                }

                // Delete db
                await supabase.from('module_assets').delete().in('id', assetsToDelete.map(a => a.id));
            }

            // Insert / Update yang dikirim dari klien
            for (let a of assets) {
                const existing = oldAssets.find(oa => oa.id === a.id);
                if (existing) {
                    // Update jika nama beda atau jika file berubah
                    if (existing.name !== a.name || existing.file !== a.file) {
                        // Jika file berubah, kita juga perlu hapus file lama di S3
                        if (existing.file !== a.file && existing.file !== '-') {
                            const p = extractStoragePath(existing.file);
                            if (p) await supabase.storage.from('assets-3d').remove([p]);
                        }
                        await supabase.from('module_assets').update({ name: a.name, file: a.file }).eq('id', a.id);
                    }
                } else {
                    // Insert baru
                    await supabase.from('module_assets').insert([{
                        id: a.id,
                        module_id: id,
                        name: a.name,
                        file: a.file
                    }]);
                }
            }
        }

        res.json({ message: 'Module berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal update module', details: err.message });
    }
};

exports.updateMaterial = async (req, res) => {
    const { id } = req.params;
    const { assets, ...materialData } = req.body;

    try {
        const { error: errMat } = await supabase.from('materials').update(materialData).eq('id', id);
        if (errMat) throw errMat;

        const { data: oldAssets } = await supabase.from('material_assets').select('*').eq('material_id', id);
        
        if (assets && Array.isArray(assets)) {
            const newAssetIds = assets.map(a => a.id).filter(Boolean);
            const assetsToDelete = oldAssets.filter(oa => !newAssetIds.includes(oa.id));

            if (assetsToDelete.length > 0) {
                const filePathsToDelete = assetsToDelete
                    .map(a => extractStoragePath(a.file))
                    .filter(Boolean);
                
                if (filePathsToDelete.length > 0) {
                    await supabase.storage.from('assets-3d').remove(filePathsToDelete);
                }

                await supabase.from('material_assets').delete().in('id', assetsToDelete.map(a => a.id));
            }

            for (let a of assets) {
                const existing = oldAssets.find(oa => oa.id === a.id);
                if (existing) {
                    if (existing.name !== a.name || existing.file !== a.file) {
                        if (existing.file !== a.file && existing.file !== '-') {
                            const p = extractStoragePath(existing.file);
                            if (p) await supabase.storage.from('assets-3d').remove([p]);
                        }
                        await supabase.from('material_assets').update({ name: a.name, file: a.file }).eq('id', a.id);
                    }
                } else {
                    await supabase.from('material_assets').insert([{
                        id: a.id,
                        material_id: id,
                        name: a.name,
                        file: a.file
                    }]);
                }
            }
        }

        res.json({ message: 'Material berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal update material', details: err.message });
    }
};

exports.updateTool = async (req, res) => {
    const { id } = req.params;
    const bodyArgs = req.body;

    try {
        // Ambil data file lama untuk komparasi jika berubah
        const { data: oldTool } = await supabase.from('tools').select('file3d').eq('id', id).single();
        
        // Hapus fle lama di storage jika file3d terganti oleh payload yang berbeda (asumsi URL baru, beda URL)
        if (oldTool && oldTool.file3d && bodyArgs.file3d && oldTool.file3d !== bodyArgs.file3d) {
            const p = extractStoragePath(oldTool.file3d);
            if (p) {
                await supabase.storage.from('assets-3d').remove([p]);
            }
        }

        const { error } = await supabase.from('tools').update(bodyArgs).eq('id', id);
        if (error) throw error;
        
        res.json({ message: 'Peralatan berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal update peralatan', details: err.message });
    }
};

// ==========================================
// RUTE UPLOAD FILE
// ==========================================

exports.addModuleAsset = async (req, res) => {
    const { data, error } = await supabase.from('module_assets').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'File Asset 3D berhasil dipasangkan ke module', data: data[0] });
};

exports.addMaterialAsset = async (req, res) => {
    const { data, error } = await supabase.from('material_assets').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'File Asset 3D berhasil dipasangkan ke material', data: data[0] });
};

exports.addModuleMaterial = async (req, res) => {
    const { data, error } = await supabase.from('module_materials').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Material berhasil ditautkan ke module', data: data[0] });
};

exports.addModuleTool = async (req, res) => {
    const { data, error } = await supabase.from('module_tools').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Peralatan berhasil ditautkan ke module', data: data[0] });
};

// ==========================================
// RUTE POST (PENGUNGGAHAN FILE FISIK KE BUCKET)
// ==========================================

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Tidak ada file fisik yang ditemukan. Pastikan parameter key bernama "file".' });
        }

        // Bikin nama file menjadi unik (mencegah bentrok jika ada file bernama sama)
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}_${Math.round(Math.random() * 1e5)}.${fileExt}`;

        // Mengirim buffer fisik ke rak Storage bernama 'assets-3d'
        const { data, error } = await supabase.storage
            .from('assets-3d')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (error) {
            return res.status(500).json({ error: 'Gagal mengunggah file ke satelit Supabase.', details: error.message });
        }

        // Meminta balik tautan awannya yang bersifat terbuka (public)
        const { data: publicUrlData } = supabase.storage
            .from('assets-3d')
            .getPublicUrl(fileName);

        res.json({ 
            message: 'File fisik sukses mendarat ke Supabase Cloud!',
            fileName: fileName,
            publicUrl: publicUrlData.publicUrl 
        });

    } catch (err) {
        res.status(500).json({ error: 'Kesalahan server pada proses upload', details: err.message });
    }
};
