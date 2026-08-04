import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'khanhkhanhvn757@gmail.com' },
    data: { role: 'ADMIN' }
  });
  console.log('Updated user to ADMIN');
}

main().catch(console.error).finally(() => prisma.$disconnect());
