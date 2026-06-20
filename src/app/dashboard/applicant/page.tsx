import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ArrowRight,
  User,
} from "lucide-react";

export default async function ApplicantDashboard() {
  const session = await auth();
  if (!session?.user) return null;

  const [totalApps, reviewingApps, shortlistedApps, rejectedApps, profile, recentApps] =
    await Promise.all([
      prisma.application.count({ where: { applicantId: session.user.id } }),
      prisma.application.count({
        where: { applicantId: session.user.id, status: "REVIEWING" },
      }),
      prisma.application.count({
        where: { applicantId: session.user.id, status: "SHORTLISTED" },
      }),
      prisma.application.count({
        where: { applicantId: session.user.id, status: "REJECTED" },
      }),
      prisma.profile.findUnique({
        where: { userId: session.user.id },
      }),
      prisma.application.findMany({
        where: { applicantId: session.user.id },
        include: {
          job: {
            include: { recruiter: { select: { name: true } } },
          },
        },
        orderBy: { appliedAt: "desc" },
        take: 5,
      }),
    ]);

  // Calculate profile completeness
  let completeness = 20; // base for having an account
  if (profile?.bio) completeness += 20;
  if (profile?.skills) completeness += 20;
  if (profile?.location) completeness += 15;
  if (profile?.education) completeness += 15;
  if (profile?.experienceYears) completeness += 10;

  const stats = [
    {
      label: "Applications Sent",
      value: totalApps,
      icon: <FileText size={22} />,
      color: "purple",
      href: "/dashboard/applicant/applications",
    },
    {
      label: "Under Review",
      value: reviewingApps,
      icon: <Clock size={22} />,
      color: "cyan",
      href: "/dashboard/applicant/applications?status=REVIEWING",
    },
    {
      label: "Shortlisted",
      value: shortlistedApps,
      icon: <CheckCircle2 size={22} />,
      color: "emerald",
      href: "/dashboard/applicant/applications?status=SHORTLISTED",
    },
    {
      label: "Rejected",
      value: rejectedApps,
      icon: <XCircle size={22} />,
      color: "amber",
      href: "/dashboard/applicant/applications?status=REJECTED",
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
            Track your applications and find new opportunities
          </p>
        </div>
        <Link href="/dashboard/applicant/jobs" className="btn btn-primary">
          <Search size={18} />
          Browse Jobs
        </Link>
      </div>

      {/* Profile Completeness */}
      {completeness < 100 && (
        <div
          className="card"
          style={{
            marginBottom: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "var(--radius-lg)",
              background: "rgba(99, 102, 241, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#818cf8",
              flexShrink: 0,
            }}
          >
            <User size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-1)" }}>
              Complete your profile — {completeness}%
            </div>
            <div className="profile-completeness">
              <div
                className="profile-completeness-bar"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
          <Link href="/dashboard/applicant/profile" className="btn btn-secondary btn-sm">
            Complete Profile
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid-stats" style={{ marginBottom: "var(--space-8)" }}>
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className={`stat-card ${stat.color}`} style={{ textDecoration: "none" }}>
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </Link>
        ))}
      </div>

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
          <Link href="/dashboard/applicant/applications" className="btn btn-ghost btn-sm">
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="empty-state" style={{ padding: "var(--space-10)" }}>
            <div className="empty-state-icon">
              <FileText size={32} />
            </div>
            <div className="empty-state-title">No applications yet</div>
            <div className="empty-state-description">
              Start browsing jobs and applying to kickstart your career journey.
            </div>
            <Link href="/dashboard/applicant/jobs" className="btn btn-primary">
              <Search size={16} />
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {recentApps.map((app) => (
              <Link
                key={app.id}
                href={`/dashboard/applicant/applications/${app.id}`}
                className="application-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-lg)",
                    background: "rgba(99, 102, 241, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#818cf8",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={20} />
                </div>
                <div className="application-info" style={{ flex: 1 }}>
                  <div className="application-job-title" style={{ fontWeight: 600 }}>{app.job.title}</div>
                  <div className="application-company" style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{app.job.company}</div>
                  <div className="application-date" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginTop: 2 }}>
                    Applied{" "}
                    {new Date(app.appliedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
