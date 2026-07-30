const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_pln_2026_pusdiklat';
const prisma = require('./config/db.js');
async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'instruktur@gmail.com' } });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, unit: user.unit, status: user.status, role: user.role || 'Peserta' }, SECRET, { expiresIn: '2h' });
  console.log(jwt.decode(token));
}
main().catch(console.error).finally(() => prisma.$disconnect());
