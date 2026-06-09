import { getMyApplications } from "@/actions/applications";
import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";

export default async function MyApplicationsPage() {
  const applications = await getMyApplications();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">
          Track all your job applications in one place
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <FileText size={32} />
            </div>
            <div className="empty-state-title">No applications yet</div>
            <div className="empty-state-description">
              Start browsing jobs and submit your first application.
            </div>
            <Link href="/dashboard/applicant/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {applications.map((app) => (
            <div key={app.id} className="card card-hover" style={{ padding: "var(--space-5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-lg)",
                    background: "rgba(99, 102, 241, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#818cf8",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={22} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-1)" }}>
                    <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700 }}>
                      {app.job.title}
                    </h3>
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
                  </div>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                    {app.job.company} • {app.job.location}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                    Applied {new Date(app.appliedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <Link
                  href={`/dashboard/applicant/jobs/${app.jobId}`}
                  className="btn btn-ghost btn-sm"
                >
                  <ExternalLink size={14} />
                  View Job
                </Link>
              </div>

              {app.coverLetter && (
                <div
                  style={{
                    marginTop: "var(--space-4)",
                    paddingTop: "var(--space-4)",
                    borderTop: "1px solid var(--color-border)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: "var(--leading-relaxed)",
                  }}
                >
                  <span style={{ fontWeight: 600, marginBottom: "var(--space-2)", display: "block", color: "var(--color-text-primary)" }}>
                    Cover Letter
                  </span>
                  {app.coverLetter.length > 200
                    ? app.coverLetter.substring(0, 200) + "..."
                    : app.coverLetter}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
