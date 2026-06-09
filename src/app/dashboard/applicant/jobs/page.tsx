import { getAllJobs } from "@/actions/jobs";
import Link from "next/link";
import {
  Search,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Briefcase,
} from "lucide-react";

export default async function ApplicantJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; locationType?: string; employmentType?: string }>;
}) {
  const params = await searchParams;
  const jobs = await getAllJobs(
    params.search,
    params.locationType,
    params.employmentType
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Browse Jobs</h1>
        <p className="page-subtitle">
          Find your next opportunity from {jobs.length} open positions
        </p>
      </div>

      {/* Filters */}
      <form className="filters-bar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            name="search"
            type="text"
            className="search-input"
            placeholder="Search jobs by title, company, or keyword..."
            defaultValue={params.search || ""}
          />
        </div>

        <select
          name="locationType"
          className="filter-select"
          defaultValue={params.locationType || "ALL"}
        >
          <option value="ALL">All Locations</option>
          <option value="REMOTE">Remote</option>
          <option value="ONSITE">On-site</option>
          <option value="HYBRID">Hybrid</option>
        </select>

        <select
          name="employmentType"
          className="filter-select"
          defaultValue={params.employmentType || "ALL"}
        >
          <option value="ALL">All Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>

        <button type="submit" className="btn btn-primary btn-sm">
          <Search size={14} />
          Search
        </button>
      </form>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Briefcase size={32} />
            </div>
            <div className="empty-state-title">No jobs found</div>
            <div className="empty-state-description">
              Try adjusting your search filters or check back later for new
              opportunities.
            </div>
          </div>
        </div>
      ) : (
        <div className="grid-cards">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/applicant/jobs/${job.id}`}
              className="job-card"
            >
              <div className="job-card-header">
                <div>
                  <div className="job-card-company">{job.company}</div>
                  <div className="job-card-title">{job.title}</div>
                </div>
                <span className="badge badge-success">
                  {job.locationType}
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
                {job.experienceLevel && (
                  <div className="job-card-meta-item">
                    <Briefcase size={14} />
                    {job.experienceLevel}
                  </div>
                )}
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
                  {job.requiredSkills.split(",").length > 4 && (
                    <span className="tag" style={{ opacity: 0.6 }}>
                      +{job.requiredSkills.split(",").length - 4} more
                    </span>
                  )}
                </div>
              )}

              <div className="job-card-footer">
                {job.salaryMin && job.salaryMax ? (
                  <span className="job-card-salary">
                    <DollarSign size={14} style={{ display: "inline" }} />
                    {job.salaryMin.toLocaleString()} - $
                    {job.salaryMax.toLocaleString()}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    Salary not disclosed
                  </span>
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
