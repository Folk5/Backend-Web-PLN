const fs = require('fs');
const prisma = require('./config/db');
async function check() {
  const q = await prisma.question.findFirst({where:{text:{contains:'sayap'}}, include: {options: true}});
  fs.writeFileSync('q.json', JSON.stringify(q, null, 2));
}
check().finally(()=>process.exit(0));
