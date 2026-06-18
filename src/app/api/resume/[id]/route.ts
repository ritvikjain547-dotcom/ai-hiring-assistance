import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    console.log("[Resume API] Session:", session?.user?.email || "NO SESSION");

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized — please log in" }, { status: 401 });
    }

    const { id } = await params;
    console.log("[Resume API] Fetching application:", id);

    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: { select: { recruiterId: true } } },
    });

    if (!application || !application.resumeUrl) {
      console.log("[Resume API] Application not found or no resume URL");
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Only the applicant or the job's recruiter can view the resume
    const isOwner = application.applicantId === session.user.id;
    const isRecruiter = application.job.recruiterId === session.user.id;
    if (!isOwner && !isRecruiter) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // If it's a base64 data URL, decode and serve the file
    if (application.resumeUrl.startsWith("data:")) {
      const matches = application.resumeUrl.match(
        /^data:(.+);base64,(.+)$/
      );
      if (!matches) {
        return NextResponse.json({ error: "Invalid resume data" }, { status: 500 });
      }

      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      const ext = contentType.includes("pdf")
        ? "pdf"
        : contentType.includes("msword")
        ? "doc"
        : "docx";

      console.log(`[Resume API] Serving base64 resume as ${ext} (${buffer.length} bytes)`);

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="resume.${ext}"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }

    // Otherwise redirect to the external URL (Supabase or local)
    return NextResponse.redirect(application.resumeUrl);
  } catch (error) {
    console.error("[Resume API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

