const prisma = require('../config/db');

exports.getMeshConfig = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.meshConfig.findMany({
      where: { module_id: id },
    });
    res.json(data || []);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMappedMeshes = async (req, res) => {
  const { id } = req.params;
  try {
    const [matData, toolData] = await Promise.all([
      prisma.moduleMaterial.findMany({
        where: { module_id: id, mesh_name: { not: null } },
        select: { mesh_name: true },
      }),
      prisma.moduleTool.findMany({
        where: { module_id: id, mesh_name: { not: null } },
        select: { mesh_name: true },
      }),
    ]);
    const names = new Set([
      ...matData.map((r) => r.mesh_name).filter(Boolean),
      ...toolData.map((r) => r.mesh_name).filter(Boolean),
    ]);
    res.json([...names]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.upsertMeshConfig = async (req, res) => {
  const { id } = req.params;
  const items = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Body harus berupa array' });

  try {
    const upserts = items.map((item) => {
      const isVisible = item.is_visible !== undefined ? Boolean(item.is_visible) : true;
      return prisma.meshConfig.upsert({
        where: {
          module_id_mesh_original_name: {
            module_id: id,
            mesh_original_name: item.mesh_original_name,
          },
        },
        update: {
          mesh_display_name: item.mesh_display_name || null,
          is_visible: isVisible,
        },
        create: {
          module_id: id,
          mesh_original_name: item.mesh_original_name,
          mesh_display_name: item.mesh_display_name || null,
          is_visible: isVisible,
        },
      });
    });

    await prisma.$transaction(upserts);
    res.json({ message: 'Konfigurasi mesh berhasil disimpan' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
