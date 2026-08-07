const prisma = require('./config/db');

async function main() {
    const modules = await prisma.module.findMany({ select: { id: true, title: true, status: true, construction_id: true } });
    console.log(modules);
}

main().catch(e => console.error(e)).finally(() => process.exit(0));
