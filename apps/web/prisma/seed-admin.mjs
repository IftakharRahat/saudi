import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminRole = process.env.ADMIN_ROLE ?? 'admin';

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding an admin user.');
  }

  const passwordHash = await hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail.toLowerCase() },
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: adminRole,
    },
    update: {
      passwordHash,
      role: adminRole,
    },
  });

  console.log(`Admin user upserted for ${adminEmail.toLowerCase()}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
