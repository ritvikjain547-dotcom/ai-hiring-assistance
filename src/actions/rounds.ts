'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import {
  sendRoundAdvanceEmail,
  sendRoundRejectionEmail,
  sendFinalOfferEmail,
  sendInterviewScheduledEmail,
} from "@/lib/email";

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
 * Update a round's status with review text.
 * Handles "Selected" (PASSED) and "Rejected" (FAILED) with review modal flow.
 * Automatically sends appropriate emails based on the outcome.
 */
export async function updateRoundStatus(
  roundId: string,
  status: string,
  review?: string,
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
        include: {
          job: true,
          applicant: { select: { name: true, email: true } },
          interviewRounds: { orderBy: { roundNumber: "asc" } },
        },
      },
    },
  });

  if (!round) return { error: "Round not found" };
  if (round.application.job.recruiterId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  // Update the round with review
  await prisma.interviewRound.update({
    where: { id: roundId },
    data: {
      status: status as any,
      review: review || undefined,
      reviewedAt: review ? new Date() : undefined,
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
  const allPassed = passedCount === allRounds.length && allRounds.length > 0;

  // Determine application status
  let applicationStatus: string | undefined;
  if (hasFailed) {
    applicationStatus = "REJECTED";
  } else if (allPassed) {
    applicationStatus = "HIRED";
  } else if (status === "PASSED" && passedCount > 0 && !allPassed) {
    // Candidate was shortlisted (passed a non-final round)
    applicationStatus = "SHORTLISTED";
  }

  await prisma.application.update({
    where: { id: round.applicationId },
    data: {
      currentRound: passedCount,
      ...(applicationStatus ? { status: applicationStatus as any } : {}),
    },
  });

  const applicant = round.application.applicant;
  const job = round.application.job;

  try {
    if (status === "PASSED") {
      if (allPassed) {
        // All rounds passed → send offer letter with PDF attachment
          await sendFinalOfferEmail(
            applicant.name,
            applicant.email,
            job.title,
            job.company,
            allRounds.length,
            {
              salaryMin: job.salaryMin,
              salaryMax: job.salaryMax,
              salaryCurrency: job.salaryCurrency,
              employmentType: job.employmentType,
              location: job.location,
              locationType: job.locationType,
            }
          );
        } else {
          // Find next round
          const nextRound = allRounds.find(
            (r) => r.roundNumber === round.roundNumber + 1
          );
          await sendRoundAdvanceEmail(
            applicant.name,
            applicant.email,
            job.title,
            job.company,
            round.roundName,
            round.roundNumber,
            nextRound?.roundName || null
          );
        }
    } else if (status === "FAILED") {
      // Rejected at this round
      await sendRoundRejectionEmail(
        applicant.name,
        applicant.email,
        job.title,
        job.company,
        round.roundName,
        round.roundNumber
      );
    }
  } catch (err) {
    console.error("Failed to send round email:", err);
  }

  revalidatePath(`/dashboard/recruiter/jobs/${round.application.jobId}`);
  revalidatePath("/dashboard/applicant/applications");
  return { success: true };
}

/**
 * Schedule an interview for a round — picks date/time and sends email to applicant.
 */
export async function scheduleRound(
  roundId: string,
  scheduledDate: string, // ISO date string from the client
  interviewLink?: string,
  interviewInfo?: string
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

   const round = await prisma.interviewRound.findUnique({
    where: { id: roundId },
    include: {
      application: {
        include: {
          job: true,
          applicant: { select: { name: true, email: true } },
          interviewRounds: { orderBy: { roundNumber: "asc" } },
        },
      },
    },
  });

  if (!round) return { error: "Round not found" };
  if (round.application.job.recruiterId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const dateObj = new Date(scheduledDate);
  if (isNaN(dateObj.getTime())) {
    return { error: "Invalid date" };
  }

  // Update round with scheduled date and status
  await prisma.interviewRound.update({
    where: { id: roundId },
    data: {
      status: "SCHEDULED",
      scheduledAt: new Date(),
      scheduledDate: dateObj,
      interviewLink: interviewLink?.trim() || null,
      interviewInfo: interviewInfo?.trim() || null,
    },
  });

  const applicant = round.application.applicant;
  const job = round.application.job;

  // Check if the previous round was cleared to include in the email
  const previousRound = round.application.interviewRounds.find(
    (r) => r.roundNumber === round.roundNumber - 1
  );
  const clearedRound =
    previousRound && previousRound.status === "PASSED"
      ? { roundName: previousRound.roundName, roundNumber: previousRound.roundNumber }
      : null;

  // Send interview scheduled email directly (not in after() for reliability)
  try {
    await sendInterviewScheduledEmail(
      applicant.name,
      applicant.email,
      job.title,
      job.company,
      round.roundName,
      round.roundNumber,
      dateObj,
      interviewLink?.trim() || null,
      interviewInfo?.trim() || null,
      clearedRound
    );
  } catch (err) {
    console.error("Failed to send interview scheduled email:", err);
  }

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
