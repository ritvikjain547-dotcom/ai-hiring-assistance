'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Initialize interview rounds for an application.
 * Called automatically when an applicant applies (if the job has rounds configured).
 * Can also be called manually by the recruiter.
 */
export async function initializeRounds(
  applicationId: string,
  roundNames: string[]
) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application) return { error: "Application not found" };

  // Only the job's recruiter can initialize rounds
  if ((session.user as any).role === "RECRUITER" && application.job.recruiterId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  // Delete existing rounds first (in case of re-initialization)
  await prisma.interviewRound.deleteMany({
    where: { applicationId },
  });

  // Create all rounds
  const rounds = roundNames.map((name, index) => ({
    applicationId,
    roundNumber: index + 1,
    roundName: name,
  }));

  await prisma.interviewRound.createMany({ data: rounds });

  // Update application with total rounds
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      totalRounds: roundNames.length,
      currentRound: 0,
    },
  });

  revalidatePath(`/dashboard/recruiter/jobs/${application.jobId}`);
  revalidatePath("/dashboard/applicant/applications");
  return { success: true };
}

/**
 * Update a round's status and optional feedback.
 */
export async function updateRoundStatus(
  roundId: string,
  status: string,
  feedback?: string
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const round = await prisma.interviewRound.findUnique({
    where: { id: roundId },
    include: {
      application: {
        include: { job: true },
      },
    },
  });

  if (!round) return { error: "Round not found" };
  if (round.application.job.recruiterId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  // Update the round
  await prisma.interviewRound.update({
    where: { id: roundId },
    data: {
      status: status as any,
      feedback: feedback !== undefined ? feedback : undefined,
      completedAt: ["PASSED", "FAILED"].includes(status) ? new Date() : null,
      scheduledAt: status === "SCHEDULED" ? new Date() : undefined,
    },
  });

  // Recalculate current round for the application
  const allRounds = await prisma.interviewRound.findMany({
    where: { applicationId: round.applicationId },
    orderBy: { roundNumber: "asc" },
  });

  const passedCount = allRounds.filter((r) => r.status === "PASSED").length;
  const hasFailed = allRounds.some((r) => r.status === "FAILED");

  await prisma.application.update({
    where: { id: round.applicationId },
    data: {
      currentRound: passedCount,
      // Auto-update application status based on round results
      ...(hasFailed ? { status: "REJECTED" } : {}),
      ...(passedCount === allRounds.length ? { status: "SHORTLISTED" } : {}),
    },
  });

  revalidatePath(`/dashboard/recruiter/jobs/${round.application.jobId}`);
  revalidatePath("/dashboard/applicant/applications");
  return { success: true };
}

/**
 * Add an additional round to an application.
 */
export async function addRound(applicationId: string, roundName: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true, interviewRounds: true },
  });

  if (!application) return { error: "Application not found" };
  if (application.job.recruiterId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const nextRoundNumber = application.interviewRounds.length + 1;

  await prisma.interviewRound.create({
    data: {
      applicationId,
      roundNumber: nextRoundNumber,
      roundName,
    },
  });

  await prisma.application.update({
    where: { id: applicationId },
    data: { totalRounds: nextRoundNumber },
  });

  revalidatePath(`/dashboard/recruiter/jobs/${application.jobId}`);
  revalidatePath("/dashboard/applicant/applications");
  return { success: true };
}

/**
 * Delete a round (only if PENDING).
 */
export async function deleteRound(roundId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const round = await prisma.interviewRound.findUnique({
    where: { id: roundId },
    include: {
      application: {
        include: { job: true },
      },
    },
  });

  if (!round) return { error: "Round not found" };
  if (round.application.job.recruiterId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  if (round.status !== "PENDING") {
    return { error: "Can only delete pending rounds" };
  }

  await prisma.interviewRound.delete({ where: { id: roundId } });

  // Re-number remaining rounds
  const remainingRounds = await prisma.interviewRound.findMany({
    where: { applicationId: round.applicationId },
    orderBy: { roundNumber: "asc" },
  });

  for (let i = 0; i < remainingRounds.length; i++) {
    await prisma.interviewRound.update({
      where: { id: remainingRounds[i].id },
      data: { roundNumber: i + 1 },
    });
  }

  await prisma.application.update({
    where: { id: round.applicationId },
    data: { totalRounds: remainingRounds.length },
  });

  revalidatePath(`/dashboard/recruiter/jobs/${round.application.jobId}`);
  revalidatePath("/dashboard/applicant/applications");
  return { success: true };
}
