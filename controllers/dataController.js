const supabase = require('../config/supabase');

// ==========================================
// RUTE GET (MENGAMBIL DATA UNTUK DITAMPILKAN)
// ==========================================

exports.getModules = async (req, res) => {
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
        `);
        
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
    const { data, error } = await supabase.from('materials').select('*');
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

exports.deleteModule = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Cari file .glb yang terkait di tabel module_assets
        const { data: assets } = await supabase
            .from('module_assets')
            .select('file')
            .eq('module_id', id);

        // 2. Jika ada file, hapus dari Supabase Storage
        if (assets && assets.length > 0) {
            const filePathsToDelete = assets
                .map(a => {
                    // Ekstrak nama file dari URL publik
                    // Contoh URL: https://xxx.supabase.co/storage/v1/object/public/assets-3d/namafile.glb
                    const url = a.file;
                    const parts = url.split('/assets-3d/');
                    return parts.length > 1 ? parts[1] : null;
                })
                .filter(Boolean); // buang yang null

            if (filePathsToDelete.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from('assets-3d')
                    .remove(filePathsToDelete);

                if (storageError) {
                    console.warn('[Delete] Storage warning (file mungkin sudah tidak ada):', storageError.message);
                }
            }
        }

        // 3. Hapus record dari database (CASCADE akan otomatis hapus module_assets)
        const { error: dbError } = await supabase.from('modules').delete().eq('id', id);
        if (dbError) return res.status(400).json({ error: dbError.message });

        res.json({ message: 'Module & file 3D berhasil dihapus permanen dari database dan storage' });

    } catch (err) {
        res.status(500).json({ error: 'Gagal menghapus module', details: err.message });
    }
};

exports.deleteMaterial = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('materials').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Material berhasil dihapus permanen' });
};

exports.deleteTool = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('tools').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Peralatan berhasil dihapus permanen' });
};

// ==========================================
// RUTE POST (MENGHUBUNGKAN RELATIONSHIP TBL)
// ==========================================

exports.addModuleAsset = async (req, res) => {
    const { data, error } = await supabase.from('module_assets').insert([req.body]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'File Asset 3D berhasil dipasangkan ke module', data: data[0] });
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
