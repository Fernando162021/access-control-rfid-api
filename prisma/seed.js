const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@admin.com';
  const adminPassword = 'admin123';
  const adminName = 'Admin';

  const existing = await prisma.users.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await prisma.users.create({
    data: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      is_active: true
    }
  });
  console.log('Admin user created:', adminEmail);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
