export default function RecruiterDashboardLoading() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="skeleton" style={{ width: 280, height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 260, height: 20 }} />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid-stats" style={{ marginBottom: "var(--space-8)" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: "var(--radius-lg)" }} />
            <div className="skeleton" style={{ width: 60, height: 36, marginTop: 8 }} />
            <div className="skeleton" style={{ width: 110, height: 16, marginTop: 4 }} />
          </div>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <div className="card">
        <div className="skeleton" style={{ width: 180, height: 24, marginBottom: "var(--space-6)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-3)" }}>
              <div className="skeleton" style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: 200, height: 16, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: 140, height: 14 }} />
              </div>
              <div className="skeleton" style={{ width: 70, height: 24, borderRadius: "var(--radius-full)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
