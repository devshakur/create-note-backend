import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const main = async () => {
  const email = "demo@takenote.dev";
  const password = await bcrypt.hash("Password123!", 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Demo User",
      email,
      password,
    },
  });

  await prisma.note.deleteMany({ where: { userId: user.id } });

  await prisma.note.createMany({
    data: [
      {
        title: "Welcome note",
        content: "This is your first seeded note.",
        userId: user.id,
      },
      {
        title: "Second note",
        content: "Seed data is safe to re-run with upsert.",
        userId: user.id,
      },
    ],
  });

  console.log(`Seeded user ${user.email} with 2 notes`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
