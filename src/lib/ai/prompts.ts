

import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Main resume analysis prompt template.
 * Incorporates: resume text, job details, recruiter preferences, and format instructions.
 */
export const RESUME_ANALYSIS_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert AI recruitment analyst with deep knowledge of hiring, talent assessment, and resume screening. Your task is to analyze a candidate's resume against a specific job posting and recruiter preferences.

You are thorough, fair, and unbiased. You evaluate candidates based on their actual skills, experience, and qualifications — not on demographics, age, gender, or personal characteristics.

SCORING GUIDELINES based on recruiter's recruitment style:
- If style is "strict": Be very rigorous. Only give high scores for near-perfect matches. Weight missing skills heavily.
- If style is "balanced": Apply reasonable standards. Give credit for transferable skills and related experience.
- If style is "flexible": Be more lenient. Value potential, related experience, and willingness to learn.

{format_instructions}`,
  ],
  [
    "human",
    `Analyze this candidate's resume for the following job position.

=== JOB DETAILS ===
Title: {jobTitle}
Company: {company}
Description: {jobDescription}
Required Skills: {requiredSkills}
Experience Level: {experienceLevel}
Location: {location}
Employment Type: {employmentType}

=== RECRUITER PREFERENCES ===
Recruitment Style: {recruitmentStyle}
Minimum Experience (years): {minExperience}
Maximum Experience (years): {maxExperience}
Required Education: {requiredEducation}
Must-Have Skills: {mustHaveSkills}
Nice-to-Have Skills: {niceToHaveSkills}
Industry Preference: {industryPreference}
Priority Factors: {priorityFactors}
Special Requirements: {customCriteria}

=== CANDIDATE RESUME ===
{resumeText}

=== CANDIDATE COVER LETTER ===
{coverLetter}

Now analyze this candidate and produce the structured JSON output.`,
  ],
]);

/**
 * Fallback prompt for when no recruiter preferences are set.
 * Uses only job details and resume to produce analysis.
 */
export const RESUME_ANALYSIS_PROMPT_NO_PREFS = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert AI recruitment analyst with deep knowledge of hiring, talent assessment, and resume screening. Your task is to analyze a candidate's resume against a specific job posting.

You are thorough, fair, and unbiased. You evaluate candidates based on their actual skills, experience, and qualifications — not on demographics, age, gender, or personal characteristics.

Use a balanced assessment approach — give credit for transferable skills and related experience, but also note significant gaps.

{format_instructions}`,
  ],
  [
    "human",
    `Analyze this candidate's resume for the following job position.

=== JOB DETAILS ===
Title: {jobTitle}
Company: {company}
Description: {jobDescription}
Required Skills: {requiredSkills}
Experience Level: {experienceLevel}
Location: {location}
Employment Type: {employmentType}

=== CANDIDATE RESUME ===
{resumeText}

=== CANDIDATE COVER LETTER ===
{coverLetter}

Now analyze this candidate and produce the structured JSON output.`,
  ],
]);
