require('dotenv').config({ path: 'C:/Users/farih/Semester 6/INTERNSHIP/Backend-Web-PLN/.env' });
const prisma = require('C:/Users/farih/Semester 6/INTERNSHIP/Backend-Web-PLN/config/db');

async function main() {
  const items = await prisma.listrikpedia.findMany();
  for (let item of items) {
    let newType = 'singkatan';
    const isAbbr = item.abbr === item.abbr.toUpperCase() && item.abbr.length <= 5 && !item.abbr.includes(' ');
    
    if (!isAbbr) {
      newType = 'istilah';
    }
    
    // Some specific overrides
    if (['KWH Meter', 'NH Fuse'].includes(item.abbr)) {
        newType = 'istilah';
    }

    if (item.type !== newType) {
        await prisma.listrikpedia.update({
            where: { id: item.id },
            data: { type: newType }
        });
        console.log(`Updated ${item.abbr} to ${newType}`);
    }
  }
  console.log('Done fixing ListrikPedia types.');
  process.exit(0);
}
main();
