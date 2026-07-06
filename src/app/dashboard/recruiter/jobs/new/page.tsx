'use client';

import { useState, useEffect, useTransition } from "react";
import { createJob } from "@/actions/jobs";
import {
  getRecruiterSetup,
  setRecruiterType,
  addRecruiterCompany,
} from "@/actions/recruiterProfile";
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
  Building2,
  Users,
  ChevronDown,
  Check,
} from "lucide-react";

type RecruiterSetup = {
  recruiterType: "COMPANY_HR" | "AGENCY" | null;
  companyName: string | null;
  recruiterCompanies: { id: string; name: string }[];
} | null;

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalRounds, setTotalRounds] = useState<number | "">(1);
  const [roundNames, setRoundNames] = useState<string[]>(["Round 1"]);
  const [includeAiRound, setIncludeAiRound] = useState(true);
  const [setupAi, setSetupAi] = useState(true);
  const [currency, setCurrency] = useState("USD");

  // Recruiter type state
  const [recruiterSetup, setRecruiterSetup] = useState<RecruiterSetup>(null);
  const [setupLoading, setSetupLoading] = useState(true);
  const [setupStep, setSetupStep] = useState<"loading" | "choose" | "ready">("loading");
  const [selectedType, setSelectedType] = useState<"COMPANY_HR" | "AGENCY" | null>(null);
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [isPending, startTransition] = useTransition();

  // Company selector state (for agency)
  const [selectedCompany, setSelectedCompany] = useState("");
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [addingCompany, setAddingCompany] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  // Load recruiter setup on mount
  useEffect(() => {
    async function load() {
      const setup = await getRecruiterSetup();
      setRecruiterSetup(setup);
      if (setup?.recruiterType) {
        setSetupStep("ready");
        if (setup.recruiterType === "COMPANY_HR" && setup.companyName) {
          setCompanyNameInput(setup.companyName);
        }
      } else {
        setSetupStep("choose");
      }
      setSetupLoading(false);
    }
    load();
  }, []);

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

  async function handleSetupSubmit() {
    if (!selectedType) return;
    if (selectedType === "COMPANY_HR" && !companyNameInput.trim()) {
      setError("Please enter your company name");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await setRecruiterType(
        selectedType,
        selectedType === "COMPANY_HR" ? companyNameInput.trim() : undefined
      );
      if (result.error) {
        setError(result.error);
      } else {
        // Refresh setup
        const setup = await getRecruiterSetup();
        setRecruiterSetup(setup);
        setSetupStep("ready");
      }
    });
  }

  async function handleAddCompany() {
    if (!newCompanyName.trim()) return;
    setAddingCompany(true);
    const result = await addRecruiterCompany(newCompanyName.trim());
    if (result.error) {
      setError(result.error);
    } else if (result.company) {
      // Add to local list and select it
      setRecruiterSetup(prev => prev ? {
        ...prev,
        recruiterCompanies: [...prev.recruiterCompanies, result.company!].sort((a, b) => a.name.localeCompare(b.name)),
      } : prev);
      setSelectedCompany(result.company.name);
      setNewCompanyName("");
      setShowAddCompany(false);
      setCompanyDropdownOpen(false);
      setError("");
    }
    setAddingCompany(false);
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    // Set company name from the recruiter type context
    if (recruiterSetup?.recruiterType === "COMPANY_HR") {
      formData.set("company", recruiterSetup.companyName || companyNameInput);
    } else if (recruiterSetup?.recruiterType === "AGENCY") {
      if (!selectedCompany) {
        setError("Please select a company for this job posting");
        setLoading(false);
        return;
      }
      formData.set("company", selectedCompany);
    }

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

  // --- Loading state ---
  if (setupLoading) {
    return (
      <div className="animate-fade-in" style={{ display: "flex", justifyContent: "center", padding: "var(--space-12)" }}>
        <Loader2 size={32} className="spinner" style={{ color: "var(--color-primary)" }} />
      </div>
    );
  }

  // --- Recruiter Type Setup (first-time) ---
  if (setupStep === "choose") {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Welcome! Let&apos;s set up your profile</h1>
          <p className="page-subtitle">
            Tell us about your recruiting role so we can customize your experience
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "var(--space-5)", maxWidth: "700px" }}>
            {error}
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-6)",
          maxWidth: "700px",
          marginBottom: "var(--space-6)",
        }}>
          {/* Company HR Card */}
          <button
            type="button"
            onClick={() => { setSelectedType("COMPANY_HR"); setError(""); }}
            style={{
              padding: "var(--space-6)",
              background: selectedType === "COMPANY_HR"
                ? "rgba(99, 102, 241, 0.1)"
                : "rgba(255, 255, 255, 0.03)",
              border: selectedType === "COMPANY_HR"
                ? "2px solid var(--color-primary)"
                : "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all var(--transition-fast)",
              position: "relative",
            }}
          >
            {selectedType === "COMPANY_HR" && (
              <div style={{
                position: "absolute", top: "12px", right: "12px",
                width: "24px", height: "24px", borderRadius: "50%",
                background: "var(--color-primary)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <Check size={14} color="#fff" />
              </div>
            )}
            <div style={{
              width: "48px", height: "48px", borderRadius: "var(--radius-lg)",
              background: "rgba(99, 102, 241, 0.12)", display: "flex",
              alignItems: "center", justifyContent: "center",
              marginBottom: "var(--space-4)",
            }}>
              <Building2 size={24} color="#818cf8" />
            </div>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-2)", color: "var(--color-text-primary)" }}>
              Company HR
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
              I&apos;m hiring for my own company. My company name will auto-fill on every job I post.
            </div>
          </button>

          {/* Recruiting Agency Card */}
          <button
            type="button"
            onClick={() => { setSelectedType("AGENCY"); setError(""); }}
            style={{
              padding: "var(--space-6)",
              background: selectedType === "AGENCY"
                ? "rgba(56, 189, 248, 0.1)"
                : "rgba(255, 255, 255, 0.03)",
              border: selectedType === "AGENCY"
                ? "2px solid #38bdf8"
                : "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all var(--transition-fast)",
              position: "relative",
            }}
          >
            {selectedType === "AGENCY" && (
              <div style={{
                position: "absolute", top: "12px", right: "12px",
                width: "24px", height: "24px", borderRadius: "50%",
                background: "#38bdf8", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <Check size={14} color="#fff" />
              </div>
            )}
            <div style={{
              width: "48px", height: "48px", borderRadius: "var(--radius-lg)",
              background: "rgba(56, 189, 248, 0.12)", display: "flex",
              alignItems: "center", justifyContent: "center",
              marginBottom: "var(--space-4)",
            }}>
              <Users size={24} color="#38bdf8" />
            </div>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-2)", color: "var(--color-text-primary)" }}>
              Recruiting Agency
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
              I recruit for multiple companies. I&apos;ll select or add companies when posting each job.
            </div>
          </button>
        </div>

        {/* Company name input for Company HR */}
        {selectedType === "COMPANY_HR" && (
          <div className="card" style={{ maxWidth: "700px", marginBottom: "var(--space-5)" }}>
            <div className="form-group">
              <label className="form-label" htmlFor="setup-company-name">
                <Building2 size={14} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                Your Company Name *
              </label>
              <input
                id="setup-company-name"
                type="text"
                className="form-input"
                placeholder="e.g. Acme Inc."
                value={companyNameInput}
                onChange={(e) => setCompanyNameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSetupSubmit(); } }}
                autoFocus
              />
              <span className="form-helper">
                This will auto-fill the company field every time you post a new job.
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleSetupSubmit}
          className="btn btn-primary btn-lg"
          disabled={!selectedType || isPending || (selectedType === "COMPANY_HR" && !companyNameInput.trim())}
          style={{ maxWidth: "700px" }}
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="spinner" /> Saving...
            </>
          ) : (
            <>
              Continue to Post a Job <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    );
  }

  // --- Main Job Posting Form ---
  const isAgency = recruiterSetup?.recruiterType === "AGENCY";
  const isCompanyHR = recruiterSetup?.recruiterType === "COMPANY_HR";
  const companies = recruiterSetup?.recruiterCompanies || [];

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

            {/* Company field — different depending on recruiter type */}
            <div className="form-group">
              <label className="form-label" htmlFor="job-company">
                Company Name *
              </label>
              {isCompanyHR ? (
                /* Company HR: auto-filled, read-only */
                <div style={{ position: "relative" }}>
                  <input
                    id="job-company"
                    name="company"
                    type="text"
                    className="form-input"
                    value={recruiterSetup?.companyName || ""}
                    readOnly
                    style={{
                      backgroundColor: "var(--color-bg-secondary)",
                      color: "var(--color-text-secondary)",
                      cursor: "default",
                    }}
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
              ) : isAgency ? (
                /* Agency: dropdown to select or add company */
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    id="job-company"
                    onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                    className="form-input"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      color: selectedCompany ? "var(--color-text-primary)" : "var(--color-text-muted)",
                    }}
                  >
                    <span>{selectedCompany || "Select a company..."}</span>
                    <ChevronDown size={14} style={{ 
                      transition: "transform 0.2s", 
                      transform: companyDropdownOpen ? "rotate(180deg)" : "none",
                      flexShrink: 0,
                    }} />
                  </button>

                  {/* Hidden input for form submission */}
                  <input type="hidden" name="company" value={selectedCompany} />

                  {companyDropdownOpen && (
                    <div style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 50,
                      marginTop: "4px",
                      background: "var(--color-bg-elevated)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-lg)",
                      maxHeight: "240px",
                      overflowY: "auto",
                    }}>
                      {companies.length > 0 && companies.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedCompany(c.name);
                            setCompanyDropdownOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-2)",
                            width: "100%",
                            padding: "10px var(--space-4)",
                            background: selectedCompany === c.name ? "rgba(99, 102, 241, 0.08)" : "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "var(--text-sm)",
                            color: "var(--color-text-primary)",
                            textAlign: "left",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = selectedCompany === c.name ? "rgba(99, 102, 241, 0.08)" : "transparent")}
                        >
                          <Building2 size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                          {c.name}
                          {selectedCompany === c.name && (
                            <Check size={14} style={{ marginLeft: "auto", color: "var(--color-primary)" }} />
                          )}
                        </button>
                      ))}

                      {/* Divider */}
                      {companies.length > 0 && (
                        <div style={{ height: "1px", background: "var(--color-border)", margin: "4px 0" }} />
                      )}

                      {/* Add new company inline */}
                      {showAddCompany ? (
                        <div style={{ padding: "8px var(--space-4)", display: "flex", gap: "var(--space-2)" }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="New company name..."
                            value={newCompanyName}
                            onChange={(e) => setNewCompanyName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCompany(); } }}
                            autoFocus
                            style={{ flex: 1, fontSize: "var(--text-sm)", padding: "6px 10px" }}
                          />
                          <button
                            type="button"
                            onClick={handleAddCompany}
                            className="btn btn-primary btn-sm"
                            disabled={addingCompany || !newCompanyName.trim()}
                            style={{ fontSize: "var(--text-xs)", padding: "4px 10px", whiteSpace: "nowrap" }}
                          >
                            {addingCompany ? <Loader2 size={12} className="spinner" /> : <Plus size={12} />}
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => { setShowAddCompany(false); setNewCompanyName(""); }}
                            style={{
                              background: "none", border: "none", cursor: "pointer",
                              color: "var(--color-text-muted)", padding: "4px",
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowAddCompany(true)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-2)",
                            width: "100%",
                            padding: "10px var(--space-4)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "var(--text-sm)",
                            color: "var(--color-primary)",
                            fontWeight: 600,
                            textAlign: "left",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99, 102, 241, 0.06)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <Plus size={14} />
                          Add New Company
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback: plain text input */
                <input
                  id="job-company"
                  name="company"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Acme Inc."
                  required
                />
              )}
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
          {Number(totalRounds) > 0 && (
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
