const supabase = require('../config/supabase');

exports.getMeshConfig = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('mesh_config')
    .select('*')
    .eq('module_id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data || []);
};

exports.getMappedMeshes = async (req, res) => {
  const { id } = req.params;
  const [{ data: matData, error: matErr }, { data: toolData, error: toolErr }] = await Promise.all([
    supabase.from('module_materials').select('mesh_name').eq('module_id', id).not('mesh_name', 'is', null),
    supabase.from('module_tools').select('mesh_name').eq('module_id', id).not('mesh_name', 'is', null),
  ]);
  if (matErr || toolErr) return res.status(400).json({ error: (matErr || toolErr).message });
  const names = new Set([
    ...(matData || []).map((r) => r.mesh_name).filter(Boolean),
    ...(toolData || []).map((r) => r.mesh_name).filter(Boolean),
  ]);
  res.json([...names]);
};

exports.upsertMeshConfig = async (req, res) => {
  const { id } = req.params;
  const items = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Body harus berupa array' });

  const records = items.map((item) => ({
    module_id: id,
    mesh_original_name: item.mesh_original_name,
    mesh_display_name: item.mesh_display_name || null,
    is_visible: item.is_visible !== undefined ? Boolean(item.is_visible) : true,
  }));

  const { error } = await supabase
    .from('mesh_config')
    .upsert(records, { onConflict: 'module_id,mesh_original_name' });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Konfigurasi mesh berhasil disimpan' });
};
