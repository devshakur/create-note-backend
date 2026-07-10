import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const { Pool } = pg

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
})

const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log("DB Connected via Prisma")
    } catch (error) {
        console.log(`DB disconnected via Prisma: ${error}`)
        process.exit(1)
    }
}

const disconnectDB = async () => {
    await pool.end()
    await prisma.$disconnect()
}

export { prisma, connectDB, disconnectDB }
