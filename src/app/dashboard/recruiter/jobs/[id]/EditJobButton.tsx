'use client';

import { useState, useEffect } from "react";
import { updateJob } from "@/actions/jobs";
import {
  Pencil,
  X,
  Loader2,
  MapPin,
  DollarSign,
  IndianRupee,
  Briefcase,
  Building2,
} from "lucide-react";

type JobData = {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  locationType: string;
  employmentType: string;
  experienceLevel: string | null;
  requiredSkills: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency?: string;
  status: string;
  deadline: string | null;
};

export function EditJobButton({ job }: { job: JobData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-secondary btn-sm"
      >
        <Pencil size={14} />
        Edit Job
      </button>

      {isOpen && (
        <EditJobModal job={job} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

function EditJobModal({ job, onClose }: { job: JobData; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState(job.salaryCurrency || "USD");

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("salaryCurrency", currency);

    try {
      const result = await updateJob(job.id, formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // On success, updateJob redirects via server action
    } catch {
      // redirect throws, which is expected
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflow: "auto",
          margin: "var(--space-4)",
          padding: "var(--space-6)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-5)",
          }}
        >
          <h2
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              color: "var(--color-text-primary)",
            }}
          >
            Edit Job Details
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: "6px" }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            className="alert alert-error"
            style={{ marginBottom: "var(--space-4)" }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          {/* Title & Company */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-title">
                Job Title *
              </label>
              <input
                id="edit-title"
                name="title"
                type="text"
                className="form-input"
                defaultValue={job.title}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-company">
                Company *
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="edit-company"
                  name="company"
                  type="text"
                  className="form-input"
                  defaultValue={job.company}
                  required
                  style={{ paddingRight: "36px" }}
                />
                <Building2
                  size={14}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-description">
              Job Description *
            </label>
            <textarea
              id="edit-description"
              name="description"
              className="form-input form-textarea"
              defaultValue={job.description}
              required
              rows={5}
            />
          </div>

          {/* Location & Location Type */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-location">
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
                  id="edit-location"
                  name="location"
                  type="text"
                  className="form-input"
                  defaultValue={job.location}
                  required
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-location-type">
                Location Type
              </label>
              <select
                id="edit-location-type"
                name="locationType"
                className="form-input form-select"
                defaultValue={job.locationType}
              >
                <option value="REMOTE">Remote</option>
                <option value="ONSITE">On-site</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Employment Type & Experience */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-employment-type">
                Employment Type
              </label>
              <select
                id="edit-employment-type"
                name="employmentType"
                className="form-input form-select"
                defaultValue={job.employmentType}
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-experience">
                Experience Level
              </label>
              <input
                id="edit-experience"
                name="experienceLevel"
                type="text"
                className="form-input"
                defaultValue={job.experienceLevel || ""}
                placeholder="e.g. 2+ years"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-skills">
              Required Skills
            </label>
            <input
              id="edit-skills"
              name="requiredSkills"
              type="text"
              className="form-input"
              defaultValue={job.requiredSkills || ""}
              placeholder="e.g. React, TypeScript, Node.js (comma separated)"
            />
            <span className="form-helper">
              Enter skills separated by commas
            </span>
          </div>

          {/* Currency, Salary Min, Salary Max */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-currency">
                Currency
              </label>
              <select
                id="edit-currency"
                className="form-input form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-salary-min">
                Salary Min
              </label>
              <div style={{ position: "relative" }}>
                {currency === "USD" ? (
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
                ) : (
                  <IndianRupee
                    size={16}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-text-muted)",
                    }}
                  />
                )}
                <input
                  id="edit-salary-min"
                  name="salaryMin"
                  type="number"
                  className="form-input"
                  defaultValue={job.salaryMin ?? ""}
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-salary-max">
                Salary Max
              </label>
              <div style={{ position: "relative" }}>
                {currency === "USD" ? (
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
                ) : (
                  <IndianRupee
                    size={16}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-text-muted)",
                    }}
                  />
                )}
                <input
                  id="edit-salary-max"
                  name="salaryMax"
                  type="number"
                  className="form-input"
                  defaultValue={job.salaryMax ?? ""}
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-status">
                Job Status
              </label>
              <select
                id="edit-status"
                name="status"
                className="form-input form-select"
                defaultValue={job.status}
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-deadline">
                Application Deadline
              </label>
              <input
                id="edit-deadline"
                name="deadline"
                type="date"
                className="form-input"
                defaultValue={
                  job.deadline
                    ? new Date(job.deadline).toISOString().split("T")[0]
                    : ""
                }
              />
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--space-3)",
              marginTop: "var(--space-2)",
              paddingTop: "var(--space-4)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner" /> Saving...
                </>
              ) : (
                <>
                  <Pencil size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
