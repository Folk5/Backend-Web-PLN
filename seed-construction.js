const prisma = require('./config/db');

async function main() {
  console.log('Seeding Construction categories...');
  
  // Clear existing
  await prisma.construction.deleteMany({});
  
  const createSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // LEVEL 1
  const l1_pembangkit = await prisma.construction.create({
    data: { name: 'Pembangkit', slug: 'pembangkit', level: 1 }
  });
  const l1_transmisi = await prisma.construction.create({
    data: { name: 'Transmisi', slug: 'transmisi', level: 1 }
  });
  const l1_distribusi = await prisma.construction.create({
    data: { name: 'Distribusi', slug: 'distribusi', level: 1 }
  });

  // LEVEL 2 - DISTRIBUSI
  const l2_oea3 = await prisma.construction.create({
    data: { name: 'OEA3', slug: 'oea3', level: 2, parent_id: l1_distribusi.id }
  });
  const l2_sr = await prisma.construction.create({
    data: { name: 'SR', slug: 'sr', level: 2, parent_id: l1_distribusi.id }
  });
  const l2_jtr = await prisma.construction.create({
    data: { name: 'JTR', slug: 'jtr', level: 2, parent_id: l1_distribusi.id }
  });
  const l2_jtm = await prisma.construction.create({
    data: { name: 'JTM', slug: 'jtm', level: 2, parent_id: l1_distribusi.id }
  });
  const l2_gardu = await prisma.construction.create({
    data: { name: 'Gardu', slug: 'gardu', level: 2, parent_id: l1_distribusi.id }
  });
  const l2_pdkb = await prisma.construction.create({
    data: { name: 'PDKB', slug: 'pdkb', level: 2, parent_id: l1_distribusi.id }
  });

  // LEVEL 3 - JTR
  await prisma.construction.createMany({
    data: [
      { name: 'SUTR', slug: 'sutr', level: 3, parent_id: l2_jtr.id },
      { name: 'SKUTR', slug: 'skutr', level: 3, parent_id: l2_jtr.id },
      { name: 'SKTR', slug: 'sktr', level: 3, parent_id: l2_jtr.id },
    ]
  });

  // LEVEL 3 - JTM
  await prisma.construction.createMany({
    data: [
      { name: 'SUTM', slug: 'sutm', level: 3, parent_id: l2_jtm.id },
      { name: 'SKUTM', slug: 'skutm', level: 3, parent_id: l2_jtm.id },
      { name: 'SKTM', slug: 'sktm', level: 3, parent_id: l2_jtm.id },
    ]
  });

  // LEVEL 3 - Gardu
  await prisma.construction.createMany({
    data: [
      { name: 'GC', slug: 'gc', level: 3, parent_id: l2_gardu.id },
      { name: 'GP', slug: 'gp', level: 3, parent_id: l2_gardu.id },
      { name: 'GB', slug: 'gb', level: 3, parent_id: l2_gardu.id },
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
