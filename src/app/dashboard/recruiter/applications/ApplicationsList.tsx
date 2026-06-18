'use client';

import { useState } from "react";
import { ApplicationFilters } from "./ApplicationFilters";
import { AiScoreBadge } from "./AiScoreBadge";
import { OverrideConfirmDialog } from "./OverrideConfirmDialog";
import { Download, Users, Brain, ArrowUpDown } from "lucide-react";
import PhotoViewer from "@/components/PhotoViewer";
import { ExpandableProfileDetails } from "@/components/ExpandableProfileDetails";

interface ApplicationsListProps {
  applications: any[];
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const companies = Array.from(new Set(applications.map((a: any) => a.job.company))).filter(Boolean).sort() as string[];
  const roles = Array.from(new Set(applications.map((a: any) => a.job.title))).filter(Boolean).sort() as string[];

  const counts = {
    all: applications.length,
    matching: applications.filter((a: any) => a.aiClassification === "MATCHING").length,
    nearBound: applications.filter((a: any) => a.aiClassification === "NEAR_BOUND").length,
    notMatching: applications.filter((a: any) => a.aiClassification === "NOT_MATCHING").length,
    pending: applications.filter((a: any) => a.aiClassification === "PENDING_REVIEW" || !a.aiClassification).length,
  };

  const filtered = applications.filter((a: any) => {
    // Classification filter
    if (activeFilter === "PENDING_REVIEW") {
      if (a.aiClassification !== "PENDING_REVIEW" && a.aiClassification) return false;
    } else if (activeFilter !== "ALL") {
      if (a.aiClassification !== activeFilter) return false;
    }

    // Company filter
    if (companyFilter !== "ALL" && a.job.company !== companyFilter) return false;

    // Role filter
    if (roleFilter !== "ALL" && a.job.title !== roleFilter) return false;

    return true;
  });

  const getClassificationBadge = (classification: string | null) => {
    switch (classification) {
      case "MATCHING":
        return <span className="badge ai-badge-matching">✅ Matching</span>;
      case "NEAR_BOUND":
        return <span className="badge ai-badge-near">🔶 Near Bound</span>;
      case "NOT_MATCHING":
        return <span className="badge ai-badge-not-matching">❌ Not Match</span>;
      default:
        return <span className="badge ai-badge-pending">⏳ Pending</span>;
    }
  };

  return (
    <div>
      <ApplicationFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-4)", flexWrap: "wrap" }}>
        <select
          className="form-input form-select"
          style={{ width: "auto", minWidth: "200px" }}
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
        >
          <option value="ALL">All Companies</option>
          {companies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>

        <select
          className="form-input form-select"
          style={{ width: "auto", minWidth: "200px" }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* AI Stats Summary */}
      <div className="ai-stats-bar">
        <div className="ai-stats-item">
          <Brain size={14} />
          <span>{applications.filter((a: any) => a.aiScore !== null).length} AI Screened</span>
        </div>
        <div className="ai-stats-item">
          <ArrowUpDown size={14} />
          <span>Sorted by AI Score</span>
        </div>
        <div className="ai-stats-item">
          <span>{applications.filter((a: any) => a.recruiterOverride).length} Overrides</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users size={32} />
            </div>
            <div className="empty-state-title">No applications found</div>
            <div className="empty-state-description">
              {activeFilter !== "ALL"
                ? `No applications with "${activeFilter.replace("_", " ")}" classification.`
                : "Applications will appear here when candidates apply to your jobs."}
            </div>
          </div>
        </div>
      ) : (
        <div className="ai-applications-grid">
          {filtered.map((app: any) => {
            let parsedSkillsMatch: string[] = [];
            let parsedSkillsGap: string[] = [];
            try {
              if (app.aiSkillsMatch) parsedSkillsMatch = JSON.parse(app.aiSkillsMatch);
              if (app.aiSkillsGap) parsedSkillsGap = JSON.parse(app.aiSkillsGap);
            } catch {}

            return (
              <div key={app.id} className="ai-application-card">
                {/* Override badge */}
                {app.recruiterOverride && (
                  <div className="ai-override-badge">
                    <span>👤 Recruiter Override</span>
                  </div>
                )}

                {/* Header: Avatar + Info + Score */}
                <div className="ai-app-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flex: 1 }}>
                    <PhotoViewer
                      src={app.applicant.profile?.profilePhotoUrl || ""}
                      alt={app.applicant.name}
                      fallbackInitial={app.applicant.name.charAt(0).toUpperCase()}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>
                        {app.applicant.name}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                        {app.applicant.email}
                      </div>
                    </div>
                  </div>
                  <AiScoreBadge score={app.aiScore} classification={app.aiClassification} size="sm" />
                </div>

                {/* Job info */}
                <div className="ai-app-job">
                  <span style={{ fontWeight: 500 }}>{app.job.title}</span>
                  <span style={{ color: "var(--color-text-tertiary)" }}>{app.job.company}</span>
                </div>

                {/* Classification + Status */}
                <div className="ai-app-badges">
                  {getClassificationBadge(app.aiClassification)}
                  <span
                    className={`badge ${
                      app.status === "PENDING"
                        ? "badge-warning"
                        : app.status === "SHORTLISTED"
                        ? "badge-success"
                        : app.status === "REJECTED"
                        ? "badge-danger"
                        : app.status === "REVIEWING"
                        ? "badge-info"
                        : app.status === "HIRED"
                        ? "badge-success"
                        : "badge-neutral"
                    }`}
                  >
                    {app.status}
                  </span>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginLeft: "auto" }}>
                    {new Date(app.appliedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* AI Summary */}
                {app.aiOverallSummary && (
                  <div className="ai-app-summary">
                    <strong>AI Summary:</strong> {app.aiOverallSummary}
                  </div>
                )}

                {/* Skills Tags */}
                {(parsedSkillsMatch.length > 0 || parsedSkillsGap.length > 0) && (
                  <div className="ai-app-skills">
                    {parsedSkillsMatch.slice(0, 4).map((skill, i) => (
                      <span key={`m-${i}`} className="ai-skill-tag match">{skill}</span>
                    ))}
                    {parsedSkillsGap.slice(0, 3).map((skill, i) => (
                      <span key={`g-${i}`} className="ai-skill-tag gap">{skill}</span>
                    ))}
                    {(parsedSkillsMatch.length > 4 || parsedSkillsGap.length > 3) && (
                      <span className="ai-skill-tag more">
                        +{Math.max(0, parsedSkillsMatch.length - 4) + Math.max(0, parsedSkillsGap.length - 3)} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="ai-app-actions">
                  {app.resumeUrl && (
                    <a
                      href={`/api/resume/${app.id}`}
                      download
                      className="btn btn-ghost btn-sm"
                    >
                      <Download size={14} />
                      Resume
                    </a>
                  )}
                  <OverrideConfirmDialog
                    applicationId={app.id}
                    candidateName={app.applicant.name}
                    currentClassification={app.aiClassification || "PENDING_REVIEW"}
                    currentStatus={app.status}
                    aiScore={app.aiScore}
                  />
                </div>

                <ExpandableProfileDetails app={app} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
