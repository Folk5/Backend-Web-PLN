const prisma = require('./config/db');

async function main() {
  const allModules = await prisma.module.findMany();
  let deletedCount = 0;

  for (const mod of allModules) {
    // Abaikan jika namanya mirip "Konstruksi Rumah"
    if (mod.title.toLowerCase().includes('konstruksi rumah')) {
      console.log(`Skipping: ${mod.title}`);
      continue;
    }
    
    // Hapus modul
    await prisma.module.delete({
      where: { id: mod.id }
    });
    console.log(`Deleted: ${mod.title}`);
    deletedCount++;
  }

  console.log(`Successfully deleted ${deletedCount} modules.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
