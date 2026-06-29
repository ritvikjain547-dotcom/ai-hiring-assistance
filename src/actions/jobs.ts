'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJob(formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const locationType = formData.get("locationType") as string;
  const employmentType = formData.get("employmentType") as string;
  const experienceLevel = formData.get("experienceLevel") as string;
  const requiredSkills = formData.get("requiredSkills") as string;
  const salaryMin = formData.get("salaryMin") as string;
  const salaryMax = formData.get("salaryMax") as string;
  const deadline = formData.get("deadline") as string;
  const totalRounds = formData.get("totalRounds") as string;
  const roundNames = formData.get("roundNames") as string;
  const setupAi = formData.get("setupAi") as string;

  if (!title || !company || !description || !location) {
    return { error: "Please fill in all required fields" };
  }

  const job = await prisma.job.create({
    data: {
      recruiterId: session.user.id,
      title,
      company,
      description,
      location,
      locationType: (locationType as any) || "REMOTE",
      employmentType: (employmentType as any) || "FULL_TIME",
      experienceLevel: experienceLevel || null,
      requiredSkills: requiredSkills || null,
      salaryMin: salaryMin ? parseInt(salaryMin) : null,
      salaryMax: salaryMax ? parseInt(salaryMax) : null,
      salaryCurrency: (formData.get("salaryCurrency") as string) || "USD",
      totalRounds: totalRounds ? parseInt(totalRounds) : 1,
      roundNames: roundNames || null,
      deadline: deadline ? new Date(deadline) : null,
    },
  });

  revalidatePath("/dashboard/recruiter/jobs");
  
  if (setupAi === "true") {
    redirect(`/dashboard/recruiter/jobs/${job.id}/preferences`);
  } else {
    redirect("/dashboard/recruiter/jobs");
  }
}

export async function updateJob(jobId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const locationType = formData.get("locationType") as string;
  const employmentType = formData.get("employmentType") as string;
  const experienceLevel = formData.get("experienceLevel") as string;
  const requiredSkills = formData.get("requiredSkills") as string;
  const salaryMin = formData.get("salaryMin") as string;
  const salaryMax = formData.get("salaryMax") as string;
  const status = formData.get("status") as string;
  const deadline = formData.get("deadline") as string;

  await prisma.job.update({
    where: { id: jobId, recruiterId: session.user.id },
    data: {
      title,
      company,
      description,
      location,
      locationType: (locationType as any) || "REMOTE",
      employmentType: (employmentType as any) || "FULL_TIME",
      experienceLevel: experienceLevel || null,
      requiredSkills: requiredSkills || null,
      salaryMin: salaryMin ? parseInt(salaryMin) : null,
      salaryMax: salaryMax ? parseInt(salaryMax) : null,
      status: (status as any) || "OPEN",
      deadline: deadline ? new Date(deadline) : null,
    },
  });

  revalidatePath(`/dashboard/recruiter/jobs/${jobId}`);
  redirect(`/dashboard/recruiter/jobs/${jobId}`);
}

export async function deleteJob(jobId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  await prisma.job.delete({
    where: { id: jobId, recruiterId: session.user.id },
  });

  revalidatePath("/dashboard/recruiter/jobs");
  redirect("/dashboard/recruiter/jobs");
}

export async function getRecruiterJobs() {
  const session = await auth();
  if (!session?.user) return [];

  return prisma.job.findMany({
    where: { recruiterId: session.user.id },
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getJobById(jobId: string) {
  return prisma.job.findUnique({
    where: { id: jobId },
    include: {
      recruiter: { select: { name: true, email: true } },
      preference: true,
      applications: {
        where: {
          status: { not: "REJECTED" },
        },
        include: {
          applicant: {
            select: {
              name: true,
              email: true,
              profile: true,
            },
          },
          interviewRounds: {
            orderBy: { roundNumber: "asc" },
          },
        },
        orderBy: [
          { aiScore: { sort: "desc", nulls: "last" } },
          { appliedAt: "desc" },
        ],
      },
      _count: { select: { applications: true } },
    },
  });
}

export async function getAllJobs(
  search?: string,
  locationType?: string,
  employmentType?: string,
  location?: string,
  minSalary?: string
) {
  const where: any = { status: "OPEN" };

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { company: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (locationType && locationType !== "ALL") {
    where.locationType = locationType;
  }

  if (employmentType && employmentType !== "ALL") {
    where.employmentType = employmentType;
  }

  if (location && location.trim() !== "") {
    where.location = { contains: location.trim() };
  }

  if (minSalary && !isNaN(parseInt(minSalary))) {
    where.salaryMin = { gte: parseInt(minSalary) };
  }

  return prisma.job.findMany({
    where,
    include: {
      recruiter: { select: { name: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
