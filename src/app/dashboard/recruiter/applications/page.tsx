import { getRecruiterApplications } from "@/actions/applications";
import Link from "next/link";
import { Users, Download } from "lucide-react";
import { StatusUpdateButton } from "../jobs/[id]/StatusUpdateButton";
import PhotoViewer from "@/components/PhotoViewer";

export default async function RecruiterApplicationsPage() {
  const applications = await getRecruiterApplications();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">All Applications</h1>
        <p className="page-subtitle">
          Review and manage all candidate applications across your jobs
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users size={32} />
            </div>
            <div className="empty-state-title">No applications yet</div>
            <div className="empty-state-description">
              Applications will appear here when candidates apply to your jobs.
            </div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Resume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <PhotoViewer
                        src={app.applicant.profile?.profilePhotoUrl || ""}
                        alt={app.applicant.name}
                        fallbackInitial={app.applicant.name.charAt(0).toUpperCase()}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {app.applicant.name}
                        </div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                          {app.applicant.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{app.job.title}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                      {app.job.company}
                    </div>
                  </td>
                  <td>
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      {new Date(app.appliedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td>
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
                  </td>
                  <td>
                    {app.resumeUrl ? (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        className="btn btn-ghost btn-sm"
                      >
                        <Download size={14} />
                      </a>
                    ) : (
                      <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}>
                        No resume
                      </span>
                    )}
                  </td>
                  <td>
                    <StatusUpdateButton
                      applicationId={app.id}
                      currentStatus={app.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
