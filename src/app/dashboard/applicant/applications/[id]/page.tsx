import { getApplicationByIdForApplicant } from "@/actions/applications";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
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
  ExternalLink,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import { InterviewTimeline } from "@/components/InterviewTimeline";

function getStatusConfig(status: string) {
  switch (status) {
    case "PENDING":
      return { badge: "badge-warning", icon: <Clock size={14} />, label: "Pending Review", color: "#f59e0b" };
    case "REVIEWING":
      return { badge: "badge-info", icon: <AlertCircle size={14} />, label: "Under Review", color: "#60a5fa" };
    case "SHORTLISTED":
      return { badge: "badge-success", icon: <ThumbsUp size={14} />, label: "Shortlisted", color: "#34d399" };
    case "REJECTED":
      return { badge: "badge-danger", icon: <XCircle size={14} />, label: "Rejected", color: "#f87171" };
    case "HIRED":
      return { badge: "badge-success", icon: <CheckCircle2 size={14} />, label: "Hired! 🎉", color: "#34d399" };
    default:
      return { badge: "badge-neutral", icon: <Clock size={14} />, label: status, color: "#9ca3af" };
  }
}

export default async function ApplicantApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getApplicationByIdForApplicant(id);

  if (!application) {
    notFound();
  }

  const statusConfig = getStatusConfig(application.status);
  const rounds = application.interviewRounds || [];
  const hasRounds = rounds.length > 0;

  return (
    <div className="animate-fade-in">
      <Link href="/dashboard/applicant" className="btn btn-ghost btn-sm" style={{ marginBottom: "var(--space-4)" }}>
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="page-header">
        <h1 className="page-title">Application Details</h1>
        <p className="page-subtitle">
          Track your progress for the {application.job.title} role
        </p>
      </div>

      <div
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
              <span className="app-card-company">{application.job.company}</span>
            </div>
            <h3 className="app-card-title">{application.job.title}</h3>
            <div className="app-card-meta">
              <span className="app-card-meta-item">
                <MapPin size={12} />
                {application.job.location}
              </span>
              <span className="app-card-meta-item">
                <Calendar size={12} />
                Applied {new Date(application.appliedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {application.job.recruiter?.name && (
                <span className="app-card-meta-item">
                  Posted by {application.job.recruiter.name}
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
              href={`/dashboard/applicant/jobs/${application.jobId}`}
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
            currentRound={application.currentRound || 0}
            totalRounds={application.totalRounds || rounds.length}
          />
        )}

        {/* Rounds summary if no detailed rounds but totalRounds is set */}
        {!hasRounds && (application.totalRounds || 0) > 0 && (
          <div className="app-rounds-summary">
            <Clock size={14} style={{ color: "var(--color-text-muted)" }} />
            <span>
              This position has {application.totalRounds} interview round{(application.totalRounds || 0) > 1 ? "s" : ""}.
              Rounds will appear here as you progress.
            </span>
          </div>
        )}

        {/* Decision Section */}
        {application.status === "REJECTED" && application.rejectionReason && (
          <div className="app-decision-card app-decision-rejected">
            <div className="app-decision-header">
              <ThumbsDown size={14} />
              <span>Feedback from Recruiter</span>
            </div>
            <p className="app-decision-text">{application.rejectionReason}</p>
          </div>
        )}

        {application.status === "HIRED" && (
          <div className="app-decision-card" style={{ background: 'var(--color-bg-hired, rgba(16, 185, 129, 0.1))', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <div className="app-decision-header" style={{ color: '#059669' }}>
              <Trophy size={14} />
              <span>Congratulations, you have been hired!</span>
            </div>
            <p className="app-decision-text" style={{ marginBottom: '16px' }}>
              We are excited to offer you the position of {application.job.title} at {application.job.company}. Please download and review your formal offer letter.
            </p>
            <a 
              href={`/api/offer-letter/${application.id}`}
              className="btn btn-primary btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Offer Letter (PDF)
            </a>
          </div>
        )}

        {application.status === "HIRED" && application.approvalNotes && (
          <div className="app-decision-card app-decision-hired">
            <div className="app-decision-header">
              <ThumbsUp size={14} />
              <span>Hiring Notes</span>
            </div>
            <p className="app-decision-text">{application.approvalNotes}</p>
          </div>
        )}

        {/* Recruiter General Feedback */}
        {application.recruiterFeedback && (
          <div className="app-feedback-card">
            <div className="app-feedback-header">
              <MessageSquare size={14} />
              <span>Recruiter Feedback</span>
            </div>
            <p className="app-feedback-text">{application.recruiterFeedback}</p>
          </div>
        )}

        {/* AI Analysis Summary (if available) */}
        {application.aiOverallSummary && (
          <div className="app-ai-summary">
            <div className="app-ai-summary-header">
              <span>🤖 AI Analysis</span>
            </div>
            <p className="app-ai-summary-text">{application.aiOverallSummary}</p>
          </div>
        )}

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="app-cover-letter">
            <span className="app-cover-letter-label">Cover Letter</span>
            <p className="app-cover-letter-text">
              {application.coverLetter}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
