import { getJobById } from "@/actions/jobs";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  DollarSign,
  IndianRupee,
  Users,
  Briefcase,
  ArrowLeft,
  Building2,
  Download,
  Brain,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
} from "lucide-react";
import { DeleteJobButton } from "./DeleteJobButton";
import { RoundManager } from "./RoundManager";
import PhotoViewer from "@/components/PhotoViewer";
import { AiScoreBadge } from "../../applications/AiScoreBadge";
import { ExpandableProfileDetails } from "@/components/ExpandableProfileDetails";

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

  // AI classification stats (for visible/non-rejected applications)
  const matchingCount = job.applications.filter((a: any) => a.aiClassification === "MATCHING").length;
  const nearBoundCount = job.applications.filter((a: any) => a.aiClassification === "NEAR_BOUND").length;
  const notMatchingCount = job.applications.filter((a: any) => a.aiClassification === "NOT_MATCHING").length;
  const pendingCount = job.applications.filter(
    (a: any) => a.aiClassification === "PENDING_REVIEW" || !a.aiClassification
  ).length;
  const hasPreference = !!(job as any).preference;

  // Round-based pipeline stats
  const roundStats: { [key: number]: { name: string; count: number } } = {};
  job.applications.forEach((app: any) => {
    const currentRound = app.currentRound || 0;
    const rounds = app.interviewRounds || [];
    // Find which round the candidate is currently in
    const activeRoundNumber = currentRound + 1;
    if (rounds.length > 0) {
      const activeRound = rounds.find((r: any) => r.roundNumber === activeRoundNumber);
      if (activeRound) {
        if (!roundStats[activeRoundNumber]) {
          roundStats[activeRoundNumber] = { name: activeRound.roundName, count: 0 };
        }
        roundStats[activeRoundNumber].count++;
      } else {
        // Candidate has passed all rounds
        const lastRound = rounds[rounds.length - 1];
        const key = rounds.length + 1;
        if (!roundStats[key]) {
          roundStats[key] = { name: "All Rounds Cleared", count: 0 };
        }
        roundStats[key].count++;
      }
    }
  });

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
                  {(job as any).salaryCurrency === "INR" ? <IndianRupee size={14} /> : <DollarSign size={14} />}
                  {(job as any).salaryCurrency === "INR" ? "₹" : "$"}{job.salaryMin.toLocaleString()} - {(job as any).salaryCurrency === "INR" ? "₹" : "$"}
                  {job.salaryMax.toLocaleString()}
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Users size={14} /> {job.applications.length} active applicants
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
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Link
                href={`/dashboard/recruiter/jobs/${id}/preferences`}
                className="btn btn-secondary btn-sm"
              >
                <Settings2 size={14} />
                Edit AI Preferences
              </Link>
              <DeleteJobButton jobId={job.id} jobTitle={job.title} />
            </div>
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

      {/* Pipeline Round Stats */}
      {Object.keys(roundStats).length > 0 && (
        <div className="pipeline-stats" style={{ marginTop: "var(--space-6)" }}>
          <div className="pipeline-stats-header">
            <Filter size={16} />
            <span>Hiring Pipeline</span>
          </div>
          <div className="pipeline-stats-rounds">
            {Object.entries(roundStats)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([roundNum, stat]) => (
                <div key={roundNum} className="pipeline-round-stat">
                  <div className="pipeline-round-count">{stat.count}</div>
                  <div className="pipeline-round-name">{stat.name}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* AI Classification Stats */}
      {job.applications.length > 0 && (
        <div className="ai-classification-stats" style={{ marginTop: "var(--space-6)" }}>
          <div className="ai-class-stat matching">
            <CheckCircle2 size={18} />
            <span className="ai-class-stat-value">{matchingCount}</span>
            <span className="ai-class-stat-label">Matching</span>
          </div>
          <div className="ai-class-stat near">
            <AlertTriangle size={18} />
            <span className="ai-class-stat-value">{nearBoundCount}</span>
            <span className="ai-class-stat-label">Near Bound</span>
          </div>
          <div className="ai-class-stat not-matching">
            <XCircle size={18} />
            <span className="ai-class-stat-value">{notMatchingCount}</span>
            <span className="ai-class-stat-label">Not Matching</span>
          </div>
          <div className="ai-class-stat pending">
            <Brain size={18} />
            <span className="ai-class-stat-value">{pendingCount}</span>
            <span className="ai-class-stat-label">Pending Review</span>
          </div>
        </div>
      )}

      {/* AI Preference Status */}
      {!hasPreference && job.applications.length === 0 && (
        <div className="ai-setup-banner">
          <Brain size={20} />
          <div>
            <strong>Set up AI Screening</strong>
            <p>Configure your hiring preferences so AI can automatically evaluate incoming candidates.</p>
          </div>
          <Link href={`/dashboard/recruiter/jobs/${id}/preferences`} className="btn btn-primary btn-sm">
            Configure Now
          </Link>
        </div>
      )}

      {/* Job Content */}
      <div className="job-detail-content" style={{ marginTop: "var(--space-6)" }}>
        {/* Applicants Main */}
        <div className="job-detail-main">
          <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
            Hiring Pipeline
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 400, marginLeft: "var(--space-2)" }}>
              Rejected candidates are automatically removed
            </span>
          </h2>

          {job.applications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--color-text-tertiary)" }}>
              No active applications.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
              {/* Group applications by round */}
              {(() => {
                const groups: { [key: string]: any[] } = {
                  NEW: [],
                  HIRED: [],
                };
                if (job.totalRounds && job.totalRounds > 0) {
                  for (let r = 1; r <= job.totalRounds; r++) {
                    groups[`ROUND_${r}`] = [];
                  }
                }
                
                job.applications.forEach((app: any) => {
                  if (app.status === "HIRED" || (app.totalRounds > 0 && app.currentRound === app.totalRounds)) {
                    groups.HIRED.push(app);
                  } else if (!app.totalRounds || app.totalRounds === 0) {
                    groups.NEW.push(app);
                  } else {
                    const activeRound = (app.currentRound || 0) + 1;
                    if (!groups[`ROUND_${activeRound}`]) {
                      groups[`ROUND_${activeRound}`] = [];
                    }
                    groups[`ROUND_${activeRound}`].push(app);
                  }
                });

                const groupKeys = Object.keys(groups).filter(k => k.startsWith("ROUND_")).sort((a, b) => {
                  return parseInt(a.replace("ROUND_", "")) - parseInt(b.replace("ROUND_", ""));
                });

                const customRoundNames = job.roundNames ? job.roundNames.split(",").map((s: string) => s.trim()) : [];

                const renderApplicantCard = (app: any) => (
                  <div
                    key={app.id}
                    style={{
                      padding: "var(--space-5)",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                      <PhotoViewer
                        src={app.applicant.profile?.profilePhotoUrl || ""}
                        alt={app.applicant.name}
                        fallbackInitial={app.applicant.name.charAt(0).toUpperCase()}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>
                          {app.applicant.name}
                        </div>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-tertiary)" }}>
                          {app.applicant.email}
                        </div>
                      </div>
                      <AiScoreBadge
                        score={app.aiScore}
                        classification={app.aiClassification}
                        size="md"
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)", flexWrap: "wrap" }}>
                      <span
                        className={`badge ${
                          app.status === "PENDING"
                            ? "badge-warning"
                            : app.status === "SHORTLISTED"
                            ? "badge-success"
                            : app.status === "REVIEWING"
                            ? "badge-info"
                            : app.status === "HIRED"
                            ? "badge-success"
                            : "badge-neutral"
                        }`}
                      >
                        {app.status === "HIRED" ? "✅ HIRED" : app.status}
                      </span>
                      {app.recruiterOverride && (
                        <span className="badge badge-warning" style={{ fontSize: "10px" }}>Override</span>
                      )}
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {app.aiOverallSummary && (
                      <div style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text-secondary)",
                        marginBottom: "var(--space-4)",
                        padding: "var(--space-3)",
                        background: "rgba(99, 102, 241, 0.05)",
                        borderRadius: "var(--radius-md)",
                        lineHeight: "1.6",
                      }}>
                        🤖 {app.aiOverallSummary}
                      </div>
                    )}

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                      {app.resumeUrl && (
                        <a
                          href={`/api/resume/${app.id}`}
                          download
                          className="btn btn-secondary btn-sm"
                        >
                          <Download size={14} />
                          Download Resume
                        </a>
                      )}
                    </div>

                    <RoundManager
                      applicationId={app.id}
                      rounds={app.interviewRounds || []}
                      applicantName={app.applicant.name}
                    />

                    <ExpandableProfileDetails app={app} />
                  </div>
                );

                return (
                  <>
                    {/* New Applications */}
                    {groups.NEW.length > 0 && (
                      <div className="pipeline-stage">
                        <div style={{
                          fontSize: "var(--text-xl)",
                          fontWeight: 800,
                          marginBottom: "var(--space-4)",
                          paddingBottom: "var(--space-2)",
                          borderBottom: "2px solid rgba(99, 102, 241, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--space-2)"
                        }}>
                          <Users size={16} color="#818cf8" />
                          New Applicants ({groups.NEW.length})
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                          {groups.NEW.map(renderApplicantCard)}
                        </div>
                      </div>
                    )}

                    {/* Round Buckets */}
                    {groupKeys.map((key) => {
                      const rNum = parseInt(key.replace("ROUND_", ""));
                      const rName = customRoundNames[rNum - 1] || roundStats[rNum]?.name || "";
                      const isFirstRound = rNum === 1;

                      return (
                        <div key={key} className="pipeline-stage">
                          <div style={{
                            fontSize: "var(--text-xl)",
                            fontWeight: 800,
                            marginBottom: "var(--space-4)",
                            paddingBottom: "var(--space-2)",
                            borderBottom: "2px solid rgba(56, 189, 248, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-3)"
                          }}>
                            <div style={{ 
                              width: "32px", height: "32px", 
                              background: "rgba(56, 189, 248, 0.1)", 
                              color: "#38bdf8", 
                              borderRadius: "50%", 
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "14px", fontWeight: 800 
                            }}>
                              {rNum}
                            </div>
                            <div>
                              {isFirstRound ? (
                                <span>Round 1: {rName || "AI Screening"}</span>
                              ) : (
                                <span>Cleared Round {rNum - 1} → Active in Round {rNum}{rName ? `: ${rName}` : ""}</span>
                              )}
                              <span style={{ fontSize: "var(--text-sm)", fontWeight: 400, color: "var(--color-text-tertiary)", marginLeft: "var(--space-2)" }}>
                                ({groups[key].length})
                              </span>
                            </div>
                          </div>
                          {groups[key].length === 0 ? (
                            <div style={{
                              padding: "var(--space-6)",
                              textAlign: "center",
                              color: "var(--color-text-tertiary)",
                              fontSize: "var(--text-sm)",
                              border: "1px dashed var(--color-border)",
                              borderRadius: "var(--radius-lg)"
                            }}>
                              No candidates currently at this stage.
                            </div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                              {groups[key].map(renderApplicantCard)}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Hired / All Rounds Cleared */}
                    {groups.HIRED.length > 0 && (
                      <div className="pipeline-stage">
                        <div style={{
                          fontSize: "var(--text-xl)",
                          fontWeight: 800,
                          marginBottom: "var(--space-4)",
                          paddingBottom: "var(--space-2)",
                          borderBottom: "2px solid rgba(16, 185, 129, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--space-2)"
                        }}>
                          <CheckCircle2 size={16} color="#10b981" />
                          Hired Candidates (Cleared All Rounds) ({groups.HIRED.length})
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                          {groups.HIRED.map(renderApplicantCard)}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Job Description Sidebar */}
        <div className="job-detail-sidebar">
          <div className="job-info-card">
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
              Job Description
            </h3>
            <div
              style={{
                color: "var(--color-text-secondary)",
                lineHeight: "var(--leading-relaxed)",
                whiteSpace: "pre-wrap",
                fontSize: "var(--text-sm)",
              }}
            >
              {job.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
