import { getJobById } from "@/actions/jobs";
import { updateApplicationStatus } from "@/actions/applications";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Briefcase,
  ArrowLeft,
  Building2,
  ExternalLink,
  Download,
} from "lucide-react";
import { DeleteJobButton } from "./DeleteJobButton";
import { StatusUpdateButton } from "./StatusUpdateButton";
import PhotoViewer from "@/components/PhotoViewer";

export default async function RecruiterJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return null;

  const job = await getJobById(id);
  if (!job || job.recruiterId !== session.user.id) notFound();

  const skills = job.requiredSkills
    ? job.requiredSkills.split(",").map((s: string) => s.trim())
    : [];

  return (
    <div className="animate-fade-in">
      <Link
        href="/dashboard/recruiter/jobs"
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: "var(--space-4)" }}
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      {/* Job Header */}
      <div className="job-detail-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                marginBottom: "var(--space-2)",
                color: "var(--color-text-accent)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
              }}
            >
              <Building2 size={14} />
              {job.company}
            </div>
            <h1 className="page-title">{job.title}</h1>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-4)",
                marginTop: "var(--space-4)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <MapPin size={14} /> {job.location}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Clock size={14} /> {job.employmentType.replace("_", " ")}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Briefcase size={14} /> {job.locationType}
              </span>
              {job.salaryMin && job.salaryMax && (
                <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-accent-success)" }}>
                  <DollarSign size={14} /> ${job.salaryMin.toLocaleString()} - $
                  {job.salaryMax.toLocaleString()}
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Users size={14} /> {job._count.applications} applicants
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--space-3)" }}>
            <span
              className={`badge ${
                job.status === "OPEN"
                  ? "badge-success"
                  : job.status === "CLOSED"
                  ? "badge-danger"
                  : "badge-neutral"
              }`}
            >
              {job.status}
            </span>
            <DeleteJobButton jobId={job.id} jobTitle={job.title} />
          </div>
        </div>

        {skills.length > 0 && (
          <div className="tags-container" style={{ marginTop: "var(--space-4)" }}>
            {skills.map((skill: string, i: number) => (
              <span key={i} className="tag">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Job Content */}
      <div className="job-detail-content">
        <div className="job-detail-main">
          <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
            Job Description
          </h2>
          <div
            style={{
              color: "var(--color-text-secondary)",
              lineHeight: "var(--leading-relaxed)",
              whiteSpace: "pre-wrap",
            }}
          >
            {job.description}
          </div>
        </div>

        {/* Applicants Sidebar */}
        <div className="job-detail-sidebar">
          <div className="job-info-card">
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
              Applicants ({job.applications.length})
            </h3>

            {job.applications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)" }}>
                No applications yet
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {job.applications.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      padding: "var(--space-4)",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                      <PhotoViewer
                        src={app.applicant.profile?.profilePhotoUrl || ""}
                        alt={app.applicant.name}
                        fallbackInitial={app.applicant.name.charAt(0).toUpperCase()}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>
                          {app.applicant.name}
                        </div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                          {app.applicant.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                      <span
                        className={`badge ${
                          app.status === "PENDING"
                            ? "badge-warning"
                            : app.status === "SHORTLISTED"
                            ? "badge-success"
                            : app.status === "REJECTED"
                            ? "badge-danger"
                            : app.status === "REVIEWING"
                            ? "badge-info"
                            : app.status === "HIRED"
                            ? "badge-success"
                            : "badge-neutral"
                        }`}
                      >
                        {app.status}
                      </span>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        className="btn btn-ghost btn-sm"
                        style={{ marginBottom: "var(--space-2)", width: "100%" }}
                      >
                        <Download size={14} />
                        Download Resume
                      </a>
                    )}

                    <StatusUpdateButton
                      applicationId={app.id}
                      currentStatus={app.status}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
