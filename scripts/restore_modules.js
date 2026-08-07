require('dotenv').config();
const prisma = require('./config/db');

async function main() {
    const modules = await prisma.module.findMany();
    const constructions = await prisma.construction.findMany();
    
    let updated = 0;
    for (const mod of modules) {
        const prefix = mod.title.split(' - ')[0]; // e.g., 'SKUTR' or 'SR'
        const c = constructions.find(x => x.name === prefix);
        if (c) {
            await prisma.module.update({
                where: { id: mod.id },
                data: { construction_id: c.id }
            });
            updated++;
        } else {
            console.log(`Could not find construction for module: ${mod.title}`);
        }
    }
    console.log(`Updated ${updated} modules.`);
}
main().catch(console.error).finally(() => process.exit(0));
