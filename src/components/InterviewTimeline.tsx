'use client';

import {
  CheckCircle2,
  XCircle,
  Clock,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

interface Round {
  id: string;
  roundNumber: number;
  roundName: string;
  status: string;
  scheduledAt: string | null;
  completedAt: string | null;
  feedback: string | null;
}

interface InterviewTimelineProps {
  rounds: Round[];
  currentRound: number;
  totalRounds: number;
}

export function InterviewTimeline({ rounds, currentRound, totalRounds }: InterviewTimelineProps) {
  const [expandedRound, setExpandedRound] = useState<string | null>(null);

  if (rounds.length === 0 && totalRounds <= 0) return null;

  const passedCount = rounds.filter((r) => r.status === "PASSED").length;
  const failedCount = rounds.filter((r) => r.status === "FAILED").length;
  const scheduledCount = rounds.filter((r) => r.status === "SCHEDULED").length;
  const progress = rounds.length > 0 ? (passedCount / rounds.length) * 100 : 0;

  function getStatusConfig(status: string) {
    switch (status) {
      case "PASSED":
        return {
          icon: <CheckCircle2 size={16} />,
          label: "Cleared",
          color: "#34d399",
          bg: "rgba(16, 185, 129, 0.12)",
          border: "rgba(16, 185, 129, 0.25)",
          glow: "0 0 12px rgba(16, 185, 129, 0.2)",
        };
      case "FAILED":
        return {
          icon: <XCircle size={16} />,
          label: "Not Cleared",
          color: "#f87171",
          bg: "rgba(248, 113, 113, 0.12)",
          border: "rgba(248, 113, 113, 0.25)",
          glow: "0 0 12px rgba(248, 113, 113, 0.2)",
        };
      case "SCHEDULED":
        return {
          icon: <CalendarCheck size={16} />,
          label: "Scheduled",
          color: "#60a5fa",
          bg: "rgba(96, 165, 250, 0.12)",
          border: "rgba(96, 165, 250, 0.25)",
          glow: "0 0 12px rgba(96, 165, 250, 0.2)",
        };
      default:
        return {
          icon: <Clock size={16} />,
          label: "Pending",
          color: "#9ca3af",
          bg: "rgba(156, 163, 175, 0.08)",
          border: "rgba(156, 163, 175, 0.15)",
          glow: "none",
        };
    }
  }

  return (
    <div className="interview-timeline-container">
      {/* Summary Header */}
      <div className="interview-timeline-header">
        <div className="interview-timeline-title">
          <span>📋 Interview Progress</span>
          <span className="interview-timeline-count">
            {passedCount}/{rounds.length} rounds cleared
          </span>
        </div>

        {/* Mini stats */}
        <div className="interview-timeline-stats">
          {passedCount > 0 && (
            <span className="timeline-stat timeline-stat-passed">
              <CheckCircle2 size={12} /> {passedCount} Cleared
            </span>
          )}
          {scheduledCount > 0 && (
            <span className="timeline-stat timeline-stat-scheduled">
              <CalendarCheck size={12} /> {scheduledCount} Scheduled
            </span>
          )}
          {failedCount > 0 && (
            <span className="timeline-stat timeline-stat-failed">
              <XCircle size={12} /> {failedCount} Not Cleared
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="interview-progress-track">
        <div
          className="interview-progress-fill"
          style={{ width: `${progress}%` }}
        />
        {/* Progress dots */}
        {rounds.map((_, i) => (
          <div
            key={i}
            className="interview-progress-dot"
            style={{
              left: `${((i + 1) / rounds.length) * 100}%`,
              background: i < passedCount ? "#34d399" : "rgba(156, 163, 175, 0.3)",
            }}
          />
        ))}
      </div>

      {/* Timeline Steps */}
      <div className="interview-timeline-steps">
        {rounds.map((round, index) => {
          const config = getStatusConfig(round.status);
          const isExpanded = expandedRound === round.id;
          const isLast = index === rounds.length - 1;

          return (
            <div key={round.id} className="interview-timeline-step">
              {/* Connector Line */}
              {!isLast && (
                <div
                  className="timeline-connector"
                  style={{
                    background: round.status === "PASSED"
                      ? "linear-gradient(to bottom, #34d399, rgba(156, 163, 175, 0.15))"
                      : "rgba(156, 163, 175, 0.12)",
                  }}
                />
              )}

              {/* Node */}
              <div
                className="timeline-node"
                style={{
                  background: config.bg,
                  border: `2px solid ${config.border}`,
                  color: config.color,
                  boxShadow: config.glow,
                }}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="timeline-content" style={{ flex: 1 }}>
                <button
                  className="timeline-step-header"
                  onClick={() => setExpandedRound(isExpanded ? null : round.id)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: round.feedback ? "pointer" : "default",
                    padding: 0,
                    textAlign: "left",
                    color: "inherit",
                  }}
                >
                  <div className="timeline-step-info">
                    <span className="timeline-round-name">
                      Round {round.roundNumber}: {round.roundName}
                    </span>
                    <span
                      className="timeline-round-status"
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </span>
                  </div>
                  {round.feedback && (
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  )}
                </button>

                {/* Expanded Feedback */}
                {isExpanded && round.feedback && (
                  <div className="timeline-feedback">
                    <MessageSquare size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{round.feedback}</span>
                  </div>
                )}

                {/* Completed date */}
                {round.completedAt && (
                  <div className="timeline-date">
                    {new Date(round.completedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
