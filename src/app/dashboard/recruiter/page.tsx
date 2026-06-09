import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Briefcase, Users, UserCheck, Clock, Plus, ArrowRight } from "lucide-react";

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
      <div className="grid-stats" style={{ marginBottom: "var(--space-8)" }}>
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card ${stat.color}`}>
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
