'use client';

import { useState } from "react";
import { AlertTriangle, X, RefreshCw, UserCheck, UserX } from "lucide-react";
import { updateApplicationStatus, reAnalyzeApplication } from "@/actions/applications";
import { useRouter } from "next/navigation";

interface OverrideConfirmDialogProps {
  applicationId: string;
  candidateName: string;
  currentClassification: string;
  currentStatus: string;
  aiScore: number | null;
}

export function OverrideConfirmDialog({
  applicationId,
  candidateName,
  currentClassification,
  currentStatus,
  aiScore,
}: OverrideConfirmDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [reAnalyzing, setReAnalyzing] = useState(false);

  async function handleStatusChange(newStatus: string) {
    // If AI already screened and action conflicts with AI decision, show confirmation
    const isAiScreened = currentClassification && currentClassification !== "PENDING_REVIEW";
    const isConflicting =
      (currentClassification === "MATCHING" && newStatus === "REJECTED") ||
      (currentClassification === "NOT_MATCHING" && (newStatus === "SHORTLISTED" || newStatus === "HIRED"));

    if (isAiScreened && isConflicting) {
      setSelectedAction(newStatus);
      setIsOpen(true);
    } else {
      // Direct action — no confirmation needed
      setLoading(true);
      await updateApplicationStatus(applicationId, newStatus, {
        startDate: newStatus === "HIRED" ? startDate : undefined,
      });
      setLoading(false);
      router.refresh();
    }
  }

  async function handleConfirmedOverride() {
    if (!selectedAction) return;
    setLoading(true);
    await updateApplicationStatus(applicationId, selectedAction, {
      startDate: selectedAction === "HIRED" ? startDate : undefined,
    });
    setLoading(false);
    setIsOpen(false);
    router.refresh();
  }

  async function handleReAnalyze() {
    setReAnalyzing(true);
    await reAnalyzeApplication(applicationId);
    setReAnalyzing(false);
    router.refresh();
  }

  const classificationLabel = {
    MATCHING: "✅ Matching",
    NEAR_BOUND: "🔶 Near Bound",
    NOT_MATCHING: "❌ Not Matching",
    PENDING_REVIEW: "⏳ Pending Review",
  }[currentClassification] || currentClassification;

  return (
    <>
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
        {/* Always show Shortlist button unless already shortlisted or hired */}
        {currentStatus !== "SHORTLISTED" && currentStatus !== "HIRED" && (
          <button
            className="btn btn-sm hitl-btn-accept"
            onClick={() => handleStatusChange("SHORTLISTED")}
            disabled={loading}
          >
            <UserCheck size={14} />
            Shortlist
          </button>
        )}

        {/* Always show Reject button unless already rejected or hired */}
        {currentStatus !== "REJECTED" && currentStatus !== "HIRED" && (
          <button
            className="btn btn-sm hitl-btn-reject"
            onClick={() => handleStatusChange("REJECTED")}
            disabled={loading}
          >
            <UserX size={14} />
            Reject
          </button>
        )}

        {/* Re-analyze button */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleReAnalyze}
          disabled={reAnalyzing}
          title="Re-run AI analysis"
        >
          <RefreshCw size={14} className={reAnalyzing ? "spin" : ""} />
        </button>
      </div>

      {/* Confirmation Modal — only shown when overriding AI decision */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(245, 158, 11, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f59e0b",
                }}>
                  <AlertTriangle size={20} />
                </div>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>
                  Override AI Decision
                </h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                AI classified <strong>{candidateName}</strong> as{" "}
                <strong>{classificationLabel}</strong>
                {aiScore !== null && <> with a score of <strong>{aiScore}/100</strong></>}.
              </p>
              <p style={{ marginTop: "var(--space-3)" }}>
                You are about to{" "}
                <strong>
                  {selectedAction === "SHORTLISTED"
                    ? "accept and shortlist"
                    : selectedAction === "HIRED"
                    ? "hire"
                    : "reject"}
                </strong>{" "}
                this candidate, which contradicts the AI&apos;s recommendation. A notification email will be sent.
              </p>

              <div
                style={{
                  background: "rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                  marginTop: "var(--space-4)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <strong style={{ color: "#f59e0b" }}>⚠️ Human-in-the-Loop Override</strong>
                <br />
                This action overrides the AI&apos;s recommendation. The application will be marked
                as &quot;Recruiter Override&quot; for audit tracking.
              </div>

              {selectedAction === "HIRED" && (
                <div style={{ marginTop: "var(--space-4)" }}>
                  <label className="form-label">
                    Proposed Start Date
                    <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>
                      {" "}(will be included in the offer letter)
                    </span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button
                className={`btn ${selectedAction === "REJECTED" ? "btn-danger" : "btn-primary"}`}
                onClick={handleConfirmedOverride}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : selectedAction === "SHORTLISTED"
                  ? "Yes, Shortlist Candidate"
                  : selectedAction === "HIRED"
                  ? "Yes, Hire Candidate"
                  : "Yes, Reject Candidate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
