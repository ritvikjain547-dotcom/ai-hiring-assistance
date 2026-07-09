'use client';

import { useState } from "react";
import { applyForJob } from "@/actions/applications";
import { Send, Loader2, CheckCircle2, Upload } from "lucide-react";

export default function ApplyForm({
  jobId,
  initialEmail,
  initialPhone,
}: {
  jobId: string;
  initialEmail: string;
  initialPhone: string;
}) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  async function handleApply(formData: FormData) {
    setLoading(true);
    setError("");
    formData.append("jobId", jobId);

    const result = await applyForJob(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setApplied(true);
    }
    setLoading(false);
  }

  if (applied) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-4)" }}>
        <CheckCircle2 size={40} style={{ color: "#c2410c", margin: "0 auto var(--space-4)" }} />
        <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
          Applied Successfully!
        </h3>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Your application has been submitted. The recruiter will review it
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={handleApply} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-2)" }}>
        Apply for this position
      </h3>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* Important Contact Information */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div className="form-group">
          <label className="form-label" htmlFor="apply-email">
            Email Address *
          </label>
          <input
            id="apply-email"
            name="email"
            type="email"
            className="form-input"
            defaultValue={initialEmail}
            required
            placeholder="your@email.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="apply-phone">
            Phone Number *
          </label>
          <input
            id="apply-phone"
            name="phone"
            type="tel"
            className="form-input"
            defaultValue={initialPhone}
            required
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      {/* CV / Resume Upload */}
      <div className="form-group">
        <label className="form-label">CV / Resume *</label>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          required
          className="form-input"
          style={{ fontSize: "var(--text-xs)" }}
        />
        <span className="form-helper">
          PDF, DOC, or DOCX — max 5MB. Upload a resume tailored to this role.
        </span>
      </div>

      {/* Why should we select you */}
      <div className="form-group">
        <label className="form-label" htmlFor="cover-letter">
          Why should we select you for this role? *
        </label>
        <textarea
          id="cover-letter"
          name="coverLetter"
          className="form-input form-textarea"
          required
          placeholder="Please write a brief summary highlighting your experience, skills, and why you are the ideal fit for this job..."
          rows={5}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
        id="apply-btn"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="spinner" />
            Submitting Application...
          </>
        ) : (
          <>
            <Send size={16} />
            Submit Application
          </>
        )}
      </button>
    </form>
  );
}
