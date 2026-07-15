const express = require('express');
const router = express.Router();
const pembController = require('../controllers/pembelajaran.controller');
const requireAuth = require('../middleware/authMiddleware');

// Katalog Instruktur
router.get('/katalog-instruktur', pembController.getKatalog);
router.post('/katalog-instruktur', requireAuth, pembController.createKatalog);
router.put('/katalog-instruktur/:id', requireAuth, pembController.updateKatalog);
router.delete('/katalog-instruktur/:id', requireAuth, pembController.deleteKatalog);

// Jadwal Instruktur
router.get('/jadwal-instruktur', pembController.getJadwal);
router.post('/jadwal-instruktur', requireAuth, pembController.createJadwal);
router.put('/jadwal-instruktur/:id', requireAuth, pembController.updateJadwal);
router.delete('/jadwal-instruktur/:id', requireAuth, pembController.deleteJadwal);

module.exports = router;
