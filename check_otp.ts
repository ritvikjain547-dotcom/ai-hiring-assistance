import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany();
  console.log("USERS:", users.map(u => ({ id: u.id, email: u.email, name: u.name })));
  
  const tokens = await prisma.otpToken.findMany();
  console.log("OTP TOKENS:", tokens);
}

main().catch(console.error);

