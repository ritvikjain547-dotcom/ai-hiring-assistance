import { getJobById } from "@/actions/jobs";
import { hasApplied } from "@/actions/applications";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
  CheckCircle2,
} from "lucide-react";
import ApplyForm from "./ApplyForm";

export default async function ApplicantJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return null;

  const userWithProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  const job = await getJobById(id);
  if (!job) notFound();

  const alreadyApplied = await hasApplied(id);

  const skills = job.requiredSkills
    ? job.requiredSkills.split(",").map((s: string) => s.trim())
    : [];

  return (
    <div className="animate-fade-in">
      <Link
        href="/dashboard/applicant/jobs"
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: "var(--space-4)" }}
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      {/* Job Header */}
      <div className="job-detail-header">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)", color: "var(--color-text-accent)", fontSize: "var(--text-sm)", fontWeight: 500 }}>
          <Building2 size={14} />
          {job.company}
        </div>
        <h1 className="page-title">{job.title}</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", marginTop: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
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
              <DollarSign size={14} /> ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="job-detail-content">
        {/* Main Content */}
        <div className="job-detail-main">
          <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
            Job Description
          </h2>
          <div style={{ color: "var(--color-text-secondary)", lineHeight: "var(--leading-relaxed)", whiteSpace: "pre-wrap" }}>
            {job.description}
          </div>

          {skills.length > 0 && (
            <>
              <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginTop: "var(--space-8)", marginBottom: "var(--space-4)" }}>
                Required Skills
              </h3>
              <div className="tags-container">
                {skills.map((skill: string, i: number) => (
                  <span key={i} className="tag">{skill}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="job-detail-sidebar">
          {/* Job Info */}
          <div className="job-info-card">
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-4)" }}>
              Job Details
            </h3>
            <div className="job-info-row">
              <span className="job-info-label">Posted by</span>
              <span className="job-info-value">{job.recruiter.name}</span>
            </div>
            <div className="job-info-row">
              <span className="job-info-label">Location Type</span>
              <span className="job-info-value">{job.locationType}</span>
            </div>
            <div className="job-info-row">
              <span className="job-info-label">Employment</span>
              <span className="job-info-value">{job.employmentType.replace("_", " ")}</span>
            </div>
            {job.experienceLevel && (
              <div className="job-info-row">
                <span className="job-info-label">Experience</span>
                <span className="job-info-value">{job.experienceLevel}</span>
              </div>
            )}
            {job.deadline && (
              <div className="job-info-row">
                <span className="job-info-label">Deadline</span>
                <span className="job-info-value">
                  {new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            )}
            <div className="job-info-row">
              <span className="job-info-label">Applicants</span>
              <span className="job-info-value">{job._count.applications}</span>
            </div>
          </div>

          {/* Apply Section */}
          <div className="job-info-card">
            {alreadyApplied ? (
              <div style={{ textAlign: "center", padding: "var(--space-4)" }}>
                <CheckCircle2 size={40} style={{ color: "#34d399", margin: "0 auto var(--space-4)" }} />
                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
                  Application Submitted
                </h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                  You have already applied for this position. Good luck!
                </p>
                <Link
                  href="/dashboard/applicant/applications"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: "var(--space-4)" }}
                >
                  View My Applications
                </Link>
              </div>
            ) : (
              <ApplyForm
                jobId={id}
                initialEmail={userWithProfile?.email || ""}
                initialPhone={userWithProfile?.profile?.phone || ""}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
