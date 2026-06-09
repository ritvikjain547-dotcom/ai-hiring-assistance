export default function ApplicantJobsLoading() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="skeleton" style={{ width: 160, height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 300, height: 20 }} />
      </div>

      {/* Filters Skeleton */}
      <div
        className="filters-bar"
        style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}
      >
        <div className="skeleton" style={{ flex: 1, height: 42, borderRadius: "var(--radius-lg)" }} />
        <div className="skeleton" style={{ width: 150, height: 42, borderRadius: "var(--radius-lg)" }} />
        <div className="skeleton" style={{ width: 150, height: 42, borderRadius: "var(--radius-lg)" }} />
        <div className="skeleton" style={{ width: 90, height: 42, borderRadius: "var(--radius-lg)" }} />
      </div>

      {/* Job Cards Skeleton */}
      <div className="grid-cards">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card" style={{ padding: "var(--space-6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <div>
                <div className="skeleton" style={{ width: 100, height: 14, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: 200, height: 20 }} />
              </div>
              <div className="skeleton" style={{ width: 70, height: 24, borderRadius: "var(--radius-full)" }} />
            </div>
            <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
              <div className="skeleton" style={{ width: 90, height: 16 }} />
              <div className="skeleton" style={{ width: 80, height: 16 }} />
              <div className="skeleton" style={{ width: 70, height: 16 }} />
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              {[1, 2, 3].map((j) => (
                <div key={j} className="skeleton" style={{ width: 70, height: 24, borderRadius: "var(--radius-full)" }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="skeleton" style={{ width: 140, height: 16 }} />
              <div className="skeleton" style={{ width: 60, height: 16 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
