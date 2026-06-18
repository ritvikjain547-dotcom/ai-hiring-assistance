import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { reAnalyzeApplication } from "@/actions/applications";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RECRUITER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID required" }, { status: 400 });
    }

    const result = await reAnalyzeApplication(applicationId);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Re-analysis failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
