'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { supabase } from "@/lib/supabase";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const phone = formData.get("phone") as string;
  const location = formData.get("location") as string;
  const bio = formData.get("bio") as string;
  const linkedinUrl = formData.get("linkedinUrl") as string;
  const githubUrl = formData.get("githubUrl") as string;
  const portfolioUrl = formData.get("portfolioUrl") as string;
  const skills = formData.get("skills") as string;
  const experienceYears = formData.get("experienceYears") as string;
  const education = formData.get("education") as string;

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: {
      phone: phone || null,
      location: location || null,
      bio: bio || null,
      linkedinUrl: linkedinUrl || null,
      githubUrl: githubUrl || null,
      portfolioUrl: portfolioUrl || null,
      skills: skills || null,
      experienceYears: experienceYears || null,
      education: education || null,
    },
    create: {
      userId: session.user.id,
      phone: phone || null,
      location: location || null,
      bio: bio || null,
      linkedinUrl: linkedinUrl || null,
      githubUrl: githubUrl || null,
      portfolioUrl: portfolioUrl || null,
      skills: skills || null,
      experienceYears: experienceYears || null,
      education: education || null,
    },
  });

  revalidatePath("/dashboard/applicant/profile");
  return { success: true };
}


export async function getProfile() {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.profile.findUnique({
    where: { userId: session.user.id },
  });
}

export async function getUserWithProfile() {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });
}

export async function uploadProfilePhoto(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) {
    return { error: "No file uploaded" };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Only JPEG, PNG and WebP images are allowed" };
  }

  // Max 2MB
  if (file.size > 2 * 1024 * 1024) {
    return { error: "Image size must be less than 2MB" };
  }

  const ext = path.extname(file.name) || ".jpg";
  const fileName = `${session.user.id}-${Date.now()}${ext}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let photoUrl = "";

  if (supabase) {
    const { data, error } = await supabase.storage
      .from("profile-photos")
      .upload(fileName, buffer, {
        contentType: file.type,
        duplex: "half",
      });

    if (error) {
      return { error: `Failed to upload to Supabase: ${error.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("profile-photos")
      .getPublicUrl(fileName);

    photoUrl = publicUrl;
  } else {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "photos");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    photoUrl = `/uploads/photos/${fileName}`;
  }

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: { profilePhotoUrl: photoUrl },
    create: { userId: session.user.id, profilePhotoUrl: photoUrl }
  });

  revalidatePath("/dashboard/applicant/profile");
  revalidatePath("/dashboard", "layout");
  return { success: true, photoUrl };
}
