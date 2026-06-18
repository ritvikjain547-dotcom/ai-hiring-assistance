'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveRecruiterPreference(jobId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  // Verify job belongs to this recruiter
  const job = await prisma.job.findUnique({
    where: { id: jobId, recruiterId: session.user.id },
  });

  if (!job) {
    return { error: "Job not found or unauthorized" };
  }

  const data = {
    recruiterId: session.user.id,
    minExperienceYears: formData.get("minExperienceYears")
      ? parseInt(formData.get("minExperienceYears") as string)
      : null,
    maxExperienceYears: formData.get("maxExperienceYears")
      ? parseInt(formData.get("maxExperienceYears") as string)
      : null,
    requiredEducation: (formData.get("requiredEducation") as string) || null,
    mustHaveSkills: (formData.get("mustHaveSkills") as string) || null,
    niceToHaveSkills: (formData.get("niceToHaveSkills") as string) || null,
    industryPreference: (formData.get("industryPreference") as string) || null,
    recruitmentStyle: (formData.get("recruitmentStyle") as string) || "balanced",
    priorityFactors: (formData.get("priorityFactors") as string) || null,
    customCriteria: (formData.get("customCriteria") as string) || null,
    locationPreference: (formData.get("locationPreference") as string) || null,
  };

  await prisma.recruiterPreference.upsert({
    where: { jobId },
    update: data,
    create: {
      jobId,
      ...data,
    },
  });

  revalidatePath(`/dashboard/recruiter/jobs/${jobId}`);
  revalidatePath(`/dashboard/recruiter/jobs/${jobId}/preferences`);
  return { success: true };
}

export async function getRecruiterPreference(jobId: string) {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.recruiterPreference.findUnique({
    where: { jobId },
  });
}
