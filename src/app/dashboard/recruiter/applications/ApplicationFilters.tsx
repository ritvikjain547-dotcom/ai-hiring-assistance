'use client';

import { useState } from "react";
import { Filter, CheckCircle2, AlertTriangle, XCircle, Clock, LayoutGrid } from "lucide-react";

interface ApplicationFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    matching: number;
    nearBound: number;
    notMatching: number;
    pending: number;
  };
}

export function ApplicationFilters({
  activeFilter,
  onFilterChange,
  counts,
}: ApplicationFiltersProps) {
  const filters = [
    { value: "ALL", label: "All", icon: LayoutGrid, count: counts.all, color: "" },
    { value: "MATCHING", label: "Matching", icon: CheckCircle2, count: counts.matching, color: "#10b981" },
    { value: "NEAR_BOUND", label: "Near Bound", icon: AlertTriangle, count: counts.nearBound, color: "#f59e0b" },
    { value: "NOT_MATCHING", label: "Not Matching", icon: XCircle, count: counts.notMatching, color: "#ef4444" },
    { value: "PENDING_REVIEW", label: "Pending", icon: Clock, count: counts.pending, color: "#6366f1" },
  ];

  return (
    <div className="ai-filter-tabs">
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={`ai-filter-tab ${activeFilter === filter.value ? "active" : ""}`}
          onClick={() => onFilterChange(filter.value)}
          style={activeFilter === filter.value && filter.color ? { "--tab-color": filter.color } as any : undefined}
        >
          <filter.icon size={15} style={filter.color ? { color: filter.color } : undefined} />
          <span>{filter.label}</span>
          <span className="ai-filter-count">{filter.count}</span>
        </button>
      ))}
    </div>
  );
}
