'use client';

import { useState } from "react";
import { updateApplicationStatus } from "@/actions/applications";
import { Loader2, MessageSquare } from "lucide-react";

export function StatusUpdateButton({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [startDate, setStartDate] = useState("");

  async function handleStatusChange(status: string) {
    // For reject/hire, show feedback form first
    if ((status === "REJECTED" || status === "HIRED") && !showFeedback) {
      setPendingAction(status);
      setShowFeedback(true);
      return;
    }

    setLoading(true);
    await updateApplicationStatus(applicationId, status, {
      rejectionReason: status === "REJECTED" ? reason : undefined,
      approvalNotes: status === "HIRED" ? reason : undefined,
      recruiterFeedback: feedback || undefined,
      startDate: status === "HIRED" ? startDate : undefined,
    });
    setShowFeedback(false);
    setPendingAction(null);
    setReason("");
    setFeedback("");
    setStartDate("");
    setLoading(false);
  }

  async function submitWithFeedback() {
    if (!pendingAction) return;
    setLoading(true);
    await updateApplicationStatus(applicationId, pendingAction, {
      rejectionReason: pendingAction === "REJECTED" ? reason : undefined,
      approvalNotes: pendingAction === "HIRED" ? reason : undefined,
      recruiterFeedback: feedback || undefined,
      startDate: pendingAction === "HIRED" ? startDate : undefined,
    });
    setShowFeedback(false);
    setPendingAction(null);
    setReason("");
    setFeedback("");
    setStartDate("");
    setLoading(false);
  }

  if (showFeedback && pendingAction) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        padding: "var(--space-3)",
        background: pendingAction === "REJECTED"
          ? "rgba(248, 113, 113, 0.05)"
          : "rgba(16, 185, 129, 0.05)",
        borderRadius: "var(--radius-md)",
        border: `1px solid ${pendingAction === "REJECTED"
          ? "rgba(248, 113, 113, 0.15)"
          : "rgba(16, 185, 129, 0.15)"}`,
      }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-primary)" }}>
          {pendingAction === "REJECTED" ? "❌ Rejection Reason" : "✅ Approval Notes"}
        </div>
        <textarea
          className="form-input form-textarea"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={pendingAction === "REJECTED"
            ? "Why is this applicant being rejected? (visible to applicant)"
            : "Why is this applicant being hired? (visible to applicant)"}
          rows={2}
          style={{ fontSize: "var(--text-xs)", padding: "6px 8px" }}
        />
        <textarea
          className="form-input form-textarea"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="General feedback for the applicant (optional)"
          rows={2}
          style={{ fontSize: "var(--text-xs)", padding: "6px 8px" }}
        />
        
        {pendingAction === "HIRED" && (
          <div style={{ marginTop: "4px" }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "4px" }}>
              Proposed Start Date
            </div>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={{ fontSize: "var(--text-xs)", padding: "6px 8px", width: "100%" }}
            />
          </div>
        )}

        <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
          <button
            onClick={() => { setShowFeedback(false); setPendingAction(null); }}
            className="btn btn-ghost btn-sm"
            disabled={loading}
            style={{ fontSize: "var(--text-xs)" }}
          >
            Cancel
          </button>
          <button
            onClick={submitWithFeedback}
            className={`btn btn-sm ${pendingAction === "REJECTED" ? "btn-danger" : "btn-primary"}`}
            disabled={loading}
            style={{ fontSize: "var(--text-xs)" }}
          >
            {loading ? (
              <><Loader2 size={12} className="spinner" /> Saving...</>
            ) : (
              <>{pendingAction === "REJECTED" ? "Confirm Reject" : "Confirm Hire"}</>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
      {currentStatus !== "REVIEWING" && (
        <button
          onClick={() => handleStatusChange("REVIEWING")}
          className="btn btn-ghost btn-sm"
          disabled={loading}
          style={{ flex: 1 }}
        >
          Review
        </button>
      )}
      {currentStatus !== "SHORTLISTED" && (
        <button
          onClick={() => handleStatusChange("SHORTLISTED")}
          className="btn btn-sm"
          disabled={loading}
          style={{
            flex: 1,
            background: "rgba(16, 185, 129, 0.15)",
            color: "#34d399",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          Shortlist
        </button>
      )}
      {currentStatus !== "REJECTED" && currentStatus !== "HIRED" && (
        <button
          onClick={() => handleStatusChange("REJECTED")}
          className="btn btn-danger btn-sm"
          disabled={loading}
          style={{ flex: 1 }}
        >
          Reject
        </button>
      )}
      {currentStatus !== "HIRED" && currentStatus === "SHORTLISTED" && (
        <button
          onClick={() => handleStatusChange("HIRED")}
          className="btn btn-primary btn-sm"
          disabled={loading}
          style={{ flex: 1 }}
        >
          Hire
        </button>
      )}
    </div>
  );
}
