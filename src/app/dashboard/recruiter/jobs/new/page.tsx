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
  Plus,
  X,
  ListOrdered,
  IndianRupee,
} from "lucide-react";

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalRounds, setTotalRounds] = useState<number | "">(1);
  const [roundNames, setRoundNames] = useState<string[]>(["Round 1"]);
  const [includeAiRound, setIncludeAiRound] = useState(true);
  const [setupAi, setSetupAi] = useState(true);
  const [currency, setCurrency] = useState("USD");

  const handleTotalRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === "") {
      setTotalRounds("");
      return;
    }

    const value = Math.max(1, parseInt(rawValue) || 1);
    setTotalRounds(value);
    
    setRoundNames(prev => {
      if (value > prev.length) {
        return [...prev, ...Array.from({ length: value - prev.length }, (_, i) => `Round ${prev.length + i + 1}`)];
      } else {
        return prev.slice(0, value);
      }
    });
  };

  const handleRoundNameChange = (index: number, newName: string) => {
    setRoundNames(prev => {
      const updated = [...prev];
      updated[index] = newName;
      return updated;
    });
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    // Inject computed round data
    const finalRoundNames = [...roundNames];
    if (includeAiRound && (totalRounds || 1) > 0) {
      finalRoundNames[0] = "AI Resume Screening";
    }

    formData.set("totalRounds", String(totalRounds || 1));
    formData.set("roundNames", finalRoundNames.join(","));
    if (includeAiRound && setupAi) {
      formData.set("setupAi", "true");
    }
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
              <label className="form-label" htmlFor="job-salary-currency">
                Currency
              </label>
              <select
                id="job-salary-currency"
                name="salaryCurrency"
                className="form-input form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="job-salary-min">
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
                  id="job-salary-min"
                  name="salaryMin"
                  type="number"
                  className="form-input"
                  placeholder={currency === "USD" ? "60000" : "500000"}
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="job-salary-max">
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
                  id="job-salary-max"
                  name="salaryMax"
                  type="number"
                  className="form-input"
                  placeholder={currency === "USD" ? "120000" : "1000000"}
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

          <div className="form-group">
            <label className="form-label" htmlFor="job-total-rounds">
              Total Number of Rounds
            </label>
            <div style={{ position: "relative" }}>
              <ListOrdered
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
                id="job-total-rounds"
                type="number"
                min="1"
                value={totalRounds}
                onChange={handleTotalRoundsChange}
                className="form-input"
                style={{ paddingLeft: "38px" }}
              />
            </div>
            <span className="form-helper">
              Specify the total number of interview rounds applicants will go through.
            </span>
          </div>

          {/* Round Names Inputs */}
          {totalRounds > 0 && (
            <div
              style={{
                padding: "var(--space-5)",
                background: "rgba(99, 102, 241, 0.04)",
                border: "1px solid rgba(99, 102, 241, 0.15)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              <label className="form-label" style={{ margin: 0 }}>
                Round Names (Optional)
              </label>
              <span className="form-helper" style={{ display: "block", marginBottom: "var(--space-2)" }}>
                You can customize the name of each round. Applicants will see these names as they progress.
              </span>
              
              <div style={{ marginBottom: "var(--space-3)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "var(--text-sm)" }}>
                  <input
                    type="checkbox"
                    checked={includeAiRound}
                    onChange={(e) => setIncludeAiRound(e.target.checked)}
                    style={{ accentColor: "var(--color-primary)", width: "16px", height: "16px" }}
                  />
                  <span>Automatically set Round 1 as <strong>AI Resume Screening</strong></span>
                </label>
                
                {includeAiRound && (
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "var(--text-sm)", marginTop: "var(--space-2)", marginLeft: "var(--space-6)" }}>
                    <input
                      type="checkbox"
                      checked={setupAi}
                      onChange={(e) => setSetupAi(e.target.checked)}
                      style={{ accentColor: "var(--color-primary)", width: "14px", height: "14px" }}
                    />
                    <span style={{ color: "var(--color-text-secondary)" }}>Configure AI Screening Preferences immediately after posting</span>
                  </label>
                )}
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-3)" }}>
                {roundNames.map((name, index) => {
                  const isAiRound = index === 0 && includeAiRound;
                  return (
                    <div key={index}>
                      <label className="form-label" style={{ fontSize: "var(--text-xs)", marginBottom: "4px" }}>
                        Round {index + 1}
                      </label>
                      <input
                        type="text"
                        className={`form-input form-input-sm ${isAiRound ? "input-disabled" : ""}`}
                        value={isAiRound ? "AI Resume Screening" : name}
                        onChange={(e) => handleRoundNameChange(index, e.target.value)}
                        placeholder={`Round ${index + 1}`}
                        disabled={isAiRound}
                        style={isAiRound ? { backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-muted)" } : {}}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
