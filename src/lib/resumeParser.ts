

/**
 * Resume text extraction utility.
 * Supports PDF and DOCX formats from both base64 data URIs and remote URLs.
 */

/**
 * Extract plain text from a resume file.
 * Handles base64 data URIs (current local storage format) and HTTP URLs (Supabase).
 */
export async function extractResumeText(resumeUrl: string): Promise<string> {
  if (!resumeUrl) {
    throw new Error("No resume URL provided");
  }

  let buffer: Buffer;
  let mimeType: string;

  if (resumeUrl.startsWith("data:")) {
    // Parse base64 data URI: data:application/pdf;base64,xxxxx
    const match = resumeUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid data URI format");
    }
    mimeType = match[1];
    buffer = Buffer.from(match[2], "base64");
  } else if (resumeUrl.startsWith("/")) {
    // Local path from public directory (e.g. /uploads/resumes/...)
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "public", resumeUrl);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at ${filePath}`);
    }
    buffer = fs.readFileSync(filePath);
    mimeType = guessContentType(resumeUrl);
  } else {
    // Fetch from remote URL
    const response = await fetch(resumeUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch resume: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    mimeType = response.headers.get("content-type") || guessContentType(resumeUrl);
  }

  // Route to appropriate parser
  if (mimeType === "application/pdf" || resumeUrl.toLowerCase().endsWith(".pdf")) {
    return extractFromPdf(buffer);
  } else if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword" ||
    resumeUrl.toLowerCase().endsWith(".docx") ||
    resumeUrl.toLowerCase().endsWith(".doc")
  ) {
    return extractFromDocx(buffer);
  } else {
    // Try PDF first, then DOCX as fallback
    try {
      return await extractFromPdf(buffer);
    } catch {
      try {
        return await extractFromDocx(buffer);
      } catch {
        throw new Error(`Unsupported resume format: ${mimeType}`);
      }
    }
  }
}

/**
 * Extract text from a PDF buffer using pdf-parse.
 */
async function extractFromPdf(buffer: Buffer): Promise<string> {
  const PDFParser = (await import("pdf2json")).default;
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(cleanText(pdfParser.getRawTextContent()));
    });
    
    pdfParser.parseBuffer(buffer);
  });
}

/**
 * Extract text from a DOCX buffer using mammoth.
 */
async function extractFromDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return cleanText(result.value);
}

/**
 * Clean and normalize extracted text.
 */
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")         // Normalize line endings
    .replace(/\t/g, " ")             // Replace tabs with spaces
    .replace(/ {3,}/g, "  ")         // Collapse excessive spaces
    .replace(/\n{4,}/g, "\n\n\n")    // Collapse excessive newlines
    .trim();
}

/**
 * Guess content type from URL extension.
 */
function guessContentType(url: string): string {
  const lower = url.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (lower.endsWith(".doc")) return "application/msword";
  return "application/octet-stream";
}
