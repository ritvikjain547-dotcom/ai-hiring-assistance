'use client';

import { useState } from "react";
import { updateRoundStatus } from "@/actions/rounds";
import { Loader2, CheckCircle2, XCircle, X } from "lucide-react";

interface ReviewModalProps {
  roundId: string;
  roundName: string;
  roundNumber: number;
  applicantName: string;
  action: "PASSED" | "FAILED";
  isHire?: boolean;
  isShortlist?: boolean;
  onClose: () => void;
}

export function ReviewModal({
  roundId,
  roundName,
  roundNumber,
  applicantName,
  action,
  isHire,
  isShortlist,
  onClose,
}: ReviewModalProps) {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const isSelected = action === "PASSED";
  const title = isHire
    ? "Hire Candidate"
    : isShortlist || isSelected
    ? "Shortlist Candidate for Next Round"
    : "Reject Candidate";
  const subtitle = isHire
    ? `${applicantName} will clear the final round and be officially hired!`
    : isShortlist || isSelected
    ? `${applicantName} will clear ${roundName} and be shortlisted, enabling interview scheduling for the next round.`
    : `${applicantName} will be rejected at ${roundName}.`;

  async function handleSubmit() {
    setLoading(true);
    await updateRoundStatus(roundId, action, review || undefined);
    setLoading(false);
    onClose();
  }

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div
        className="review-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="review-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <div
              className={`review-modal-icon ${isSelected ? "selected" : "rejected"}`}
            >
              {isSelected ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <div>
              <h3 className="review-modal-title">{title}</h3>
              <p className="review-modal-subtitle">{subtitle}</p>
            </div>
          </div>
          <button className="review-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Round info badge */}
        <div className="review-modal-round-badge">
          Round {roundNumber} — {roundName}
        </div>

        {/* Review textarea */}
        <div className="review-modal-body">
          <label className="review-modal-label">
            {isHire ? "Hiring Review & Assessment" : isSelected ? "Shortlisting Review & Assessment" : "Rejection Review"}
            <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>
              {" "}(internal note only, not sent to applicant)
            </span>
          </label>
          <textarea
            className="form-input form-textarea review-modal-textarea"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder={
              isHire
                ? "Write final hiring notes and review for this candidate..."
                : isSelected
                ? "Write your review — why this candidate is being shortlisted for the next round..."
                : "Provide feedback/reason for rejection..."
            }
            rows={4}
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="review-modal-actions">
          <button
            onClick={onClose}
            className="btn btn-ghost"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`btn ${isSelected ? "btn-primary" : "btn-danger"}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spinner" /> Submitting...
              </>
            ) : isHire ? (
              <>
                <CheckCircle2 size={16} /> Confirm Hire
              </>
            ) : isSelected ? (
              <>
                <CheckCircle2 size={16} /> Confirm Shortlist
              </>
            ) : (
              <>
                <XCircle size={16} /> Confirm Rejection
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
