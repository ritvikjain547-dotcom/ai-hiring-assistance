'use client';

import { useState } from "react";
import { deleteJob } from "@/actions/jobs";
import { Trash2 } from "lucide-react";

export function DeleteJobButton({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete the job posting for "${jobTitle}"? This action cannot be undone and will delete all candidate applications associated with this job.`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const result = await deleteJob(jobId);
      if (result && 'error' in result) {
        alert(result.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Something went wrong while trying to delete the job.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="btn btn-danger"
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
      }}
    >
      <Trash2 size={16} />
      {loading ? "Deleting..." : "Delete Job"}
    </button>
  );
}
