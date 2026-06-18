'use client';

import { useState } from "react";
import { updateRoundStatus, addRound, deleteRound } from "@/actions/rounds";
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
} from "lucide-react";

interface Round {
  id: string;
  roundNumber: number;
  roundName: string;
  status: string;
  scheduledAt: string | null;
  completedAt: string | null;
  feedback: string | null;
}

interface RoundManagerProps {
  applicationId: string;
  rounds: Round[];
  applicantName: string;
}

export function RoundManager({ applicationId, rounds, applicantName }: RoundManagerProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [feedbackRoundId, setFeedbackRoundId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [newRoundName, setNewRoundName] = useState("");
  const [addingRound, setAddingRound] = useState(false);

  const passedCount = rounds.filter((r) => r.status === "PASSED").length;

  async function handleStatusChange(roundId: string, status: string, feedback?: string) {
    setLoading(roundId);
    await updateRoundStatus(roundId, status, feedback);
    setFeedbackRoundId(null);
    setFeedbackText("");
    setLoading(null);
  }

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

  function getStatusIcon(status: string) {
    switch (status) {
      case "PASSED":
        return <CheckCircle2 size={14} style={{ color: "#34d399" }} />;
      case "FAILED":
        return <XCircle size={14} style={{ color: "#f87171" }} />;
      case "SCHEDULED":
        return <CalendarCheck size={14} style={{ color: "#60a5fa" }} />;
      default:
        return <Clock size={14} style={{ color: "#9ca3af" }} />;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "PASSED": return "rgba(16, 185, 129, 0.15)";
      case "FAILED": return "rgba(248, 113, 113, 0.15)";
      case "SCHEDULED": return "rgba(96, 165, 250, 0.15)";
      default: return "rgba(156, 163, 175, 0.1)";
    }
  }

  if (rounds.length === 0) {
    return (
      <div style={{
        marginTop: "var(--space-3)",
        padding: "var(--space-3)",
        background: "rgba(99, 102, 241, 0.04)",
        borderRadius: "var(--radius-md)",
        border: "1px solid rgba(99, 102, 241, 0.1)",
      }}>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: "var(--space-2)" }}>
          No interview rounds configured
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Add first round..."
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
    <div style={{
      marginTop: "var(--space-3)",
      border: "1px solid rgba(99, 102, 241, 0.12)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      {/* Header toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-3) var(--space-4)",
          background: "rgba(99, 102, 241, 0.04)",
          border: "none",
          cursor: "pointer",
          color: "var(--color-text-primary)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          📋 Interview Rounds ({passedCount}/{rounds.length} cleared)
        </span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div style={{ padding: "var(--space-3) var(--space-4)" }}>
          {/* Progress bar */}
          <div style={{
            height: 4,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 2,
            marginBottom: "var(--space-3)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${rounds.length > 0 ? (passedCount / rounds.length) * 100 : 0}%`,
              background: "linear-gradient(90deg, #34d399, #6ee7b7)",
              borderRadius: 2,
              transition: "width 0.3s ease",
            }} />
          </div>

          {/* Rounds list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {rounds.map((round) => (
              <div key={round.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "var(--space-2) var(--space-3)",
                    background: getStatusColor(round.status),
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {getStatusIcon(round.status)}
                  <span style={{ fontWeight: 600, minWidth: 20 }}>R{round.roundNumber}</span>
                  <span style={{ flex: 1, color: "var(--color-text-secondary)" }}>{round.roundName}</span>

                  {/* Status Actions */}
                  {loading === round.id ? (
                    <Loader2 size={12} className="spinner" />
                  ) : (
                    <div style={{ display: "flex", gap: 2 }}>
                      {round.status !== "PASSED" && (
                        <button
                          onClick={() => handleStatusChange(round.id, "PASSED")}
                          title="Mark as Passed"
                          style={{
                            padding: "2px 6px",
                            background: "rgba(16,185,129,0.2)",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            color: "#34d399",
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          ✓
                        </button>
                      )}
                      {round.status !== "FAILED" && (
                        <button
                          onClick={() => handleStatusChange(round.id, "FAILED")}
                          title="Mark as Failed"
                          style={{
                            padding: "2px 6px",
                            background: "rgba(248,113,113,0.2)",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            color: "#f87171",
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          ✗
                        </button>
                      )}
                      {round.status !== "SCHEDULED" && round.status !== "PASSED" && round.status !== "FAILED" && (
                        <button
                          onClick={() => handleStatusChange(round.id, "SCHEDULED")}
                          title="Mark as Scheduled"
                          style={{
                            padding: "2px 6px",
                            background: "rgba(96,165,250,0.2)",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            color: "#60a5fa",
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          📅
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setFeedbackRoundId(feedbackRoundId === round.id ? null : round.id);
                          setFeedbackText(round.feedback || "");
                        }}
                        title="Add feedback"
                        style={{
                          padding: "2px 6px",
                          background: "rgba(99,102,241,0.15)",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          color: "#818cf8",
                          fontSize: 10,
                        }}
                      >
                        <MessageSquare size={10} />
                      </button>
                      {round.status === "PENDING" && (
                        <button
                          onClick={() => handleDeleteRound(round.id)}
                          title="Delete round"
                          style={{
                            padding: "2px 6px",
                            background: "rgba(248,113,113,0.1)",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            color: "#f87171",
                            fontSize: 10,
                          }}
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Feedback input */}
                {feedbackRoundId === round.id && (
                  <div style={{
                    padding: "var(--space-2) var(--space-3)",
                    marginTop: 2,
                    background: "rgba(99,102,241,0.04)",
                    borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                  }}>
                    <textarea
                      className="form-input form-textarea"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Add feedback for this round..."
                      rows={2}
                      style={{ fontSize: "var(--text-xs)", padding: "6px 8px", marginBottom: 4 }}
                    />
                    <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => setFeedbackRoundId(null)}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: 10, padding: "2px 8px" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleStatusChange(round.id, round.status, feedbackText)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: 10, padding: "2px 8px" }}
                      >
                        Save Feedback
                      </button>
                    </div>
                  </div>
                )}

                {/* Show existing feedback */}
                {round.feedback && feedbackRoundId !== round.id && (
                  <div style={{
                    padding: "4px var(--space-3)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-tertiary)",
                    fontStyle: "italic",
                  }}>
                    💬 {round.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add new round */}
          <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Add another round..."
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
  );
}
