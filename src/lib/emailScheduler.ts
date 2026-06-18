

import { prisma } from "@/lib/prisma";
import { sendAiDecisionEmail } from "@/lib/email";

/**
 * Email Scheduler — Schedules AI decision emails to be sent 5 minutes after application.
 * 
 * Uses in-memory setTimeout with DB tracking. The emailScheduledFor field
 * in the Application model records when the email should be sent.
 */

const DECISION_EMAIL_DELAY_MS = 5 * 60 * 1000; // 5 minutes

// Track active timers to prevent duplicates
const activeTimers = new Map<string, NodeJS.Timeout>();

/**
 * Schedule a decision email for an application.
 * Will be sent after DECISION_EMAIL_DELAY_MS (5 minutes).
 */
export async function scheduleDecisionEmail(applicationId: string): Promise<void> {
  // Cancel any existing timer for this application
  const existingTimer = activeTimers.get(applicationId);
  if (existingTimer) {
    clearTimeout(existingTimer);
    activeTimers.delete(applicationId);
  }

  const scheduledFor = new Date(Date.now() + DECISION_EMAIL_DELAY_MS);

  // Record the scheduled time in DB
  await prisma.application.update({
    where: { id: applicationId },
    data: { emailScheduledFor: scheduledFor },
  });

  console.log(`[Email Scheduler] Scheduled decision email for application ${applicationId} at ${scheduledFor.toISOString()}`);

  // Set the timer
  const timer = setTimeout(async () => {
    activeTimers.delete(applicationId);
    await sendScheduledDecisionEmail(applicationId);
  }, DECISION_EMAIL_DELAY_MS);

  activeTimers.set(applicationId, timer);
}

/**
 * Actually send the decision email for an application.
 */
async function sendScheduledDecisionEmail(applicationId: string): Promise<void> {
  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: { select: { title: true, company: true } },
        applicant: { select: { name: true, email: true } },
      },
    });

    if (!application) {
      console.error(`[Email Scheduler] Application ${applicationId} not found`);
      return;
    }

    // Don't send if email was already sent
    if (application.emailSentAt) {
      console.log(`[Email Scheduler] Email already sent for application ${applicationId}`);
      return;
    }

    // Don't send if recruiter has manually changed the status already
    if (application.recruiterOverride) {
      console.log(`[Email Scheduler] Recruiter overrode for application ${applicationId}, sending override email instead`);
    }

    const classification = application.aiClassification || "PENDING_REVIEW";
    const summary = application.aiOverallSummary || "Your application has been reviewed.";

    await sendAiDecisionEmail(
      application.applicant.name,
      application.applicant.email,
      application.job.title,
      application.job.company,
      classification,
      summary
    );

    // Mark email as sent
    await prisma.application.update({
      where: { id: applicationId },
      data: { emailSentAt: new Date() },
    });

    console.log(`[Email Scheduler] Decision email sent for application ${applicationId} (${classification})`);
  } catch (error) {
    console.error(`[Email Scheduler] Failed to send email for ${applicationId}:`, error);
  }
}

/**
 * Send an override notification email when recruiter changes AI decision.
 */
export async function sendOverrideEmail(applicationId: string, newStatus: string): Promise<void> {
  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: { select: { title: true, company: true } },
        applicant: { select: { name: true, email: true } },
      },
    });

    if (!application) return;

    // Map the new status to a classification for the email
    let classification = "PENDING_REVIEW";
    if (newStatus === "SHORTLISTED" || newStatus === "HIRED") {
      classification = "MATCHING";
    } else if (newStatus === "REVIEWING") {
      classification = "NEAR_BOUND";
    } else if (newStatus === "REJECTED") {
      classification = "NOT_MATCHING";
    }

    const summary = newStatus === "SHORTLISTED" || newStatus === "HIRED"
      ? "After additional review by our recruitment team, we're pleased to inform you that you've been selected to move forward."
      : newStatus === "REJECTED"
      ? "After additional review by our recruitment team, we regret to inform you that we won't be moving forward."
      : "Your application status has been updated by our recruitment team.";

    await sendAiDecisionEmail(
      application.applicant.name,
      application.applicant.email,
      application.job.title,
      application.job.company,
      classification,
      summary
    );

    // Update email sent timestamp
    await prisma.application.update({
      where: { id: applicationId },
      data: { emailSentAt: new Date() },
    });
  } catch (error) {
    console.error(`[Email Scheduler] Failed to send override email for ${applicationId}:`, error);
  }
}
