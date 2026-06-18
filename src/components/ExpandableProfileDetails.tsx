'use client';

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, User, Briefcase, GraduationCap, Link as LinkIcon } from "lucide-react";

interface ExpandableProfileDetailsProps {
  app: any;
}

export function ExpandableProfileDetails({ app }: ExpandableProfileDetailsProps) {
  const [expanded, setExpanded] = useState(false);

  const profile = app.applicant?.profile;
  const hasProfile = !!profile;
  const hasCoverLetter = !!app.coverLetter;

  if (!hasProfile && !hasCoverLetter) return null;

  return (
    <div style={{ marginTop: "var(--space-4)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-3)" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="btn btn-ghost btn-sm"
        style={{ width: "100%", justifyContent: "space-between", color: "var(--color-text-secondary)" }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <User size={16} />
          {expanded ? "Hide Profile Details" : "View Profile & Cover Letter"}
        </span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div style={{ 
          marginTop: "var(--space-3)", 
          padding: "var(--space-4)", 
          background: "rgba(0,0,0,0.02)", 
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)"
        }}>
          {hasCoverLetter && (
            <div>
              <h4 style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                <FileText size={14} /> Cover Letter
              </h4>
              <p style={{ color: "var(--color-text-secondary)", whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                {app.coverLetter}
              </p>
            </div>
          )}

          {profile?.bio && (
            <div>
              <h4 style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                <User size={14} /> Bio
              </h4>
              <p style={{ color: "var(--color-text-secondary)", whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                {profile.bio}
              </p>
            </div>
          )}

          {profile?.experienceYears && (
            <div>
              <h4 style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                <Briefcase size={14} /> Experience
              </h4>
              <p style={{ color: "var(--color-text-secondary)", whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                {profile.experienceYears} Years
              </p>
            </div>
          )}

          {profile?.education && (
            <div>
              <h4 style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                <GraduationCap size={14} /> Education
              </h4>
              <p style={{ color: "var(--color-text-secondary)", whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                {profile.education}
              </p>
            </div>
          )}

          {(profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl) && (
            <div>
              <h4 style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                <LinkIcon size={14} /> Links
              </h4>
              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
                    LinkedIn
                  </a>
                )}
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
                    GitHub
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
