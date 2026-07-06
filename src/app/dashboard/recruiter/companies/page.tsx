'use client';

import { useState, useEffect, useTransition } from "react";
import {
  getRecruiterSetup,
  addRecruiterCompany,
  deleteRecruiterCompany,
} from "@/actions/recruiterProfile";
import {
  Building2,
  Plus,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

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

  useEffect(() => {
    async function load() {
      const data = await getRecruiterSetup();
      setSetup(data);
      setLoading(false);
    }
    load();
  }, []);

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

  // Company HR — single company
  if (setup?.recruiterType === "COMPANY_HR") {
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
                Company HR — This is automatically used for all your job
                postings
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not set up yet
  if (!setup?.recruiterType) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Companies</h1>
          <p className="page-subtitle">Manage your client companies</p>
        </div>

        <div className="card" style={{ maxWidth: "600px" }}>
          <div className="empty-state">
            <div className="empty-state-icon">
              <AlertCircle size={32} />
            </div>
            <div className="empty-state-title">Profile not set up</div>
            <div className="empty-state-description">
              Please set up your recruiter profile first by posting a job.
            </div>
            <Link
              href="/dashboard/recruiter/jobs/new"
              className="btn btn-primary"
            >
              <Briefcase size={16} />
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Agency — multiple companies
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
              Add your client companies above. They'll appear in the company
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
              {companies.length} {companies.length === 1 ? "Company" : "Companies"}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
