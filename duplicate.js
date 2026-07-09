const prisma = require('./config/db');

async function main() {
  const m = await prisma.module.findFirst({
    where: { title: { contains: 'Konstruksi Rumah', mode: 'insensitive' } },
    include: { assets: true }
  });
  if (!m || m.assets.length === 0) return console.log('Module not found or no assets');
  
  const baseFile = m.assets.find(a => a.file && a.file !== '-')?.file;
  if (!baseFile) return console.log('No valid file found');
  
  await prisma.moduleAsset.deleteMany({ where: { module_id: m.id } });
  
  await prisma.moduleAsset.createMany({
    data: [
      { module_id: m.id, name: 'Konstruksi Rumah', file: baseFile, animation: 'orbit' },
      { module_id: m.id, name: 'Sambungan Rumah', file: baseFile, animation: 'none' },
      { module_id: m.id, name: 'Sambungan Tiang', file: baseFile, animation: 'none' }
    ]
  });
  console.log('Successfully recreated 3 variants!');
}

main().then(() => prisma.$disconnect());
