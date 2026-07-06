'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Get the recruiter's setup info: type, company name, and client companies (for agency).
 */
export async function getRecruiterSetup() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      recruiterType: true,
      companyName: true,
      recruiterCompanies: {
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      },
    },
  });

  return user;
}

/**
 * Set recruiter type and optionally company name (for Company HR).
 */
export async function setRecruiterType(
  type: "COMPANY_HR" | "AGENCY",
  companyName?: string
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  if (type === "COMPANY_HR" && (!companyName || !companyName.trim())) {
    return { error: "Company name is required for Company HR" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      recruiterType: type as any,
      companyName: type === "COMPANY_HR" ? companyName!.trim() : null,
    },
  });

  revalidatePath("/dashboard/recruiter/jobs/new");
  return { success: true };
}

/**
 * Add a client company (for recruiting agencies).
 */
export async function addRecruiterCompany(name: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  if (!name || !name.trim()) {
    return { error: "Company name is required" };
  }

  try {
    const company = await prisma.recruiterCompany.create({
      data: {
        recruiterId: session.user.id,
        name: name.trim(),
      },
    });

    revalidatePath("/dashboard/recruiter/jobs/new");
    revalidatePath("/dashboard/recruiter/companies");
    return { success: true, company: { id: company.id, name: company.name } };
  } catch (err: any) {
    if (err?.code === "P2002") {
      return { error: "This company already exists in your list" };
    }
    return { error: "Failed to add company" };
  }
}

/**
 * Delete a client company (for recruiting agencies).
 */
export async function deleteRecruiterCompany(companyId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const company = await prisma.recruiterCompany.findUnique({
    where: { id: companyId },
  });

  if (!company || company.recruiterId !== session.user.id) {
    return { error: "Company not found" };
  }

  await prisma.recruiterCompany.delete({
    where: { id: companyId },
  });

  revalidatePath("/dashboard/recruiter/jobs/new");
  revalidatePath("/dashboard/recruiter/companies");
  return { success: true };
}

/**
 * Get all client companies for agency recruiter.
 */
export async function getRecruiterCompanies() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return [];
  }

  return prisma.recruiterCompany.findMany({
    where: { recruiterId: session.user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
