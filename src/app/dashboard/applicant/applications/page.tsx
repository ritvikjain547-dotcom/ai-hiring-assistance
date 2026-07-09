import { getMyApplications } from "@/actions/applications";
import Link from "next/link";
import {
  FileText,
  ExternalLink,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Briefcase,
  Filter,
} from "lucide-react";
import { InterviewTimeline } from "@/components/InterviewTimeline";

const STATUS_FILTERS = [
  { value: "", label: "All", icon: <Filter size={14} />, color: "#818cf8" },
  { value: "PENDING", label: "Pending", icon: <Clock size={14} />, color: "#f59e0b" },
  { value: "REVIEWING", label: "Under Review", icon: <AlertCircle size={14} />, color: "#60a5fa" },
  { value: "SHORTLISTED", label: "Shortlisted", icon: <ThumbsUp size={14} />, color: "#ea580c" },
  { value: "REJECTED", label: "Rejected", icon: <XCircle size={14} />, color: "#f87171" },
  { value: "HIRED", label: "Hired", icon: <CheckCircle2 size={14} />, color: "#ea580c" },
];

function getStatusConfig(status: string) {
  switch (status) {
    case "PENDING":
      return { badge: "badge-warning", icon: <Clock size={14} />, label: "Pending Review", color: "#f59e0b" };
    case "REVIEWING":
      return { badge: "badge-info", icon: <AlertCircle size={14} />, label: "Under Review", color: "#60a5fa" };
    case "SHORTLISTED":
      return { badge: "badge-success", icon: <ThumbsUp size={14} />, label: "Shortlisted", color: "#ea580c" };
    case "REJECTED":
      return { badge: "badge-danger", icon: <XCircle size={14} />, label: "Rejected", color: "#f87171" };
    case "HIRED":
      return { badge: "badge-success", icon: <CheckCircle2 size={14} />, label: "Hired! 🎉", color: "#ea580c" };
    default:
      return { badge: "badge-neutral", icon: <Clock size={14} />, label: status, color: "#9ca3af" };
  }
}

export default async function MyApplicationsPage(props: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusFilter = searchParams.status;

  let applications = await getMyApplications();

  // Compute stats before filtering so the top stats cards still show global metrics
  const totalApps = applications.length;
  const activeApps = applications.filter((a) => ["PENDING", "REVIEWING", "SHORTLISTED"].includes(a.status)).length;
  const hiredApps = applications.filter((a) => a.status === "HIRED").length;
  const rejectedApps = applications.filter((a) => a.status === "REJECTED").length;

  if (statusFilter) {
    applications = applications.filter((a) => a.status === statusFilter);
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            My Applications
          </h1>
          <p className="page-subtitle">
            Track all your job applications and interview progress in one place
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "var(--space-5)",
        padding: "12px 16px",
        background: "var(--color-bg-secondary, rgba(255,255,255,0.03))",
        borderRadius: "12px",
        border: "1px solid var(--color-border, rgba(255,255,255,0.08))",
      }}>
        {STATUS_FILTERS.map((filter) => {
          const isActive = (statusFilter || "") === filter.value;
          return (
            <Link
              key={filter.value}
              href={filter.value ? `/dashboard/applicant/applications?status=${filter.value}` : "/dashboard/applicant/applications"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 500,
                textDecoration: "none",
                transition: "all 0.2s ease",
                background: isActive ? `${filter.color}20` : "transparent",
                color: isActive ? filter.color : "var(--color-text-muted, #9ca3af)",
                border: isActive ? `1.5px solid ${filter.color}50` : "1.5px solid transparent",
                cursor: "pointer",
              }}
            >
              {filter.icon}
              {filter.label}
            </Link>
          );
        })}
      </div>

      {/* Stats Overview */}
      {totalApps > 0 && (
        <div className="app-stats-grid">
          <div className="app-stat-card">
            <div className="app-stat-icon" style={{ background: "rgba(99, 102, 241, 0.12)", color: "#818cf8" }}>
              <Briefcase size={20} />
            </div>
            <div>
              <div className="app-stat-value">{totalApps}</div>
              <div className="app-stat-label">Total Applications</div>
            </div>
          </div>
          <div className="app-stat-card">
            <div className="app-stat-icon" style={{ background: "rgba(96, 165, 250, 0.12)", color: "#60a5fa" }}>
              <Clock size={20} />
            </div>
            <div>
              <div className="app-stat-value">{activeApps}</div>
              <div className="app-stat-label">Active</div>
            </div>
          </div>
          <div className="app-stat-card">
            <div className="app-stat-icon" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#ea580c" }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="app-stat-value">{hiredApps}</div>
              <div className="app-stat-label">Hired</div>
            </div>
          </div>
          <div className="app-stat-card">
            <div className="app-stat-icon" style={{ background: "rgba(248, 113, 113, 0.12)", color: "#f87171" }}>
              <XCircle size={20} />
            </div>
            <div>
              <div className="app-stat-value">{rejectedApps}</div>
              <div className="app-stat-label">Rejected</div>
            </div>
          </div>
        </div>
      )}

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
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {applications.map((app) => {
            const statusConfig = getStatusConfig(app.status);
            const rounds = app.interviewRounds || [];
            const hasRounds = rounds.length > 0;
            const passedRounds = rounds.filter((r: any) => r.status === "PASSED").length;

            return (
              <div
                key={app.id}
                className="application-detail-card"
                style={{
                  borderLeft: `3px solid ${statusConfig.color}`,
                }}
              >
                {/* Card Header */}
                <div className="app-card-header">
                  <div className="app-card-header-left">
                    <div className="app-card-company-row">
                      <Building2 size={14} style={{ color: "var(--color-text-accent)" }} />
                      <span className="app-card-company">{app.job.company}</span>
                    </div>
                    <h3 className="app-card-title">{app.job.title}</h3>
                    <div className="app-card-meta">
                      <span className="app-card-meta-item">
                        <MapPin size={12} />
                        {app.job.location}
                      </span>
                      <span className="app-card-meta-item">
                        <Calendar size={12} />
                        Applied {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {app.job.recruiter?.name && (
                        <span className="app-card-meta-item">
                          Posted by {app.job.recruiter.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="app-card-header-right">
                    <div className={`app-status-pill ${statusConfig.badge}`}>
                      {statusConfig.icon}
                      <span>{statusConfig.label}</span>
                    </div>
                    <Link
                      href={`/dashboard/applicant/jobs/${app.jobId}`}
                      className="btn btn-ghost btn-sm"
                    >
                      <ExternalLink size={14} />
                      View Job
                    </Link>
                  </div>
                </div>

                {/* Interview Rounds Progress */}
                {hasRounds && (
                  <InterviewTimeline
                    rounds={rounds as any}
                    currentRound={app.currentRound || 0}
                    totalRounds={app.totalRounds || rounds.length}
                  />
                )}

                {/* Rounds summary if no detailed rounds but totalRounds is set */}
                {!hasRounds && (app.totalRounds || 0) > 0 && (
                  <div className="app-rounds-summary">
                    <Clock size={14} style={{ color: "var(--color-text-muted)" }} />
                    <span>
                      This position has {app.totalRounds} interview round{(app.totalRounds || 0) > 1 ? "s" : ""}.
                      Rounds will appear here as you progress.
                    </span>
                  </div>
                )}

                {/* Decision Section — Rejection Reason or Approval Notes */}
                {app.status === "REJECTED" && app.rejectionReason && (
                  <div className="app-decision-card app-decision-rejected">
                    <div className="app-decision-header">
                      <ThumbsDown size={14} />
                      <span>Rejection Feedback</span>
                    </div>
                    <p className="app-decision-text">{app.rejectionReason}</p>
                  </div>
                )}

                {app.status === "HIRED" && (
                  <div className="app-decision-card" style={{ background: 'var(--color-bg-hired, rgba(16, 185, 129, 0.1))', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                    <div className="app-decision-header" style={{ color: '#c2410c' }}>
                      <span>🏆 Congratulations, you have been hired!</span>
                    </div>
                    <p className="app-decision-text" style={{ marginBottom: '16px' }}>
                      We are excited to offer you the position of {app.job.title} at {app.job.company}. Please download and review your formal offer letter.
                    </p>
                    <a 
                      href={`/api/offer-letter/${app.id}`}
                      className="btn btn-primary btn-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Offer Letter (PDF)
                    </a>
                  </div>
                )}

                {app.status === "HIRED" && app.approvalNotes && (
                  <div className="app-decision-card app-decision-hired">
                    <div className="app-decision-header">
                      <ThumbsUp size={14} />
                      <span>Hiring Notes</span>
                    </div>
                    <p className="app-decision-text">{app.approvalNotes}</p>
                  </div>
                )}

                {/* Recruiter General Feedback */}
                {app.recruiterFeedback && (
                  <div className="app-feedback-card">
                    <div className="app-feedback-header">
                      <MessageSquare size={14} />
                      <span>Recruiter Feedback</span>
                    </div>
                    <p className="app-feedback-text">{app.recruiterFeedback}</p>
                  </div>
                )}

                {/* Cover Letter (collapsed) */}
                {app.coverLetter && (
                  <div className="app-cover-letter">
                    <span className="app-cover-letter-label">Cover Letter</span>
                    <p className="app-cover-letter-text">
                      {app.coverLetter.length > 200
                        ? app.coverLetter.substring(0, 200) + "..."
                        : app.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

