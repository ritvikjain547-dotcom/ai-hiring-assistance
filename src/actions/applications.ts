'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { supabase } from "@/lib/supabase";
import { sendApplicationReceivedEmail, sendStatusUpdateEmail } from "@/lib/email";

export async function applyForJob(formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "APPLICANT") {
    return { error: "Unauthorized" };
  }

  const jobId = formData.get("jobId") as string;
  const coverLetter = formData.get("coverLetter") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (!jobId) {
    return { error: "Job ID is required" };
  }

  // Check if already applied
  const existing = await prisma.application.findUnique({
    where: {
      jobId_applicantId: {
        jobId,
        applicantId: session.user.id,
      },
    },
  });

  if (existing) {
    return { error: "You have already applied for this job" };
  }

  // Update Email if changed
  if (email && email !== session.user.email) {
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      return { error: "Email is already in use by another account" };
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { email },
    });
  }

  // Update Phone if changed
  if (phone) {
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: { phone },
      create: { userId: session.user.id, phone },
    });
  }

  // Handle CV upload — resume is required per application
  const file = formData.get("resume") as File | null;
  let resumeUrl: string | null = null;

  if (!file || file.size === 0) {
    return { error: "Resume is required" };
  }

  // Validate file type
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    return { error: "Only PDF and DOC/DOCX files are allowed" };
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size must be less than 5MB" };
  }

  // Generate unique filename
  const ext = path.extname(file.name);
  const fileName = `${session.user.id}-${Date.now()}${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (supabase) {
    // Upload to Supabase Storage Bucket 'resumes'
    const { data, error } = await supabase.storage
      .from("resumes")
      .upload(fileName, buffer, {
        contentType: file.type,
        duplex: "half",
      });

    if (error) {
      return { error: `Failed to upload to Supabase: ${error.message}` };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    resumeUrl = publicUrl;
  } else {
    // Fallback: Create upload directory and write to local disk
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    resumeUrl = `/uploads/resumes/${fileName}`;
  }

  await prisma.application.create({
    data: {
      jobId,
      applicantId: session.user.id,
      coverLetter: coverLetter || null,
      resumeUrl: resumeUrl,
    },
  });

  // Fetch job details and send email (non-blocking)
  prisma.job.findUnique({
    where: { id: jobId },
    select: { title: true, company: true }
  }).then((job) => {
    if (job && session.user.email) {
      sendApplicationReceivedEmail(
        session.user.name || "Applicant",
        session.user.email,
        job.title,
        job.company
      ).catch((err) => {
        console.error("Failed to send application confirmation email:", err);
      });
    }
  }).catch((err) => {
    console.error("Failed to fetch job details for confirmation email:", err);
  });

  revalidatePath(`/dashboard/applicant/jobs/${jobId}`);
  revalidatePath("/dashboard/applicant/applications");
  return { success: true };
}

export async function getMyApplications() {
  const session = await auth();
  if (!session?.user) return [];

  return prisma.application.findMany({
    where: { applicantId: session.user.id },
    include: {
      job: {
        include: {
          recruiter: { select: { name: true } },
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  // Verify the application belongs to a job owned by this recruiter
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { 
      job: true,
      applicant: true,
    },
  });

  if (!application || application.job.recruiterId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: status as any },
  });

  // Send status update email (non-blocking)
  if (["REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"].includes(status)) {
    sendStatusUpdateEmail(
      application.applicant.name || "Applicant",
      application.applicant.email,
      application.job.title,
      application.job.company,
      status as any
    ).catch((err) => {
      console.error("Failed to send status update email:", err);
    });
  }

  revalidatePath(`/dashboard/recruiter/jobs/${application.jobId}`);
  revalidatePath("/dashboard/recruiter/applications");
  return { success: true };
}

export async function getRecruiterApplications() {
  const session = await auth();
  if (!session?.user) return [];

  return prisma.application.findMany({
    where: {
      job: { recruiterId: session.user.id },
    },
    include: {
      job: { select: { title: true, company: true } },
      applicant: {
        select: {
          name: true,
          email: true,
          profile: true,
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
}

export async function hasApplied(jobId: string) {
  const session = await auth();
  if (!session?.user) return false;

  const existing = await prisma.application.findUnique({
    where: {
      jobId_applicantId: {
        jobId,
        applicantId: session.user.id,
      },
    },
  });

  return !!existing;
}
