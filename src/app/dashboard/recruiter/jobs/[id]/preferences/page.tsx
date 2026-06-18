import { auth } from "@/lib/auth";
import { getJobById } from "@/actions/jobs";
import { getRecruiterPreference } from "@/actions/preferences";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Brain } from "lucide-react";
import { PreferenceForm } from "./PreferenceForm";

export default async function RecruiterPreferencesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return null;

  const job = await getJobById(id);
  if (!job || job.recruiterId !== session.user.id) notFound();

  const existingPrefs = await getRecruiterPreference(id);

  return (
    <div className="animate-fade-in">
      <Link
        href={`/dashboard/recruiter/jobs/${id}`}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: "var(--space-4)" }}
      >
        <ArrowLeft size={16} />
        Back to Job
      </Link>

      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div className="ai-icon-wrapper">
            <Brain size={24} />
          </div>
          <div>
            <h1 className="page-title">AI Screening Preferences</h1>
            <p className="page-subtitle">
              Configure how AI evaluates candidates for <strong>{job.title}</strong> at{" "}
              <strong>{job.company}</strong>
            </p>
          </div>
        </div>
      </div>

      <PreferenceForm
        jobId={id}
        jobSkills={job.requiredSkills || ""}
        existingPrefs={existingPrefs}
      />
    </div>
  );
}
