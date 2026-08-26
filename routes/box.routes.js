const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const requireAuth = require('../middleware/authMiddleware');

// Get all box game presets
router.get('/presets', async (req, res) => {
  try {
    const presets = await prisma.boxGamePreset.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(presets);
  } catch (error) {
    console.error('Error fetching box game presets:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Create new box game preset
router.post('/presets', requireAuth, async (req, res) => {
  try {
    const { title, data } = req.body;
    console.log('[box.routes.js] POST /presets hit. Title:', title, 'Data length:', data?.length);
    
    if (!title || !data) {
      console.log('[box.routes.js] Missing title or data');
      return res.status(400).json({ error: 'Title dan data wajib diisi' });
    }

    const presets = await prisma.$queryRaw`
      INSERT INTO box_game_presets (title, data)
      VALUES (${title}, ${JSON.stringify(data)}::jsonb)
      RETURNING *
    `;
    const preset = presets[0];
    
    console.log('[box.routes.js] Preset created successfully. ID:', preset.id);
    
    res.status(201).json(preset);
  } catch (error) {
    console.error('Error creating box game preset:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Delete preset (Optional for admin/host)
router.delete('/presets/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.boxGamePreset.delete({
      where: { id }
    });
    res.json({ message: 'Preset berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting box game preset:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;
