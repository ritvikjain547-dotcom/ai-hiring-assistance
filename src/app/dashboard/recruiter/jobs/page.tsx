import { getRecruiterJobs } from "@/actions/jobs";
import Link from "next/link";
import {
  Plus,
  Briefcase,
  MapPin,
  Users,
  Clock,
} from "lucide-react";

export default async function RecruiterJobsPage(props: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusFilter = searchParams.status;

  let jobs = await getRecruiterJobs();
  if (statusFilter) {
    jobs = jobs.filter((j) => j.status === statusFilter);
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 className="page-title">My Jobs {statusFilter && `- ${statusFilter}`}</h1>
          <p className="page-subtitle">Manage your job postings</p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          {statusFilter && (
            <Link href="/dashboard/recruiter/jobs" className="btn btn-secondary">
              Clear Filter
            </Link>
          )}
          <Link href="/dashboard/recruiter/jobs/new" className="btn btn-primary">
            <Plus size={18} />
            Post New Job
          </Link>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Briefcase size={32} />
            </div>
            <div className="empty-state-title">No jobs posted yet</div>
            <div className="empty-state-description">
              Create your first job posting to start receiving applications from
              talented candidates.
            </div>
            <Link href="/dashboard/recruiter/jobs/new" className="btn btn-primary">
              <Plus size={16} />
              Create Your First Job
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid-cards">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/recruiter/jobs/${job.id}`}
              className="job-card"
            >
              <div className="job-card-header">
                <div>
                  <div className="job-card-company">{job.company}</div>
                  <div className="job-card-title">{job.title}</div>
                </div>
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
              </div>

              <div className="job-card-meta">
                <div className="job-card-meta-item">
                  <MapPin size={14} />
                  {job.location}
                </div>
                <div className="job-card-meta-item">
                  <Clock size={14} />
                  {job.employmentType.replace("_", " ")}
                </div>
                <div className="job-card-meta-item">
                  <Users size={14} />
                  {job._count.applications} applicants
                </div>
              </div>

              {job.requiredSkills && (
                <div className="job-card-skills">
                  {job.requiredSkills
                    .split(",")
                    .slice(0, 4)
                    .map((skill: string, i: number) => (
                      <span key={i} className="tag">
                        {skill.trim()}
                      </span>
                    ))}
                </div>
              )}

              <div className="job-card-footer">
                {job.salaryMin && job.salaryMax ? (
                  <span className="job-card-salary">
                    ${job.salaryMin.toLocaleString()} - $
                    {job.salaryMax.toLocaleString()}
                  </span>
                ) : (
                  <span className="job-card-salary">Salary not specified</span>
                )}
                <span className="job-card-date">
                  {new Date(job.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
