

import { z } from "zod";

/**
 * Zod schema for the structured AI resume analysis output.
 * Used with LangChain's StructuredOutputParser equivalent pattern.
 */
export const ResumeAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100).describe(
    "Overall match score from 0-100 based on how well the candidate fits the job requirements"
  ),
  classification: z.enum(["MATCHING", "NEAR_BOUND", "NOT_MATCHING"]).describe(
    "Classification: MATCHING (score >= 75), NEAR_BOUND (score 50-74), NOT_MATCHING (score < 50)"
  ),
  matchedSkills: z.array(z.string()).describe(
    "List of skills from the job requirements that the candidate possesses"
  ),
  missingSkills: z.array(z.string()).describe(
    "List of required skills that the candidate is missing"
  ),
  experienceYears: z.number().describe(
    "Estimated total years of relevant professional experience"
  ),
  experienceRelevant: z.boolean().describe(
    "Whether the candidate's experience is relevant to the job role"
  ),
  educationLevel: z.string().describe(
    "Highest education level detected (e.g., High School, Bachelor's, Master's, PhD)"
  ),
  educationRelevant: z.boolean().describe(
    "Whether the candidate's education aligns with job requirements"
  ),
  strengths: z.array(z.string()).describe(
    "Top 3-5 strengths of this candidate for this role"
  ),
  weaknesses: z.array(z.string()).describe(
    "Top 2-4 areas where the candidate falls short for this role"
  ),
  overallSummary: z.string().describe(
    "A 2-3 sentence summary of the candidate's fit for this role"
  ),
  recommendation: z.string().describe(
    "A brief recommendation for the recruiter (e.g., 'Strong candidate - proceed to interview', 'Consider for junior role', 'Does not meet minimum requirements')"
  ),
});

export type ResumeAnalysisResult = z.infer<typeof ResumeAnalysisSchema>;

/**
 * Build format instructions string from the Zod schema for prompt injection.
 * This tells the AI exactly what JSON structure to output.
 */
export function getFormatInstructions(): string {
  return `You must respond with a valid JSON object matching this exact schema:
{
  "overallScore": <number 0-100>,
  "classification": "<MATCHING | NEAR_BOUND | NOT_MATCHING>",
  "matchedSkills": ["<skill1>", "<skill2>", ...],
  "missingSkills": ["<skill1>", "<skill2>", ...],
  "experienceYears": <number>,
  "experienceRelevant": <true | false>,
  "educationLevel": "<string>",
  "educationRelevant": <true | false>,
  "strengths": ["<strength1>", "<strength2>", ...],
  "weaknesses": ["<weakness1>", "<weakness2>", ...],
  "overallSummary": "<2-3 sentence summary>",
  "recommendation": "<brief recommendation>"
}

Classification thresholds:
- MATCHING: overallScore >= 75
- NEAR_BOUND: overallScore >= 50 and < 75
- NOT_MATCHING: overallScore < 50

IMPORTANT: Return ONLY the JSON object. No markdown, no code fences, no explanations before or after.`;
}

/**
 * Parse and validate the AI response against the schema.
 */
export function parseAnalysisResponse(rawText: string): ResumeAnalysisResult {
  // Strip markdown code fences if present
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  const parsed = JSON.parse(cleaned);
  
  // Validate and coerce with Zod
  const result = ResumeAnalysisSchema.parse(parsed);
  
  // Ensure classification matches score thresholds
  if (result.overallScore >= 75 && result.classification !== "MATCHING") {
    result.classification = "MATCHING";
  } else if (result.overallScore >= 50 && result.overallScore < 75 && result.classification !== "NEAR_BOUND") {
    result.classification = "NEAR_BOUND";
  } else if (result.overallScore < 50 && result.classification !== "NOT_MATCHING") {
    result.classification = "NOT_MATCHING";
  }

  return result;
}
