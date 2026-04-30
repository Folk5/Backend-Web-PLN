/**
 * controllers/relationController.js
 * Menangani relasi antar entitas:
 * - Module ↔ Asset 3D  (module_assets)
 * - Material ↔ Asset 3D (material_assets)
 * - Module ↔ Material  (module_materials)
 * - Module ↔ Tool      (module_tools)
 */

const supabase = require('../config/supabase');

exports.addModuleAsset = async (req, res) => {
    const assetData = { ...req.body };
    if (!assetData.id) {
        assetData.id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : require('crypto').randomUUID();
    }
    const { data, error } = await supabase.from('module_assets').insert([assetData]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'File Asset 3D berhasil dipasangkan ke module', data: data[0] });
};

exports.addMaterialAsset = async (req, res) => {
    const assetData = { ...req.body };
    if (!assetData.id) {
        assetData.id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : require('crypto').randomUUID();
    }
    const { data, error } = await supabase.from('material_assets').insert([assetData]).select();
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
