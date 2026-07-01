const express = require('express');
const router = express.Router();
const {
    getRootConstructions,
    getChildrenBySlug,
    getBySlug,
    getFullTree,
    getAllConstructions,
    createConstruction,
    updateConstruction,
    deleteConstruction,
} = require('../controllers/constructionsController');

// Sesuaikan import ini dengan middleware auth yang sudah ada di project lo,
// contoh nama biasanya authMiddleware atau verifyToken — cek di middleware/ folder
// const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// =========================
// ADMIN ROUTES (harus SEBELUM /:slug agar tidak tertangkap sebagai slug)
// pasang middleware auth di sini, contoh:
// router.use(verifyToken, isAdmin);
// =========================
router.get('/admin/all', getAllConstructions);       // GET /api/construction/admin/all?level=2
router.post('/admin', createConstruction);           // POST /api/construction/admin
router.put('/admin/:id', updateConstruction);        // PUT /api/construction/admin/:id
router.delete('/admin/:id', deleteConstruction);     // DELETE /api/construction/admin/:id

// =========================
// PUBLIC ROUTES
// =========================
router.get('/tree', getFullTree);                  // GET /api/construction/tree
router.get('/', getRootConstructions);             // GET /api/construction
router.get('/:slug/children', getChildrenBySlug);  // GET /api/construction/distribusi/children
router.get('/:slug', getBySlug);                   // GET /api/construction/sutm

module.exports = router;