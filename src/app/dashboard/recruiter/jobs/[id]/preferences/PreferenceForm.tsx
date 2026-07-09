'use client';

import { useState } from "react";
import { saveRecruiterPreference } from "@/actions/preferences";
import { useRouter } from "next/navigation";
import {
  Target,
  GraduationCap,
  Wrench,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Shield,
  Scale,
  Zap,
} from "lucide-react";

interface PreferenceFormProps {
  jobId: string;
  jobSkills: string;
  existingPrefs: any;
}

const STEPS = [
  { label: "Recruitment Style", icon: Target },
  { label: "Experience & Education", icon: GraduationCap },
  { label: "Skills & Requirements", icon: Wrench },
  { label: "Location & Custom", icon: MapPin },
];

export function PreferenceForm({ jobId, jobSkills, existingPrefs }: PreferenceFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [recruitmentStyle, setRecruitmentStyle] = useState(
    existingPrefs?.recruitmentStyle || "balanced"
  );
  const [priorityFactors, setPriorityFactors] = useState<string[]>(
    existingPrefs?.priorityFactors ? JSON.parse(existingPrefs.priorityFactors) : ["skills"]
  );
  const [minExperience, setMinExperience] = useState(
    existingPrefs?.minExperienceYears?.toString() || ""
  );
  const [maxExperience, setMaxExperience] = useState(
    existingPrefs?.maxExperienceYears?.toString() || ""
  );
  const [requiredEducation, setRequiredEducation] = useState(
    existingPrefs?.requiredEducation || ""
  );
  const [industryPreference, setIndustryPreference] = useState(
    existingPrefs?.industryPreference || ""
  );
  const [niceToHaveSkills, setNiceToHaveSkills] = useState(
    existingPrefs?.niceToHaveSkills || ""
  );
  const [customCriteria, setCustomCriteria] = useState(
    existingPrefs?.customCriteria || ""
  );
  const [locationPreference, setLocationPreference] = useState(
    existingPrefs?.locationPreference || "no_preference"
  );

  const togglePriorityFactor = (factor: string) => {
    setPriorityFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  };

  const handleSubmit = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.set("recruitmentStyle", recruitmentStyle);
    formData.set("priorityFactors", JSON.stringify(priorityFactors));
    formData.set("minExperienceYears", minExperience);
    formData.set("maxExperienceYears", maxExperience);
    formData.set("requiredEducation", requiredEducation);
    formData.set("industryPreference", industryPreference);
    formData.set("mustHaveSkills", jobSkills);
    formData.set("niceToHaveSkills", niceToHaveSkills);
    formData.set("customCriteria", customCriteria);
    formData.set("locationPreference", locationPreference);

    const result = await saveRecruiterPreference(jobId, formData);
    setSaving(false);

    if (result.success) {
      setSaved(true);
      setTimeout(() => {
        router.push(`/dashboard/recruiter/jobs/${jobId}`);
      }, 1500);
    }
  };

  const canGoNext = currentStep < STEPS.length - 1;
  const canGoPrev = currentStep > 0;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div>
      {/* Progress Steps */}
      <div className="pref-steps">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`pref-step ${i === currentStep ? "active" : ""} ${i < currentStep ? "completed" : ""}`}
            onClick={() => setCurrentStep(i)}
          >
            <div className="pref-step-icon">
              {i < currentStep ? <Check size={16} /> : <step.icon size={16} />}
            </div>
            <span className="pref-step-label">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="card" style={{ marginTop: "var(--space-6)" }}>
        {/* Step 1: Recruitment Style */}
        {currentStep === 0 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
              How do you want AI to screen candidates?
            </h2>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
              Choose your filtering strictness. This calibrates how the AI scores and classifies candidates.
            </p>

            <div className="pref-style-grid">
              {[
                {
                  value: "strict",
                  icon: Shield,
                  title: "Strict",
                  desc: "Only near-perfect matches pass. High bar for skills and experience.",
                  color: "#ef4444",
                },
                {
                  value: "balanced",
                  icon: Scale,
                  title: "Balanced",
                  desc: "Reasonable standards. Credit for transferable skills and related experience.",
                  color: "#f59e0b",
                },
                {
                  value: "flexible",
                  icon: Zap,
                  title: "Flexible",
                  desc: "Lenient scoring. Values potential, eagerness to learn, and adjacent skills.",
                  color: "#ea580c",
                },
              ].map((style) => (
                <div
                  key={style.value}
                  className={`pref-style-card ${recruitmentStyle === style.value ? "selected" : ""}`}
                  onClick={() => setRecruitmentStyle(style.value)}
                  style={{ "--style-color": style.color } as any}
                >
                  <div className="pref-style-card-icon" style={{ color: style.color }}>
                    <style.icon size={24} />
                  </div>
                  <div className="pref-style-card-title">{style.title}</div>
                  <div className="pref-style-card-desc">{style.desc}</div>
                  {recruitmentStyle === style.value && (
                    <div className="pref-style-check">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginTop: "var(--space-8)", marginBottom: "var(--space-4)" }}>
              What matters most to you?
            </h3>
            <div className="pref-priority-grid">
              {[
                { value: "skills", label: "Technical Skills", icon: "🛠️" },
                { value: "experience", label: "Work Experience", icon: "💼" },
                { value: "education", label: "Education", icon: "🎓" },
                { value: "cultural_fit", label: "Cultural Fit", icon: "🤝" },
                { value: "projects", label: "Portfolio/Projects", icon: "📁" },
                { value: "certifications", label: "Certifications", icon: "📜" },
              ].map((factor) => (
                <button
                  key={factor.value}
                  type="button"
                  className={`pref-priority-btn ${priorityFactors.includes(factor.value) ? "selected" : ""}`}
                  onClick={() => togglePriorityFactor(factor.value)}
                >
                  <span>{factor.icon}</span>
                  {factor.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Experience & Education */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
              Experience & Education Requirements
            </h2>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
              Define the experience and education criteria for ideal candidates.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              <div className="form-group">
                <label className="form-label">Minimum Experience (years)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g., 2"
                  value={minExperience}
                  onChange={(e) => setMinExperience(e.target.value)}
                  min="0"
                  max="30"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Maximum Experience (years)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g., 10"
                  value={maxExperience}
                  onChange={(e) => setMaxExperience(e.target.value)}
                  min="0"
                  max="30"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "var(--space-4)" }}>
              <label className="form-label">Required Education Level</label>
              <select
                className="form-input form-select"
                value={requiredEducation}
                onChange={(e) => setRequiredEducation(e.target.value)}
              >
                <option value="">No preference</option>
                <option value="High School">High School</option>
                <option value="Associate's">Associate&apos;s Degree</option>
                <option value="Bachelor's">Bachelor&apos;s Degree</option>
                <option value="Master's">Master&apos;s Degree</option>
                <option value="PhD">PhD / Doctorate</option>
                <option value="Bootcamp">Bootcamp / Certification</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: "var(--space-4)" }}>
              <label className="form-label">Preferred Industry Background</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., FinTech, Healthcare, SaaS..."
                value={industryPreference}
                onChange={(e) => setIndustryPreference(e.target.value)}
              />
              <span className="form-helper">Leave blank for no preference</span>
            </div>
          </div>
        )}

        {/* Step 3: Skills & Requirements */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
              Skills & Requirements
            </h2>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
              Specify must-have and nice-to-have skills for this role.
            </p>

            <div className="form-group">
              <label className="form-label">Must-Have Skills</label>
              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-bg-secondary)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                  lineHeight: "1.6",
                }}
              >
                {jobSkills
                  ? jobSkills.split(",").map((s: string, i: number) => (
                      <span key={i} className="tag" style={{ marginRight: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                        {s.trim()}
                      </span>
                    ))
                  : <span style={{ fontStyle: "italic" }}>No skills specified in job posting</span>
                }
              </div>
              <span className="form-helper">
                Auto-populated from the job&apos;s required skills. Edit them in the job details if needed.
              </span>
            </div>

            <div className="form-group" style={{ marginTop: "var(--space-4)" }}>
              <label className="form-label">Nice-to-Have Skills</label>
              <textarea
                className="form-input form-textarea"
                placeholder="e.g., GraphQL, Docker, AWS, CI/CD"
                value={niceToHaveSkills}
                onChange={(e) => setNiceToHaveSkills(e.target.value)}
                rows={3}
              />
              <span className="form-helper">Bonus skills that would be great to have but aren&apos;t required</span>
            </div>
          </div>
        )}

        {/* Step 4: Location & Custom */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
              Location & Special Requirements
            </h2>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
              Any final preferences for candidate screening.
            </p>

            <div className="form-group">
              <label className="form-label">Candidate Location Preference</label>
              <select
                className="form-input form-select"
                value={locationPreference}
                onChange={(e) => setLocationPreference(e.target.value)}
              >
                <option value="no_preference">No preference</option>
                <option value="local_only">Local candidates only</option>
                <option value="willing_to_relocate">Willing to relocate</option>
                <option value="remote_ok">Remote candidates welcome</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: "var(--space-4)" }}>
              <label className="form-label">Custom Requirements / Special Instructions for AI</label>
              <textarea
                className="form-input form-textarea"
                placeholder="e.g., Prefer candidates with open-source contributions, Must be available to start immediately, Looking for leadership experience..."
                value={customCriteria}
                onChange={(e) => setCustomCriteria(e.target.value)}
                rows={4}
              />
              <span className="form-helper">
                Free-text instructions for the AI. Mention anything specific about how you want candidates evaluated.
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "var(--space-8)",
            paddingTop: "var(--space-6)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={!canGoPrev}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {isLastStep ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={saving || saved}
            >
              {saved ? (
                <>
                  <Check size={16} />
                  Saved! Redirecting...
                </>
              ) : saving ? (
                <>
                  <Sparkles size={16} className="spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Save AI Preferences
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canGoNext}
            >
              Next
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
