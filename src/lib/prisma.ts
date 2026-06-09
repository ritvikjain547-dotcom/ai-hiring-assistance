import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function getPool(): Pool {
  if (globalForPrisma.pgPool) return globalForPrisma.pgPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not defined");
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=")
      ? { rejectUnauthorized: false }
      : undefined,
    // Keep connections alive to avoid repeated SSL handshakes
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    // Maintain warm connections for faster queries
    min: 2,
    max: 10,
    // Don't wait too long for a connection
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
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
