const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    { email: 'admin@cft.ru', name: 'Admin User', role: 'ADMIN' },
    { email: 'l1@cft.ru', name: 'Analyst L1', role: 'L1' },
    { email: 'l2@cft.ru', name: 'Analyst L2', role: 'L2' },
    { email: 'l3@cft.ru', name: 'Analyst L3', role: 'L3' },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        password: hashedPassword,
      },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());