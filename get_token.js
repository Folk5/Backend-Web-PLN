require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_pln_2026_pusdiklat';
const token = jwt.sign(
  { id: '71c2e463-fb16-4628-a8fa-4c19060dbc3b', email: 'instruktur@gmail.com', name: 'User Instruktur', unit: '-', status: 'Online', role: 'Instruktur' },
  SECRET,
  { expiresIn: '2h' }
);
console.log(token);
