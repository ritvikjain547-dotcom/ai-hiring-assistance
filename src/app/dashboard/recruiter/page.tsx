import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Briefcase, Users, UserCheck, Clock, Plus, ArrowRight, Brain, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default async function RecruiterDashboard() {
  const session = await auth();
  if (!session?.user) return null;

  const [jobsCount, applicationsCount, shortlistedCount, recentApps] =
    await Promise.all([
      prisma.job.count({ where: { recruiterId: session.user.id } }),
      prisma.application.count({
        where: { job: { recruiterId: session.user.id } },
      }),
      prisma.application.count({
        where: {
          job: { recruiterId: session.user.id },
          status: "SHORTLISTED",
        },
      }),
      prisma.application.findMany({
        where: { job: { recruiterId: session.user.id } },
        include: {
          job: { select: { title: true, company: true } },
          applicant: { select: { name: true, email: true } },
        },
        orderBy: { appliedAt: "desc" },
        take: 5,
      }),
    ]);

  const openJobs = await prisma.job.count({
    where: { recruiterId: session.user.id, status: "OPEN" },
  });

  // AI Classification counts
  const [aiScreenedCount, matchingCount, nearBoundCount, notMatchingCount] =
    await Promise.all([
      prisma.application.count({
        where: { job: { recruiterId: session.user.id }, aiScore: { not: null } },
      }),
      prisma.application.count({
        where: { job: { recruiterId: session.user.id }, aiClassification: "MATCHING" },
      }),
      prisma.application.count({
        where: { job: { recruiterId: session.user.id }, aiClassification: "NEAR_BOUND" },
      }),
      prisma.application.count({
        where: { job: { recruiterId: session.user.id }, aiClassification: "NOT_MATCHING" },
      }),
    ]);

  const stats = [
    {
      label: "Total Jobs",
      value: jobsCount,
      icon: <Briefcase size={22} />,
      color: "purple",
    },
    {
      label: "Open Positions",
      value: openJobs,
      icon: <Clock size={22} />,
      color: "cyan",
    },
    {
      label: "Total Applications",
      value: applicationsCount,
      icon: <Users size={22} />,
      color: "amber",
    },
    {
      label: "Shortlisted",
      value: shortlistedCount,
      icon: <UserCheck size={22} />,
      color: "emerald",
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 className="page-title">
            Welcome back, {session.user.name?.split(" ")[0]} 👋
          </h1>
          <p className="page-subtitle">
            Here&apos;s an overview of your recruitment activity
          </p>
        </div>
        <Link href="/dashboard/recruiter/jobs/new" className="btn btn-primary">
          <Plus size={18} />
          Post New Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid-stats" style={{ marginBottom: "var(--space-6)" }}>
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card ${stat.color}`}>
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* AI Screening Overview */}
      {aiScreenedCount > 0 && (
        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-5)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div className="ai-icon-wrapper" style={{ width: 36, height: 36 }}>
                <Brain size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>AI Screening Overview</h2>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                  {aiScreenedCount} of {applicationsCount} applications analyzed
                </p>
              </div>
            </div>
            <Link href="/dashboard/recruiter/applications" className="btn btn-ghost btn-sm">
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="ai-classification-stats">
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
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--space-6)",
          }}
        >
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>
            Recent Applications
          </h2>
          <Link href="/dashboard/recruiter/applications" className="btn btn-ghost btn-sm">
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="empty-state" style={{ padding: "var(--space-10)" }}>
            <div className="empty-state-icon">
              <Users size={32} />
            </div>
            <div className="empty-state-title">No applications yet</div>
            <div className="empty-state-description">
              Once candidates apply to your jobs, they&apos;ll appear here.
            </div>
            <Link href="/dashboard/recruiter/jobs/new" className="btn btn-primary">
              <Plus size={16} />
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {recentApps.map((app) => (
              <div key={app.id} className="application-card">
                <div className="avatar">
                  {app.applicant.name.charAt(0).toUpperCase()}
                </div>
                <div className="application-info">
                  <div className="application-job-title">
                    {app.applicant.name}
                  </div>
                  <div className="application-company">
                    Applied for {app.job.title} at {app.job.company}
                  </div>
                  <div className="application-date">
                    {new Date(app.appliedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  {(app as any).aiClassification && (app as any).aiClassification !== "PENDING_REVIEW" && (
                    <span
                      className={`badge ${
                        (app as any).aiClassification === "MATCHING"
                          ? "ai-badge-matching"
                          : (app as any).aiClassification === "NEAR_BOUND"
                          ? "ai-badge-near"
                          : "ai-badge-not-matching"
                      }`}
                      style={{ fontSize: "10px" }}
                    >
                      {(app as any).aiClassification === "MATCHING" ? "✅" : (app as any).aiClassification === "NEAR_BOUND" ? "🔶" : "❌"}
                    </span>
                  )}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
