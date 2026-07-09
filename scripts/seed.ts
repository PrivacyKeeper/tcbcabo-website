import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed admin users
  const hashedDefault = await bcrypt.hash('johndoe123', 12);
  const hashedCaptain = await bcrypt.hash('TcbCabo2024!', 12);

  const defaultAdmin = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedDefault,
      name: 'Admin',
      role: 'admin',
    },
  });

  const captain = await prisma.user.upsert({
    where: { email: 'captain@stripedworldcharters.com' },
    update: {},
    create: {
      email: 'captain@stripedworldcharters.com',
      password: hashedCaptain,
      name: 'Captain TCB',
      role: 'admin',
    },
  });

  // Seed a sample fishing report
  const existingReport = await prisma.fishingReport.findFirst({
    where: { authorId: captain.id },
  });

  if (!existingReport) {
    await prisma.fishingReport.create({
      data: {
        title: 'Hot Marlin Bite at Gordo Banks!',
        date: new Date(),
        conditions: 'Calm seas, light winds, clear skies',
        waterTemp: '79°F',
        species: ['Blue Marlin', 'Yellowfin Tuna', 'Dorado'],
        catches: '2 blue marlin released (est. 350 & 280 lbs), 4 yellowfin tuna (30-60 lbs), 6 dorado',
        highlights: 'Incredible morning out on the water today! Hit Gordo Banks at sunrise and the blue marlin were fired up. Released two beautiful blues — the bigger one put on an incredible aerial show. Tuna and dorado were stacked up on the way back in. Another amazing day aboard TCB in Cabo.',
        hotspots: 'Gordo Banks, Inner Banks',
        published: true,
        authorId: captain.id,
      },
    });
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
