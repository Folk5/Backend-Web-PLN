/**
 * controllers/moduleController.js
 * CRUD untuk entitas Modul Konstruksi (modules, module_assets, module_materials, module_tools).
 */

const supabase = require('../config/supabase');
const { extractStoragePath, deleteFromStorage } = require('./helpers/storage');

// ── GET ────────────────────────────────────────────────────

exports.getModules = async (req, res) => {
    // Query param: ?all=true dari admin untuk lihat semua, publik hanya dapat yang Aktif
    const showAll = req.query.all === 'true';
    const sort = req.query.sort || 'newest';
    const search = req.query.search;

    let query = supabase
        .from('modules')
        .select(`
            *,
            assets:module_assets(*),
            materials:module_materials(count),
            tools:module_tools(count)
        `);

    if (!showAll) {
        query = query.eq('status', 'Aktif');
    }

    if (search) {
        query = query.ilike('title', `%${search}%`);
    }

    if (sort === 'name_asc') {
        query = query.order('title', { ascending: true });
    } else if (sort === 'name_desc') {
        query = query.order('title', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    const result = data.map(m => ({
        ...m,
        materialCount: m.materials?.[0]?.count ?? 0,
        equipmentCount: m.tools?.[0]?.count ?? 0,
    }));
    res.json(result);
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
    const result = {
        ...data,
        materialCount: data.materials ? data.materials.length : 0,
        equipmentCount: data.tools ? data.tools.length : 0,
    };
    res.json(result);
};

// ── POST ───────────────────────────────────────────────────

exports.createModule = async (req, res) => {
    const { assets, materials, tools, ...moduleData } = req.body;

    if (!moduleData.id) {
        moduleData.id = crypto.randomUUID ? crypto.randomUUID() : 'module-' + Date.now();
    }

    const { data, error } = await supabase.from('modules').insert([moduleData]).select();
    if (error) return res.status(400).json({ error: error.message });

    const moduleId = data[0].id;

    if (materials && Array.isArray(materials) && materials.length > 0) {
        const matPayload = materials.map(m => ({
            module_id: moduleId,
            material_id: m.material_id,
            quantity: m.quantity || 1
        }));
        await supabase.from('module_materials').insert(matPayload);
    }

    if (tools && Array.isArray(tools) && tools.length > 0) {
        const toolPayload = tools.map(t => ({ module_id: moduleId, tool_id: t.tool_id }));
        await supabase.from('module_tools').insert(toolPayload);
    }

    console.log(`[INFO] Modul Konstruksi Baru Ditambahkan: ${data[0].title} (ID: ${data[0].id})`);
    res.json({ message: 'Module berhasil dibuat', data: data[0] });
};

// ── PUT ────────────────────────────────────────────────────

exports.updateModule = async (req, res) => {
    const { id } = req.params;
    const { assets, materials, tools, ...moduleData } = req.body;

    try {
        // 0. Hapus gambar lama jika image diubah/dihapus
        if ('image' in moduleData) {
            const { data: oldModule } = await supabase.from('modules').select('image').eq('id', id).single();
            if (oldModule && oldModule.image && oldModule.image !== moduleData.image) {
                await deleteFromStorage('images', oldModule.image);
            }
        }

        // 1. Update data modul
        const { error: errMod } = await supabase.from('modules').update(moduleData).eq('id', id);
        if (errMod) throw errMod;

        // 2. Ambil assets lama
        const { data: oldAssets } = await supabase.from('module_assets').select('*').eq('module_id', id);

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
                await supabase.from('module_assets').delete().in('id', assetsToDelete.map(a => a.id));
            }

            for (let a of assets) {
                const existing = oldAssets.find(oa => oa.id === a.id);
                if (existing) {
                    if (existing.name !== a.name || existing.file !== a.file) {
                        if (existing.file !== a.file && existing.file !== '-') {
                            await deleteFromStorage('assets-3d', existing.file);
                        }
                        await supabase.from('module_assets').update({ name: a.name, file: a.file }).eq('id', a.id);
                    }
                } else {
                    await supabase.from('module_assets').insert([{
                        id: a.id, module_id: id, name: a.name, file: a.file
                    }]);
                }
            }
        }

        // 4. Sinkronisasi materials
        if (materials && Array.isArray(materials)) {
            await supabase.from('module_materials').delete().eq('module_id', id);
            if (materials.length > 0) {
                const matPayload = materials.map(m => ({
                    module_id: id, material_id: m.material_id, quantity: m.quantity || 1
                }));
                await supabase.from('module_materials').insert(matPayload);
            }
        }

        // 5. Sinkronisasi tools
        if (tools && Array.isArray(tools)) {
            await supabase.from('module_tools').delete().eq('module_id', id);
            if (tools.length > 0) {
                const toolPayload = tools.map(t => ({ module_id: id, tool_id: t.tool_id }));
                await supabase.from('module_tools').insert(toolPayload);
            }
        }

        res.json({ message: 'Module berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal update module', details: err.message });
    }
};

// ── DELETE ─────────────────────────────────────────────────

exports.deleteModule = async (req, res) => {
    const { id } = req.params;
    try {
        const [{ data: module }, { data: assets }] = await Promise.all([
            supabase.from('modules').select('image').eq('id', id).single(),
            supabase.from('module_assets').select('file').eq('module_id', id)
        ]);

        // Hapus file 3D
        if (assets && assets.length > 0) {
            const paths = assets.map(a => extractStoragePath(a.file, 'assets-3d')).filter(Boolean);
            if (paths.length > 0) {
                const { error: storageErr } = await supabase.storage.from('assets-3d').remove(paths);
                if (storageErr) console.error('[deleteModule] Storage 3D error:', storageErr.message);
            }
        }

        // Hapus gambar thumbnail
        if (module && module.image) {
            await deleteFromStorage('images', module.image);
        }

        // Hapus dari database (CASCADE ke module_assets)
        const { error: dbError } = await supabase.from('modules').delete().eq('id', id);
        if (dbError) return res.status(400).json({ error: dbError.message });

        res.json({ message: 'Module, file 3D, dan gambar berhasil dihapus permanen' });
    } catch (err) {
        console.error('[deleteModule] Error:', err);
        res.status(500).json({ error: 'Gagal menghapus module', details: err.message });
    }
};
