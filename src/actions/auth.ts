'use server';

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sendWelcomeEmail } from "@/lib/email";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "RECRUITER" | "APPLICANT";

  if (!name || !email || !password || !role) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      profile: {
        create: {},
      },
    },
  });

  // Send welcome email (asynchronously)
  sendWelcomeEmail(newUser.name, newUser.email, newUser.role).catch((err) => {
    console.error("Failed to send welcome email:", err);
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    // Sign in after register might throw in some edge cases
  }

  if (role === "RECRUITER") {
    redirect("/dashboard/recruiter");
  } else {
    redirect("/dashboard/applicant");
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    return { error: "Invalid email or password" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user?.role === "RECRUITER") {
    redirect("/dashboard/recruiter");
  } else {
    redirect("/dashboard/applicant");
  }
}
