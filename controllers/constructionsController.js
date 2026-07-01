const prisma = require('../config/db');

// =========================================================
// PUBLIC ENDPOINTS (untuk halaman Konstruksi di frontend)
// =========================================================

// GET /api/construction
// Ambil semua root (level 1) -> dipakai untuk render "Distribusi" dkk di halaman awal Konstruksi
const getRootConstructions = async (req, res) => {
    try {
        const roots = await prisma.construction.findMany({
            where: { level: 1, parent_id: null },
            orderBy: { name: 'asc' },
        });
        res.json(roots);
    } catch (error) {
        console.error('getRootConstructions error:', error);
        res.status(500).json({ message: 'Gagal mengambil data konstruksi' });
    }
};

// GET /api/construction/:slug/children
// Ambil anak-anak dari satu node (misal slug "distribusi" -> return SR, JTR, JTM, Gardu)
// dipakai untuk tiap klik breadcrumb di level 2 dan level 3
const getChildrenBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const parent = await prisma.construction.findUnique({
            where: { slug },
        });

        if (!parent) {
            return res.status(404).json({ message: 'Konstruksi tidak ditemukan' });
        }

        const children = await prisma.construction.findMany({
            where: { parent_id: parent.id },
            orderBy: { name: 'asc' },
        });

        res.json({
            parent,
            children,
        });
    } catch (error) {
        console.error('getChildrenBySlug error:', error);
        res.status(500).json({ message: 'Gagal mengambil data konstruksi' });
    }
};

// GET /api/construction/:slug
// Detail satu node + breadcrumb (path dari root sampai node ini) + children (kalau ada)
// dipakai untuk render halaman detail level 3 (misal SUTM) sekaligus breadcrumb-nya
const getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const node = await prisma.construction.findUnique({
            where: { slug },
            include: {
                children: { orderBy: { name: 'asc' } },
            },
        });

        if (!node) {
            return res.status(404).json({ message: 'Konstruksi tidak ditemukan' });
        }

        // bangun breadcrumb dari node ini naik ke root
        const breadcrumb = [];
        let current = node;
        while (current) {
            breadcrumb.unshift({ id: current.id, name: current.name, slug: current.slug, level: current.level });
            if (!current.parent_id) break;
            current = await prisma.construction.findUnique({ where: { id: current.parent_id } });
        }

        res.json({
            ...node,
            breadcrumb,
        });
    } catch (error) {
        console.error('getBySlug error:', error);
        res.status(500).json({ message: 'Gagal mengambil data konstruksi' });
    }
};

// GET /api/construction/tree
// Ambil seluruh hierarki sekaligus (3 level nested) -> dipakai admin atau sidebar tree kalau perlu
const getFullTree = async (req, res) => {
    try {
        const tree = await prisma.construction.findMany({
            where: { level: 1 },
            orderBy: { name: 'asc' },
            include: {
                children: {
                    orderBy: { name: 'asc' },
                    include: {
                        children: { orderBy: { name: 'asc' } },
                    },
                },
            },
        });
        res.json(tree);
    } catch (error) {
        console.error('getFullTree error:', error);
        res.status(500).json({ message: 'Gagal mengambil data konstruksi' });
    }
};

// =========================================================
// ADMIN ENDPOINTS (CRUD untuk dashboard admin)
// =========================================================

// GET /api/admin/construction
// List flat semua data (buat tabel admin), boleh difilter by level
const getAllConstructions = async (req, res) => {
    try {
        const { level } = req.query;

        const where = level ? { level: parseInt(level) } : {};

        const data = await prisma.construction.findMany({
            where,
            include: { parent: true },
            orderBy: [{ level: 'asc' }, { name: 'asc' }],
        });

        res.json(data);
    } catch (error) {
        console.error('getAllConstructions error:', error);
        res.status(500).json({ message: 'Gagal mengambil data konstruksi' });
    }
};

// POST /api/admin/construction
const createConstruction = async (req, res) => {
    try {
        const { name, slug, level, description, image, module_type, parent_id } = req.body;

        if (!name || !slug || !level) {
            return res.status(400).json({ message: 'name, slug, dan level wajib diisi' });
        }

        // validasi level vs parent_id biar hierarki konsisten
        if (level === 1 && parent_id) {
            return res.status(400).json({ message: 'Level 1 (root) tidak boleh punya parent' });
        }
        if (level > 1 && !parent_id) {
            return res.status(400).json({ message: `Level ${level} wajib punya parent_id` });
        }

        if (parent_id) {
            const parent = await prisma.construction.findUnique({ where: { id: parent_id } });
            if (!parent) {
                return res.status(400).json({ message: 'parent_id tidak valid' });
            }
            if (parent.level !== level - 1) {
                return res.status(400).json({ message: `Parent harus level ${level - 1}` });
            }
        }

        const created = await prisma.construction.create({
            data: { name, slug, level, description, image, module_type: module_type || 'konstruksi', parent_id },
        });

        res.status(201).json(created);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Slug sudah digunakan' });
        }
        console.error('createConstruction error:', error);
        res.status(500).json({ message: 'Gagal membuat konstruksi' });
    }
};

// PUT /api/admin/construction/:id
const updateConstruction = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description, image, module_type, parent_id } = req.body;
        // level sengaja tidak diubah lewat update biar hierarki gak berantakan;
        // kalau mau pindah level, hapus dan buat ulang

        const existing = await prisma.construction.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: 'Konstruksi tidak ditemukan' });
        }

        if (parent_id) {
            const parent = await prisma.construction.findUnique({ where: { id: parent_id } });
            if (!parent || parent.level !== existing.level - 1) {
                return res.status(400).json({ message: `Parent harus level ${existing.level - 1}` });
            }
        }

        const updated = await prisma.construction.update({
            where: { id },
            data: { name, slug, description, image, module_type, parent_id },
        });

        res.json(updated);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Slug sudah digunakan' });
        }
        console.error('updateConstruction error:', error);
        res.status(500).json({ message: 'Gagal mengupdate konstruksi' });
    }
};

// DELETE /api/admin/construction/:id
const deleteConstruction = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.construction.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: 'Konstruksi tidak ditemukan' });
        }

        // onDelete: Cascade di schema -> hapus node otomatis hapus semua children-nya juga
        await prisma.construction.delete({ where: { id } });

        res.json({ message: 'Konstruksi berhasil dihapus' });
    } catch (error) {
        console.error('deleteConstruction error:', error);
        res.status(500).json({ message: 'Gagal menghapus konstruksi' });
    }
};

module.exports = {
    getRootConstructions,
    getChildrenBySlug,
    getBySlug,
    getFullTree,
    getAllConstructions,
    createConstruction,
    updateConstruction,
    deleteConstruction,
};