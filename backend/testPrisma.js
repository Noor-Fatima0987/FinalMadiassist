const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config({ path: 'd:/FYP Project/FinalMadiassist/backend/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const updatedUser = await prisma.user.update({
      where: { firebaseId: '6tL8glb4atbeECi3J5MqaPE0iaU2' },
      data: {
        fullName: 'Areeba',
        doctorProfile: {
          upsert: {
            create: { specialty: 'Cardio', experience: 5, bio: 'bio' },
            update: { specialty: 'Cardio', experience: 5, bio: 'bio' }
          }
        }
      }
    });
    console.log(updatedUser);
  } catch (e) {
    console.error("PRISMA ERROR:", e);
  }
}

main().finally(() => prisma.$disconnect());
