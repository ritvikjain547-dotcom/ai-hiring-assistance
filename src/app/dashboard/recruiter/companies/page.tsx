'use client';

import { useState, useEffect, useTransition } from "react";
import {
  getRecruiterSetup,
  setRecruiterType,
  addRecruiterCompany,
  deleteRecruiterCompany,
  renameRecruiterCompany,
} from "@/actions/recruiterProfile";
import {
  Building2,
  Plus,
  Trash2,
  Loader2,
  Pencil,
  Check,
  X,
  AlertCircle,
  Briefcase,
  Users,
  ArrowRight,
} from "lucide-react";

type RecruiterSetup = {
  recruiterType: "COMPANY_HR" | "AGENCY" | null;
  companyName: string | null;
  recruiterCompanies: { id: string; name: string }[];
} | null;

export default function CompaniesPage() {
  const [setup, setSetup] = useState<RecruiterSetup>(null);
  const [loading, setLoading] = useState(true);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  // Setup flow state
  const [selectedType, setSelectedType] = useState<"COMPANY_HR" | "AGENCY" | null>(null);
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      const data = await getRecruiterSetup();
      setSetup(data);
      if (data?.recruiterType === "COMPANY_HR" && data.companyName) {
        setCompanyNameInput(data.companyName);
      }
      setLoading(false);
    }
    load();
  }, []);

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
        const data = await getRecruiterSetup();
        setSetup(data);
      }
    });
  }

  async function handleAdd() {
    if (!newCompanyName.trim()) return;
    setAdding(true);
    setError("");
    const result = await addRecruiterCompany(newCompanyName.trim());
    if (result.error) {
      setError(result.error);
    } else if (result.company) {
      setSetup((prev) =>
        prev
          ? {
              ...prev,
              recruiterCompanies: [
                ...prev.recruiterCompanies,
                result.company!,
              ].sort((a, b) => a.name.localeCompare(b.name)),
            }
          : prev
      );
      setNewCompanyName("");
    }
    setAdding(false);
  }

  async function handleDelete(companyId: string) {
    setDeletingId(companyId);
    setError("");
    const result = await deleteRecruiterCompany(companyId);
    if (result.error) {
      setError(result.error);
    } else {
      setSetup((prev) =>
        prev
          ? {
              ...prev,
              recruiterCompanies: prev.recruiterCompanies.filter(
                (c) => c.id !== companyId
              ),
            }
          : prev
      );
    }
    setDeletingId(null);
  }

  function startEditing(company: { id: string; name: string }) {
    setEditingId(company.id);
    setEditName(company.name);
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditName("");
  }

  async function handleRename(companyId: string) {
    if (!editName.trim()) return;
    setSaving(true);
    setError("");
    const result = await renameRecruiterCompany(companyId, editName.trim());
    if (result.error) {
      setError(result.error);
    } else {
      setSetup((prev) =>
        prev
          ? {
              ...prev,
              recruiterCompanies: prev.recruiterCompanies
                .map((c) =>
                  c.id === companyId ? { ...c, name: editName.trim() } : c
                )
                .sort((a, b) => a.name.localeCompare(b.name)),
            }
          : prev
      );
      setEditingId(null);
      setEditName("");
    }
    setSaving(false);
  }

  // --- Loading ---
  if (loading) {
    return (
      <div
        className="animate-fade-in"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "var(--space-12)",
        }}
      >
        <Loader2
          size={32}
          className="spinner"
          style={{ color: "var(--color-primary)" }}
        />
      </div>
    );
  }

  // --- First-time setup: Choose Company HR or Agency ---
  if (!setup?.recruiterType) {
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
              Continue <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    );
  }

  // --- Company HR: single company view ---
  if (setup.recruiterType === "COMPANY_HR") {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Company</h1>
          <p className="page-subtitle">
            Your company information for job postings
          </p>
        </div>

        <div className="card" style={{ maxWidth: "600px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-4)",
              padding: "var(--space-4)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-lg)",
                background: "rgba(99, 102, 241, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Building2 size={24} color="#818cf8" />
            </div>
            <div>
              <div
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                }}
              >
                {setup.companyName}
              </div>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Company HR — This is automatically used for all your job postings
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Agency: multiple companies management ---
  const companies = setup.recruiterCompanies || [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Companies</h1>
        <p className="page-subtitle">
          Manage your client companies for job postings
        </p>
      </div>

      {error && (
        <div
          className="alert alert-error"
          style={{ marginBottom: "var(--space-5)", maxWidth: "600px" }}
        >
          {error}
        </div>
      )}

      {/* Add Company Form */}
      <div
        className="card"
        style={{
          maxWidth: "600px",
          marginBottom: "var(--space-5)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "flex-end",
          }}
        >
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label" htmlFor="new-company-name">
              Add a New Company
            </label>
            <input
              id="new-company-name"
              type="text"
              className="form-input"
              placeholder="Enter company name..."
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>
          <button
            onClick={handleAdd}
            className="btn btn-primary"
            disabled={adding || !newCompanyName.trim()}
            style={{ marginBottom: 0, height: "42px" }}
          >
            {adding ? (
              <Loader2 size={16} className="spinner" />
            ) : (
              <Plus size={16} />
            )}
            Add
          </button>
        </div>
      </div>

      {/* Companies List */}
      <div className="card" style={{ maxWidth: "600px" }}>
        {companies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Building2 size={32} />
            </div>
            <div className="empty-state-title">No companies yet</div>
            <div className="empty-state-description">
              Add your client companies above. They&apos;ll appear in the company
              dropdown when you post a new job.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "var(--space-3) var(--space-4)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              {companies.length}{" "}
              {companies.length === 1 ? "Company" : "Companies"}
            </div>
            {companies.map((company) => (
              <div
                key={company.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3) var(--space-4)",
                  borderBottom: "1px solid var(--color-border)",
                  transition: "background 0.15s",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(56, 189, 248, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Building2 size={16} color="#38bdf8" />
                </div>

                {editingId === company.id ? (
                  /* Editing mode */
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                    }}
                  >
                    <input
                      type="text"
                      className="form-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleRename(company.id);
                        }
                        if (e.key === "Escape") cancelEditing();
                      }}
                      autoFocus
                      style={{
                        flex: 1,
                        fontSize: "var(--text-sm)",
                        padding: "6px 10px",
                        height: "34px",
                      }}
                    />
                    <button
                      onClick={() => handleRename(company.id)}
                      className="btn btn-primary btn-sm"
                      disabled={saving || !editName.trim()}
                      style={{ padding: "6px 8px", height: "34px" }}
                      title="Save"
                    >
                      {saving ? (
                        <Loader2 size={14} className="spinner" />
                      ) : (
                        <Check size={14} />
                      )}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "6px 8px", height: "34px" }}
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  /* Display mode */
                  <>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "var(--text-sm)",
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {company.name}
                    </span>
                    <button
                      onClick={() => startEditing(company)}
                      className="btn btn-ghost btn-sm"
                      style={{
                        color: "var(--color-text-muted)",
                        padding: "6px",
                      }}
                      title="Edit company name"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      disabled={deletingId === company.id}
                      className="btn btn-ghost btn-sm"
                      style={{
                        color: "var(--color-text-muted)",
                        padding: "6px",
                      }}
                      title="Delete company"
                    >
                      {deletingId === company.id ? (
                        <Loader2 size={14} className="spinner" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
