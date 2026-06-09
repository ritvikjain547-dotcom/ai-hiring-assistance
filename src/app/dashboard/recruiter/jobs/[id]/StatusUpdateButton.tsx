'use client';

import { useState } from "react";
import { updateApplicationStatus } from "@/actions/applications";

export function StatusUpdateButton({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(status: string) {
    setLoading(true);
    await updateApplicationStatus(applicationId, status);
    setLoading(false);
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
      {currentStatus !== "REJECTED" && (
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
