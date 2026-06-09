import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  if (role === "RECRUITER") {
    redirect("/dashboard/recruiter");
  } else {
    redirect("/dashboard/applicant");
  }
}
