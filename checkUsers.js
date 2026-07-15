const prisma = require('./config/db.js');
prisma.user.findMany().then(users => {
  console.log("USERS:", JSON.stringify(users, null, 2));
}).catch(console.error).finally(() => prisma.$disconnect());
