const prisma = require('../config/db');

exports.getAllTerms = async (req, res) => {
    try {
        const terms = await prisma.listrikpedia.findMany({
            orderBy: [
                { abbr: 'asc' },
                { created_at: 'asc' }
            ]
        });
        res.status(200).json(terms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error retrieving terms' });
    }
};

exports.createTerm = async (req, res) => {
    try {
        const { abbr, name, description, type } = req.body;

        const existing = await prisma.listrikpedia.findFirst({
            where: {
                abbr: {
                    equals: abbr,
                    mode: 'insensitive'
                }
            }
        });

        if (existing) {
            return res.status(400).json({ error: `Singkatan atau istilah "${abbr}" sudah pernah diisi!` });
        }

        const newTerm = await prisma.listrikpedia.create({
            data: {
                abbr,
                name,
                description,
                type: type || 'singkatan'
            }
        });
        res.status(201).json(newTerm);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating term' });
    }
};

exports.updateTerm = async (req, res) => {
    try {
        const { id } = req.params;
        const { abbr, name, description, type } = req.body;

        const existing = await prisma.listrikpedia.findFirst({
            where: {
                abbr: {
                    equals: abbr,
                    mode: 'insensitive'
                },
                id: {
                    not: id
                }
            }
        });

        if (existing) {
            return res.status(400).json({ error: `Singkatan atau istilah "${abbr}" sudah pernah diisi oleh data lain!` });
        }

        const updatedTerm = await prisma.listrikpedia.update({
            where: { id },
            data: {
                abbr,
                name,
                description,
                type,
                updated_at: new Date()
            }
        });
        res.status(200).json(updatedTerm);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error updating term' });
    }
};

exports.deleteTerm = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.listrikpedia.delete({
            where: { id }
        });
        res.status(200).json({ message: 'Term deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error deleting term' });
    }
};
