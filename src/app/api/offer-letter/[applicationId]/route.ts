import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOfferLetterPDF } from "@/lib/offerLetterGenerator";

export async function GET(
  request: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { applicationId } = await params;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        applicant: { select: { name: true, email: true } },
      },
    });

    if (!application) {
      return new NextResponse("Application not found", { status: 404 });
    }

    // Only the applicant who applied can view their offer letter
    // OR the recruiter who posted the job
    const isApplicant = application.applicantId === session.user.id;
    const isRecruiter = application.job.recruiterId === session.user.id;

    if (!isApplicant && !isRecruiter) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (application.status !== "HIRED") {
      return new NextResponse("Offer letter not available. Candidate not yet hired.", { status: 400 });
    }

    // Generate the PDF
    const pdfBuffer = await generateOfferLetterPDF({
      candidateName: application.applicant.name || "Candidate",
      jobTitle: application.job.title,
      company: application.job.company,
      salaryMin: application.job.salaryMin,
      salaryMax: application.job.salaryMax,
      salaryCurrency: application.job.salaryCurrency,
      employmentType: application.job.employmentType,
      location: application.job.location,
      locationType: application.job.locationType,
      totalRoundsCleared: application.totalRounds || undefined,
    });

    // Return the PDF as a downloadable file
    const fileName = `Offer_Letter_${application.job.company.replace(/\s+/g, "_")}_${application.job.title.replace(/\s+/g, "_")}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error generating offer letter:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
