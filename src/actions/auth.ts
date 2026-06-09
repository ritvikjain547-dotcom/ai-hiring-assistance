'use server';

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { sendWelcomeEmail, sendOTPEmail, sendPasswordResetEmail } from "@/lib/email";

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

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "No account found with this email. Create one free.", showSignUp: true, email };
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

  if (user.role === "RECRUITER") {
    redirect("/dashboard/recruiter");
  } else {
    redirect("/dashboard/applicant");
  }
}

export async function sendLoginOTP(email: string) {
  if (!email) {
    return { error: "Email address is required" };
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "No account found with this email. Create one free.", showSignUp: true, email };
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

  // Store in database
  try {
    // Delete any existing codes first
    await prisma.otpToken.deleteMany({
      where: { email },
    });

    await prisma.otpToken.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // Send email
    await sendOTPEmail(email, code);

    return { success: true };
  } catch (error) {
    console.error("Error generating/sending OTP:", error);
    return { error: "Failed to send OTP code. Please try again." };
  }
}

export async function loginWithOTP(formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  if (!email || !otp) {
    return { error: "Email and OTP code are required" };
  }

  try {
    await signIn("otp", {
      email,
      otp,
      redirect: false,
    });
  } catch {
    return { error: "Invalid or expired OTP" };
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

export async function sendResetPasswordOTP(email: string) {
  if (!email) {
    return { error: "Email address is required" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "No account found with this email. Create one free.", showSignUp: true, email };
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

  try {
    await prisma.otpToken.deleteMany({
      where: { email },
    });

    await prisma.otpToken.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    await sendPasswordResetEmail(email, code);

    return { success: true };
  } catch (error) {
    console.error("Error sending reset password OTP:", error);
    return { error: "Failed to send verification code. Please try again." };
  }
}

export async function resetPasswordWithOTP(formData: FormData) {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!email || !otp || !newPassword) {
    return { error: "Email, verification code, and new password are required" };
  }

  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "No account found with this email" };
  }

  // Verify OTP
  const otpRecord = await prisma.otpToken.findFirst({
    where: {
      email,
      code: otp,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otpRecord) {
    return { error: "Invalid or expired verification code" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  try {
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    // Clean up verification token
    await prisma.otpToken.delete({
      where: { id: otpRecord.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: "Failed to reset password. Please try again." };
  }
}


