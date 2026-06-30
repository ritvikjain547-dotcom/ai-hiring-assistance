'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import path from "path";
import { supabase } from "@/lib/supabase";
import { sendApplicationReceivedEmail, sendStatusUpdateEmail } from "@/lib/email";
import { extractResumeText } from "@/lib/resumeParser";
import { analyzeResume } from "@/lib/ai/analyzeResume";
import { isAiConfigured } from "@/lib/ai/config";
import { scheduleDecisionEmail, sendOverrideEmail } from "@/lib/emailScheduler";

/**
 * Run AI analysis on an application in the background.
 * This is called async after the application is created.
 */
async function runAiAnalysis(applicationId: string, jobId: string): Promise<void> {
  try {
    // Fetch application with resume
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { resumeUrl: true, coverLetter: true },
    });

    if (!application?.resumeUrl) {
      console.log(`[AI] No resume URL for application ${applicationId}`);
      return;
    }

    // Step 1: Extract text from resume
    console.log(`[AI] Extracting resume text for application ${applicationId}...`);
    const resumeText = await extractResumeText(application.resumeUrl);

    // Save extracted text
    await prisma.application.update({
      where: { id: applicationId },
      data: { resumeText },
    });

    // Step 2: Fetch job details and recruiter preferences
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { preference: true },
    });

    if (!job) {
      console.error(`[AI] Job ${jobId} not found`);
      return;
    }

    // Step 3: Run AI analysis via LangChain + Gemini
    console.log(`[AI] Running LangChain analysis for application ${applicationId}...`);
    const result = await analyzeResume(
      resumeText,
      application.coverLetter,
      {
        title: job.title,
        company: job.company,
        description: job.description,
        requiredSkills: job.requiredSkills,
        experienceLevel: job.experienceLevel,
        location: job.location,
        employmentType: job.employmentType,
      },
      job.preference
    );

    // Step 4: Keep Round 1 as PENDING for manual recruiter review and confirmation
    const currentRound = 0;

    await prisma.application.update({
      where: { id: applicationId },
      data: {
        aiScore: result.overallScore,
        aiAnalysis: result.recommendation,
        aiClassification: result.classification as any,
        aiSkillsMatch: JSON.stringify(result.matchedSkills),
        aiSkillsGap: JSON.stringify(result.missingSkills),
        aiExperienceMatch: result.experienceRelevant,
        aiEducationMatch: result.educationRelevant,
        aiOverallSummary: result.overallSummary,
        currentRound,
        // Also update application status based on classification
        status: result.classification === "MATCHING" || result.classification === "NEAR_BOUND"
          ? "REVIEWING"
          : "REJECTED",
      },
    });

    console.log(`[AI] Analysis complete for ${applicationId}: Score=${result.overallScore}, Class=${result.classification}`);

    // Step 5: Schedule decision email (5-minute delay)
    await scheduleDecisionEmail(applicationId);

  } catch (error) {
    console.error(`[AI] Analysis failed for application ${applicationId}:`, error);
    // Mark as pending review so recruiter knows AI didn't finish
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        aiClassification: "PENDING_REVIEW",
        aiOverallSummary: "AI analysis could not be completed. Manual review required.",
      },
    }).catch(() => {});
  }
}

export async function applyForJob(formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "APPLICANT") {
    return { error: "Unauthorized" };
  }

  try {
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
    // Fallback: Store as base64 data URL in the database
    // This works on serverless platforms like Vercel where the filesystem is read-only
    const base64 = buffer.toString("base64");
    resumeUrl = `data:${file.type};base64,${base64}`;
  }

  // Fetch job to get round configuration
  const jobDetails = await prisma.job.findUnique({
    where: { id: jobId },
    select: { title: true, company: true, totalRounds: true, roundNames: true },
  });

  const application = await prisma.application.create({
    data: {
      jobId,
      applicantId: session.user.id,
      coverLetter: coverLetter || null,
      resumeUrl: resumeUrl,
      aiClassification: "PENDING_REVIEW",
      totalRounds: jobDetails?.totalRounds || null,
      currentRound: 0,
    },
  });

  // Auto-initialize interview rounds based on totalRounds and roundNames
  if (jobDetails?.totalRounds && jobDetails.totalRounds > 0) {
    try {
      const customNames = jobDetails.roundNames 
        ? jobDetails.roundNames.split(",").map(n => n.trim()) 
        : [];
        
      const roundsData = Array.from({ length: jobDetails.totalRounds }, (_, i) => ({
        applicationId: application.id,
        roundNumber: i + 1,
        roundName: customNames[i] || `Round ${i + 1}`,
      }));
      await prisma.interviewRound.createMany({ data: roundsData });
    } catch (err) {
      console.error("Failed to initialize interview rounds:", err);
    }
  }

  // Schedule background work using Next.js after() to ensure it runs
  // even after the response is sent (fire-and-forget promises get killed)
  after(async () => {
    // Send confirmation email
    try {
      if (jobDetails && session.user.email) {
        await sendApplicationReceivedEmail(
          session.user.name || "Applicant",
          session.user.email,
          jobDetails.title,
          jobDetails.company
        );
      }
    } catch (err) {
      console.error("Failed to send application confirmation email:", err);
    }

    // Trigger AI resume analysis
    if (isAiConfigured()) {
      try {
        await runAiAnalysis(application.id, jobId);
      } catch (err) {
        console.error("Background AI analysis failed:", err);
      }
    } else {
      console.log("[AI] Skipping AI analysis — no Gemini API keys configured");
    }
  });

  revalidatePath(`/dashboard/applicant/jobs/${jobId}`);
  revalidatePath("/dashboard/applicant/applications");
  revalidatePath("/dashboard/recruiter/applications");
  return { success: true };
  } catch (err) {
    console.error("Failed to submit application:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return { error: `Something went wrong: ${message}` };
  }
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
      interviewRounds: {
        orderBy: { roundNumber: "asc" },
      },
    },
    orderBy: { appliedAt: "desc" },
  });
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
  options?: {
    rejectionReason?: string;
    approvalNotes?: string;
    recruiterFeedback?: string;
    startDate?: string;
  }
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

  // Check if this is an override of AI decision
  const isOverride = application.aiClassification &&
    application.aiClassification !== "PENDING_REVIEW" &&
    !isStatusConsistentWithClassification(status, application.aiClassification);

  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: status as any,
      recruiterOverride: isOverride || application.recruiterOverride,
      ...(options?.rejectionReason !== undefined ? { rejectionReason: options.rejectionReason } : {}),
      ...(options?.approvalNotes !== undefined ? { approvalNotes: options.approvalNotes } : {}),
      ...(options?.recruiterFeedback !== undefined ? { recruiterFeedback: options.recruiterFeedback } : {}),
      ...(status === "HIRED" && options?.startDate ? { startDate: new Date(options.startDate) } : {}),
    },
  });

  // Send status update email after response using after()
  if (["REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"].includes(status)) {
    after(async () => {
      try {
        if (isOverride) {
          await sendOverrideEmail(applicationId, status);
        } else {
          await sendStatusUpdateEmail(
            application.applicant.name || "Applicant",
            application.applicant.email,
            application.job.title,
            application.job.company,
            status as any,
            status === "HIRED" ? {
              salaryMin: application.job.salaryMin,
              salaryMax: application.job.salaryMax,
              salaryCurrency: application.job.salaryCurrency,
              employmentType: application.job.employmentType,
              location: application.job.location,
              locationType: application.job.locationType,
              startDate: options?.startDate || null,
            } : undefined
          );
        }
      } catch (err) {
        console.error("Failed to send status update email:", err);
      }
    });
  }

  revalidatePath(`/dashboard/recruiter/jobs/${application.jobId}`);
  revalidatePath("/dashboard/recruiter/applications");
  revalidatePath("/dashboard/applicant/applications");
  return { success: true };
}

/**
 * Check if a manual status change is consistent with the AI classification.
 */
function isStatusConsistentWithClassification(
  status: string,
  classification: string
): boolean {
  if (classification === "MATCHING") {
    return ["SHORTLISTED", "HIRED", "REVIEWING"].includes(status);
  }
  if (classification === "NEAR_BOUND") {
    return ["REVIEWING", "SHORTLISTED"].includes(status);
  }
  if (classification === "NOT_MATCHING") {
    return status === "REJECTED";
  }
  return true; // PENDING_REVIEW — anything is consistent
}

export async function getRecruiterApplications(classificationFilter?: string) {
  const session = await auth();
  if (!session?.user) return [];

  const where: any = {
    job: { recruiterId: session.user.id },
  };

  if (classificationFilter && classificationFilter !== "ALL") {
    where.aiClassification = classificationFilter;
  }

  return prisma.application.findMany({
    where,
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
    orderBy: [
      { aiScore: { sort: "desc", nulls: "last" } },
      { appliedAt: "desc" },
    ],
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

/**
 * Manually trigger AI re-analysis on an application.
 */
export async function reAnalyzeApplication(applicationId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application || application.job.recruiterId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  if (!isAiConfigured()) {
    return { error: "AI is not configured. Add Gemini API keys to .env" };
  }

  // Reset classification
  await prisma.application.update({
    where: { id: applicationId },
    data: { aiClassification: "PENDING_REVIEW" },
  });

  // Run analysis
  await runAiAnalysis(applicationId, application.jobId);

  revalidatePath(`/dashboard/recruiter/jobs/${application.jobId}`);
  revalidatePath("/dashboard/recruiter/applications");
  return { success: true };
}

export async function getApplicationByIdForApplicant(applicationId: string) {
  const session = await auth();
  if (!session?.user) return null;

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: {
          recruiter: { select: { name: true, email: true } },
        },
      },
      interviewRounds: {
        orderBy: { roundNumber: "asc" },
      },
    },
  });

  if (!application || application.applicantId !== session.user.id) {
    return null;
  }

  return application;
}
