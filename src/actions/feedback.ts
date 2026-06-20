"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitPlatformFeedback(feedback: string, rating?: number, aiScreeningRating?: number) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.platformFeedback.create({
      data: {
        userId: session.user.id,
        feedback,
        rating,
        aiScreeningRating,
      },
    });

    revalidatePath("/dashboard/recruiter/feedback");
    return { success: true };
  } catch (error) {
    console.error("Error submitting platform feedback:", error);
    return { success: false, error: "Failed to submit feedback." };
  }
}
