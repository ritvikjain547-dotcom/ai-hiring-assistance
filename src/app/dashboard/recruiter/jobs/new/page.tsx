'use client';

import { useState } from "react";
import { createJob } from "@/actions/jobs";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await createJob(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Post a New Job</h1>
        <p className="page-subtitle">
          Fill in the details to create a new job posting
        </p>
      </div>

      <div className="card" style={{ maxWidth: "800px" }}>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: "var(--space-5)" }}>
            {error}
          </div>
        )}

        <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="job-title">
                Job Title *
              </label>
              <input
                id="job-title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="job-company">
                Company Name *
              </label>
              <input
                id="job-company"
                name="company"
                type="text"
                className="form-input"
                placeholder="e.g. Acme Inc."
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="job-description">
              Job Description *
            </label>
            <textarea
              id="job-description"
              name="description"
              className="form-input form-textarea"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              required
              rows={6}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="job-location">
                Location *
              </label>
              <div style={{ position: "relative" }}>
                <MapPin
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  id="job-location"
                  name="location"
                  type="text"
                  className="form-input"
                  placeholder="e.g. San Francisco, CA"
                  required
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="job-location-type">
                Location Type
              </label>
              <select
                id="job-location-type"
                name="locationType"
                className="form-input form-select"
              >
                <option value="REMOTE">Remote</option>
                <option value="ONSITE">On-site</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="job-employment-type">
                Employment Type
              </label>
              <select
                id="job-employment-type"
                name="employmentType"
                className="form-input form-select"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="job-experience">
                Experience Level
              </label>
              <input
                id="job-experience"
                name="experienceLevel"
                type="text"
                className="form-input"
                placeholder="e.g. 2+ years"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="job-skills">
              Required Skills
            </label>
            <input
              id="job-skills"
              name="requiredSkills"
              type="text"
              className="form-input"
              placeholder="e.g. React, TypeScript, Node.js (comma separated)"
            />
            <span className="form-helper">
              Enter skills separated by commas
            </span>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="job-salary-min">
                Salary Min (USD)
              </label>
              <div style={{ position: "relative" }}>
                <DollarSign
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  id="job-salary-min"
                  name="salaryMin"
                  type="number"
                  className="form-input"
                  placeholder="60000"
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="job-salary-max">
                Salary Max (USD)
              </label>
              <div style={{ position: "relative" }}>
                <DollarSign
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  id="job-salary-max"
                  name="salaryMax"
                  type="number"
                  className="form-input"
                  placeholder="120000"
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="job-deadline">
              Application Deadline
            </label>
            <div style={{ position: "relative" }}>
              <Calendar
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              />
              <input
                id="job-deadline"
                name="deadline"
                type="date"
                className="form-input"
                style={{ paddingLeft: "38px" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-3)", paddingTop: "var(--space-4)" }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              id="create-job-submit"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  Publishing...
                </>
              ) : (
                <>
                  <Briefcase size={18} />
                  Publish Job
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
