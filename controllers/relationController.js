/**
 * controllers/relationController.js
 * Menangani relasi antar entitas:
 * - Module ↔ Asset 3D  (module_assets)
 * - Material ↔ Asset 3D (material_assets)
 * - Module ↔ Material  (module_materials)
 * - Module ↔ Tool      (module_tools)
 */

const prisma = require('../config/db');
const { randomUUID } = require('crypto');

exports.addModuleAsset = async (req, res) => {
  const assetData = { ...req.body };
  if (!assetData.id) {
    assetData.id = randomUUID();
  }
  try {
    const data = await prisma.moduleAsset.create({ data: assetData });
    res.json({ message: 'File Asset 3D berhasil dipasangkan ke module', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addMaterialAsset = async (req, res) => {
  const assetData = { ...req.body };
  if (!assetData.id) {
    assetData.id = randomUUID();
  }
  try {
    const data = await prisma.materialAsset.create({ data: assetData });
    res.json({ message: 'File Asset 3D berhasil dipasangkan ke material', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addModuleMaterial = async (req, res) => {
  try {
    const data = await prisma.moduleMaterial.create({ data: req.body });
    res.json({ message: 'Material berhasil ditautkan ke module', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addModuleTool = async (req, res) => {
  try {
    const data = await prisma.moduleTool.create({ data: req.body });
    res.json({ message: 'Peralatan berhasil ditautkan ke module', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMaterialMeshNames = async (req, res) => {
  const { id } = req.params;
  const { mesh_names } = req.body;
  if (!Array.isArray(mesh_names)) {
    return res.status(400).json({ error: 'mesh_names harus berupa array' });
  }
  const valid = mesh_names.map(n => n.trim()).filter(Boolean);
  try {
    await prisma.$transaction([
      prisma.moduleMaterialMesh.deleteMany({ where: { module_material_id: id } }),
      ...valid.map(mesh_name =>
        prisma.moduleMaterialMesh.create({ data: { module_material_id: id, mesh_name } })
      ),
    ]);
    res.json({ message: 'mesh material berhasil diperbarui' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateToolMeshName = async (req, res) => {
  const { id } = req.params;
  const { mesh_name } = req.body;
  try {
    await prisma.moduleTool.update({
      where: { id },
      data: { mesh_name: mesh_name || null },
    });
    res.json({ message: 'mesh_name tool berhasil diperbarui' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
