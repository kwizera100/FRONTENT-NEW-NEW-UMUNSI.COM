const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: 'Eddy' }, { email: { contains: 'eddy', mode: 'insensitive' } }] }
  });
  console.log(user ? JSON.stringify({id: user.id, username: user.username, email: user.email, role: user.role}) : 'not found');
  if (!user) { await prisma.$disconnect(); return; }
  await prisma.user.update({ where: { id: user.id }, data: { role: 'AUTHOR' } });
  console.log('role updated to AUTHOR');
  await prisma.$disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
