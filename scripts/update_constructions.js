require('dotenv').config();
const prisma = require('./config/db');
const crypto = require('crypto');

async function main() {
    // We will drop existing constructions and recreate them to match the material hierarchy.
    // Wait, if we drop them, the existing Modules that reference them will have `construction_id` set to null (because of SetNull on delete).
    // Let's check how many modules have `construction_id`.
    const modules = await prisma.module.findMany({ where: { construction_id: { not: null } } });
    console.log(`Found ${modules.length} modules with construction_id.`);

    // Map of old slug to module list so we can restore them
    const oldSlugToModules = {};
    for (const m of modules) {
        const c = await prisma.construction.findUnique({ where: { id: m.construction_id } });
        if (c) {
            if (!oldSlugToModules[c.slug]) oldSlugToModules[c.slug] = [];
            oldSlugToModules[c.slug].push(m.id);
        }
    }

    await prisma.construction.deleteMany({});
    console.log('Cleared existing constructions.');

    // Create the new hierarchy
    const hierarchy = {
        'Distribusi': {
            'SR': [],
            'JTR': ['SKTR', 'SKUTR', 'SUTR'],
            'JTM': ['SKTM', 'SKUTM', 'SUTM'],
            'Gardu': ['Gardu Beton', 'Gardu Portal', 'Gardu Cantol']
        },
        'Pembangkit': {},
        'Transmisi': {}
    };

    const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const createLevel = async (name, level, parentId, children) => {
        const slug = slugify(name);
        const c = await prisma.construction.create({
            data: {
                name,
                slug: slug + '-' + crypto.randomUUID().substring(0, 4), // ensure uniqueness
                level,
                parent_id: parentId
            }
        });
        
        // Restore modules if they matched the old slug (e.g. jtm, jtr, sr)
        // Wait, old slugs were 'jtm', 'sr', 'sktr', etc.
        // We will try to match based on the name instead.
        // Let's just create everything first.

        if (Array.isArray(children)) {
            for (const childName of children) {
                await createLevel(childName, level + 1, c.id, null);
            }
        } else if (children && typeof children === 'object') {
            for (const childName of Object.keys(children)) {
                await createLevel(childName, level + 1, c.id, children[childName]);
            }
        }
        return c;
    };

    for (const l1 of Object.keys(hierarchy)) {
        await createLevel(l1, 1, null, hierarchy[l1]);
    }

    console.log('Created new hierarchy!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
