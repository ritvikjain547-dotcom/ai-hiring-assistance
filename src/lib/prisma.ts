import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not defined");
  }

  const url = new URL(process.env.DATABASE_URL);
  const host = url.hostname || "localhost";
  const port = url.port ? parseInt(url.port, 10) : 3306;
  const user = url.username || "root";
  const password = decodeURIComponent(url.password || "");
  const database = url.pathname.slice(1);

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 10,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

