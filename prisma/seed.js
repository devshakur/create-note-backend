import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const notes = [
  {
    title: "Note 1",
    content: "This is the first note",
    userId: "cc38885b-f506-49ce-a368-0440dfb6e37d",
  },
  {
    title: "Note 2",
    content: "This is the second note",
    userId: "cc38885b-f506-49ce-a368-0440dfb6e37d",
  },
];

const main = async () => {
  for (const note of notes) {
    await prisma.note.create({ data: note });
    console.log(`Note "${note.title}" seeded successfully`);
  }
};

main()
  .then(() => console.log("All notes seeded successfully"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
