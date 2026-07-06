'use client';

import { useState } from "react";
import { addRound, deleteRound } from "@/actions/rounds";
import { ReviewModal } from "./ReviewModal";
import { ScheduleModal } from "./ScheduleModal";
import {
  CheckCircle2,
  XCircle,
  Clock,
  CalendarCheck,
  Plus,
  Trash2,
  MessageSquare,
  Loader2,
  ChevronDown,
  ChevronUp,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Award,
} from "lucide-react";

interface Round {
  id: string;
  roundNumber: number;
  roundName: string;
  status: string;
  scheduledAt: string | null;
  scheduledDate: string | null;
  completedAt: string | null;
  feedback: string | null;
  review: string | null;
  reviewedAt: string | null;
  interviewLink?: string | null;
  interviewInfo?: string | null;
}

interface RoundManagerProps {
  applicationId: string;
  rounds: Round[];
  applicantName: string;
  applicationStatus?: string;
}

export function RoundManager({ applicationId, rounds, applicantName, applicationStatus }: RoundManagerProps) {
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);
  const [newRoundName, setNewRoundName] = useState("");
  const [addingRound, setAddingRound] = useState(false);

  // Modal states
  const [reviewModal, setReviewModal] = useState<{
    roundId: string;
    roundName: string;
    roundNumber: number;
    action: "PASSED" | "FAILED";
    isHire?: boolean;
    isShortlist?: boolean;
  } | null>(null);

  const [scheduleModal, setScheduleModal] = useState<{
    roundId: string;
    roundName: string;
    roundNumber: number;
  } | null>(null);

  const passedCount = rounds.filter((r) => r.status === "PASSED").length;
  const totalRounds = rounds.length;

  async function handleAddRound() {
    if (!newRoundName.trim()) return;
    setAddingRound(true);
    await addRound(applicationId, newRoundName.trim());
    setNewRoundName("");
    setAddingRound(false);
  }

  async function handleDeleteRound(roundId: string) {
    setLoading(roundId);
    await deleteRound(roundId);
    setLoading(null);
  }

  function getStatusConfig(status: string) {
    switch (status) {
      case "PASSED":
        return {
          icon: <CheckCircle2 size={16} />,
          label: "Shortlisted",
          color: "#34d399",
          bg: "rgba(16, 185, 129, 0.12)",
          border: "rgba(16, 185, 129, 0.25)",
        };
      case "FAILED":
        return {
          icon: <XCircle size={16} />,
          label: "Rejected",
          color: "#f87171",
          bg: "rgba(248, 113, 113, 0.12)",
          border: "rgba(248, 113, 113, 0.25)",
        };
      case "SCHEDULED":
        return {
          icon: <CalendarCheck size={16} />,
          label: "Scheduled",
          color: "#60a5fa",
          bg: "rgba(96, 165, 250, 0.12)",
          border: "rgba(96, 165, 250, 0.25)",
        };
      default:
        return {
          icon: <Clock size={16} />,
          label: "Pending",
          color: "#9ca3af",
          bg: "rgba(156, 163, 175, 0.08)",
          border: "rgba(156, 163, 175, 0.15)",
        };
    }
  }

  if (rounds.length === 0) {
    return (
      <div className="round-manager-empty">
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: "var(--space-2)" }}>
          No interview rounds configured
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Add first round (e.g., Technical Interview)..."
            value={newRoundName}
            onChange={(e) => setNewRoundName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddRound(); } }}
            style={{ flex: 1, fontSize: "var(--text-xs)", padding: "6px 10px" }}
          />
          <button
            onClick={handleAddRound}
            className="btn btn-secondary btn-sm"
            disabled={addingRound || !newRoundName.trim()}
            style={{ fontSize: "var(--text-xs)", padding: "4px 10px" }}
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="round-manager-container">
        {/* Header toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="round-manager-header"
        >
          <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            📋 Interview Pipeline ({passedCount}/{totalRounds} cleared)
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            {/* Mini round indicators */}
            <div className="round-dots">
              {rounds.map((round) => (
                <div
                  key={round.id}
                  className={`round-dot ${round.status.toLowerCase()}`}
                  title={`${round.roundName}: ${round.status}`}
                />
              ))}
            </div>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        {expanded && (
          <div className="round-manager-body">
            {/* Progress bar */}
            <div className="round-progress-track">
              <div
                className="round-progress-fill"
                style={{ width: `${totalRounds > 0 ? (passedCount / totalRounds) * 100 : 0}%` }}
              />
            </div>

            {/* Rounds list */}
            <div className="round-list">
              {rounds.map((round) => {
                const config = getStatusConfig(round.status);
                const isPending = round.status === "PENDING";
                const isScheduled = round.status === "SCHEDULED";
                const isCompleted = round.status === "PASSED" || round.status === "FAILED";

                // Round type detection
                const isAiRound = round.roundName.toLowerCase().includes("ai") ||
                  round.roundName.toLowerCase().includes("screening") ||
                  round.roundName.toLowerCase().includes("automated");
                // Active round index — the first non-completed round
                const activeRoundIndex = rounds.findIndex(r => r.status !== "PASSED" && r.status !== "FAILED");
                const isActiveRound = rounds.indexOf(round) === activeRoundIndex;
                const isLastRound = round.roundNumber === totalRounds;
                const canSchedule = (isPending || isScheduled) && (round.roundNumber > 1 || !isAiRound);

                return (
                  <div key={round.id} className="round-item">
                    <div
                      className="round-item-main"
                      style={{
                        background: config.bg,
                        borderColor: config.border,
                      }}
                    >
                      {/* Status icon */}
                      <div className="round-item-status" style={{ color: config.color }}>
                        {config.icon}
                      </div>

                      {/* Round info */}
                      <div className="round-item-info">
                        <span className="round-item-number">R{round.roundNumber}</span>
                        <span className="round-item-name">
                          {round.roundName}
                          {isAiRound && <span style={{ fontSize: "9px", color: "#818cf8", marginLeft: "4px" }}>🤖 Auto</span>}
                          {isLastRound && <span style={{ fontSize: "9px", color: "#f59e0b", marginLeft: "4px" }}>⭐ Final</span>}
                        </span>
                        <span className="round-item-label" style={{ color: config.color }}>
                          {config.label}
                        </span>
                      </div>

                      {/* Action buttons */}
                      {loading === round.id ? (
                        <Loader2 size={14} className="spinner" />
                      ) : (
                        <div className="round-item-actions">
                          {/* === ACTIVE ROUND ACTIONS === */}
                          {isActiveRound && !isCompleted && applicationStatus !== "HIRED" && (
                            <>
                              {/* 1. Interview Scheduling Button (if Round 1 cleared / active interview round) */}
                              {canSchedule && (
                                <button
                                  onClick={() =>
                                    setScheduleModal({
                                      roundId: round.id,
                                      roundName: round.roundName,
                                      roundNumber: round.roundNumber,
                                    })
                                  }
                                  className="round-action-btn schedule"
                                  title="Schedule or Reschedule Interview (Calendar & Timing)"
                                >
                                  <Calendar size={12} />
                                  <span>{isScheduled ? "Reschedule" : "Schedule Interview"}</span>
                                </button>
                              )}

                              {/* 2. Decision Buttons: Last Round vs Non-Last Round */}
                              {isLastRound ? (
                                <>
                                  <button
                                    onClick={() =>
                                      setReviewModal({
                                        roundId: round.id,
                                        roundName: round.roundName,
                                        roundNumber: round.roundNumber,
                                        action: "PASSED",
                                        isHire: true,
                                      })
                                    }
                                    className="round-action-btn hire"
                                    title="Hire candidate — final decision with review"
                                  >
                                    <Award size={12} />
                                    <span>Hire</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      setReviewModal({
                                        roundId: round.id,
                                        roundName: round.roundName,
                                        roundNumber: round.roundNumber,
                                        action: "FAILED",
                                      })
                                    }
                                    className="round-action-btn rejected"
                                    title="Reject candidate — opens review option"
                                  >
                                    <ThumbsDown size={12} />
                                    <span>Reject</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      setReviewModal({
                                        roundId: round.id,
                                        roundName: round.roundName,
                                        roundNumber: round.roundNumber,
                                        action: "PASSED",
                                        isShortlist: true,
                                      })
                                    }
                                    className="round-action-btn selected"
                                    title="Shortlist for next round — opens review option"
                                  >
                                    <ThumbsUp size={12} />
                                    <span>Shortlist</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      setReviewModal({
                                        roundId: round.id,
                                        roundName: round.roundName,
                                        roundNumber: round.roundNumber,
                                        action: "FAILED",
                                      })
                                    }
                                    className="round-action-btn rejected"
                                    title="Reject candidate — opens review option"
                                  >
                                    <ThumbsDown size={12} />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}
                            </>
                          )}

                          {/* Delete button for pending rounds */}
                          {isActiveRound && isPending && (
                            <button
                              onClick={() => handleDeleteRound(round.id)}
                              className="round-action-btn delete"
                              title="Delete round"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Scheduled date display */}
                    {isScheduled && round.scheduledDate && (
                      <div className="round-scheduled-info">
                        <CalendarCheck size={12} />
                        Interview: {new Date(round.scheduledDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          timeZone: "Asia/Kolkata",
                        })} at {new Date(round.scheduledDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          timeZone: "Asia/Kolkata",
                        })}
                        {round.interviewLink && (
                          <div style={{ marginTop: "4px" }}>
                            <a href={round.interviewLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
                              Join Interview Link
                            </a>
                          </div>
                        )}
                        {round.interviewInfo && (
                          <div style={{ marginTop: "4px", fontStyle: "italic", color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>
                            {round.interviewInfo}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Review display */}
                    {round.review && (
                      <div className="round-review-display">
                        <MessageSquare size={12} />
                        <div>
                          <div className="round-review-label">Review:</div>
                          <div className="round-review-text">{round.review}</div>
                          {round.reviewedAt && (
                            <div className="round-review-date">
                              {new Date(round.reviewedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Legacy feedback display */}
                    {round.feedback && !round.review && (
                      <div className="round-review-display">
                        <MessageSquare size={12} />
                        <span>{round.feedback}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add new round */}
            <div className="round-add-form">
              <input
                type="text"
                className="form-input"
                placeholder="Add another round (e.g., HR Interview)..."
                value={newRoundName}
                onChange={(e) => setNewRoundName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddRound(); } }}
                style={{ flex: 1, fontSize: "var(--text-xs)", padding: "4px 10px" }}
              />
              <button
                onClick={handleAddRound}
                className="btn btn-secondary btn-sm"
                disabled={addingRound || !newRoundName.trim()}
                style={{ fontSize: "var(--text-xs)", padding: "4px 10px" }}
              >
                {addingRound ? <Loader2 size={12} className="spinner" /> : <Plus size={12} />}
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <ReviewModal
          roundId={reviewModal.roundId}
          roundName={reviewModal.roundName}
          roundNumber={reviewModal.roundNumber}
          applicantName={applicantName}
          action={reviewModal.action}
          isHire={reviewModal.isHire}
          isShortlist={reviewModal.isShortlist}
          onClose={() => setReviewModal(null)}
        />
      )}

      {/* Schedule Modal */}
      {scheduleModal && (
        <ScheduleModal
          roundId={scheduleModal.roundId}
          roundName={scheduleModal.roundName}
          roundNumber={scheduleModal.roundNumber}
          applicantName={applicantName}
          onClose={() => setScheduleModal(null)}
        />
      )}
    </>
  );
}
