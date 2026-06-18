

import { callGemini, isAiConfigured } from "./config";
import { getFormatInstructions, parseAnalysisResponse, type ResumeAnalysisResult } from "./parsers";

interface JobDetails {
  title: string;
  company: string;
  description: string;
  requiredSkills: string | null;
  experienceLevel: string | null;
  location: string;
  employmentType: string;
}

interface RecruiterPrefs {
  recruitmentStyle: string | null;
  minExperienceYears: number | null;
  maxExperienceYears: number | null;
  requiredEducation: string | null;
  mustHaveSkills: string | null;
  niceToHaveSkills: string | null;
  industryPreference: string | null;
  priorityFactors: string | null;
  customCriteria: string | null;
}

/**
 * Build the full prompt string for resume analysis.
 */
function buildPrompt(
  resumeText: string,
  coverLetter: string | null,
  job: JobDetails,
  preferences: RecruiterPrefs | null,
  formatInstructions: string
): string {
  const systemPart = preferences
    ? `You are an expert AI recruitment analyst with deep knowledge of hiring, talent assessment, and resume screening. Your task is to analyze a candidate's resume against a specific job posting and recruiter preferences.

You are thorough, fair, and unbiased. You evaluate candidates based on their actual skills, experience, and qualifications — not on demographics, age, gender, or personal characteristics.

SCORING GUIDELINES based on recruiter's recruitment style:
- If style is "strict": Be very rigorous. Only give high scores for near-perfect matches. Weight missing skills heavily.
- If style is "balanced": Apply reasonable standards. Give credit for transferable skills and related experience.
- If style is "flexible": Be more lenient. Value potential, related experience, and willingness to learn.

${formatInstructions}`
    : `You are an expert AI recruitment analyst with deep knowledge of hiring, talent assessment, and resume screening. Your task is to analyze a candidate's resume against a specific job posting.

You are thorough, fair, and unbiased. You evaluate candidates based on their actual skills, experience, and qualifications — not on demographics, age, gender, or personal characteristics.

Use a balanced assessment approach — give credit for transferable skills and related experience, but also note significant gaps.

${formatInstructions}`;

  let userPart = `Analyze this candidate's resume for the following job position.

=== JOB DETAILS ===
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Required Skills: ${job.requiredSkills || "Not specified"}
Experience Level: ${job.experienceLevel || "Not specified"}
Location: ${job.location}
Employment Type: ${job.employmentType.replace("_", " ")}`;

  if (preferences) {
    userPart += `

=== RECRUITER PREFERENCES ===
Recruitment Style: ${preferences.recruitmentStyle || "balanced"}
Minimum Experience (years): ${preferences.minExperienceYears?.toString() || "Not specified"}
Maximum Experience (years): ${preferences.maxExperienceYears?.toString() || "Not specified"}
Required Education: ${preferences.requiredEducation || "Not specified"}
Must-Have Skills: ${preferences.mustHaveSkills || "Not specified"}
Nice-to-Have Skills: ${preferences.niceToHaveSkills || "Not specified"}
Industry Preference: ${preferences.industryPreference || "No preference"}
Priority Factors: ${preferences.priorityFactors || "Skills and experience"}
Special Requirements: ${preferences.customCriteria || "None"}`;
  }

  userPart += `

=== CANDIDATE RESUME ===
${resumeText}

=== CANDIDATE COVER LETTER ===
${coverLetter || "No cover letter provided"}

Now analyze this candidate and produce the structured JSON output.`;

  return `${systemPart}\n\n---\n\n${userPart}`;
}

/**
 * Main RAG pipeline: Analyzes a resume against job requirements using Gemini.
 * 
 * 1. Builds the prompt with job details, recruiter preferences, and resume text
 * 2. Calls Gemini directly via @google/generative-ai SDK
 * 3. Parses the structured output with Zod validation
 * 4. Returns the validated analysis result
 */
export async function analyzeResume(
  resumeText: string,
  coverLetter: string | null,
  job: JobDetails,
  preferences: RecruiterPrefs | null
): Promise<ResumeAnalysisResult> {
  if (!isAiConfigured()) {
    throw new Error("AI is not configured. Please add valid Gemini API keys (starting with AIza) to .env");
  }

  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("Resume text is too short for meaningful analysis");
  }

  // Truncate extremely long resumes to fit context window
  const maxResumeLength = 15000;
  const truncatedResume = resumeText.length > maxResumeLength
    ? resumeText.substring(0, maxResumeLength) + "\n\n[Resume truncated for analysis]"
    : resumeText;

  const formatInstructions = getFormatInstructions();
  const prompt = buildPrompt(truncatedResume, coverLetter, job, preferences, formatInstructions);

  console.log(`[AI Analysis] Sending prompt to Gemini (${prompt.length} chars)...`);

  const rawResponse = await callGemini(prompt, 0.3, 3);

  console.log(`[AI Analysis] Got response (${rawResponse.length} chars), parsing...`);

  // Parse and validate the response
  const result = parseAnalysisResponse(rawResponse);
  console.log(`[AI Analysis] Score: ${result.overallScore}, Classification: ${result.classification}`);
  return result;
}

/**
 * Quick analysis variant — uses a simpler prompt for faster results.
 * Good for re-analysis or batch processing.
 */
export async function quickAnalyzeResume(
  resumeText: string,
  jobDescription: string,
  requiredSkills: string
): Promise<{ score: number; classification: string; summary: string }> {
  if (!isAiConfigured()) {
    throw new Error("AI is not configured");
  }

  const prompt = `You are a resume screening AI. Rate this resume against the job on a scale of 0-100.

Job Description: ${jobDescription.substring(0, 2000)}
Required Skills: ${requiredSkills}

Resume: ${resumeText.substring(0, 5000)}

Respond with ONLY this JSON (no other text):
{"score": <number>, "classification": "<MATCHING|NEAR_BOUND|NOT_MATCHING>", "summary": "<one sentence>"}`;

  const rawResponse = await callGemini(prompt, 0.2, 3);

  let cleaned = rawResponse.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);

  return JSON.parse(cleaned.trim());
}
