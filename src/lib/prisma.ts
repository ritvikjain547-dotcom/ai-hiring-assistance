import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function getPool(): Pool {
  if (globalForPrisma.pgPool) return globalForPrisma.pgPool;

  const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=")
      ? { rejectUnauthorized: false }
      : undefined,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    min: 0,
    max: 10,
    connectionTimeoutMillis: 15000,
    // Neon aggressively drops idle connections; recycle quickly
    idleTimeoutMillis: 5000,
  });

  // When a background connection dies (Neon closes it),
  // clear the cached pool & prisma so the next request rebuilds them.
  pool.on("error", (err) => {
    console.warn("[pg pool] Background connection error — clearing pool:", err.message);
    globalForPrisma.pgPool = undefined;
    globalForPrisma.prisma = undefined;
  });

  globalForPrisma.pgPool = pool;
  return pool;
}

function getPrismaClient(): PrismaClient {
  const pool = getPool();
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
