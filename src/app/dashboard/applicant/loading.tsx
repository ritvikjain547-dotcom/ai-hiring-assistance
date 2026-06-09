export default function ApplicantDashboardLoading() {
  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div className="skeleton" style={{ width: 280, height: 36, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 320, height: 20 }} />
        </div>
        <div className="skeleton" style={{ width: 130, height: 40, borderRadius: "var(--radius-lg)" }} />
      </div>

      {/* Profile Completeness Skeleton */}
      <div
        className="card"
        style={{
          marginBottom: "var(--space-6)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
        }}
      >
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "var(--radius-lg)", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: 200, height: 16, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: "100%", height: 8, borderRadius: "var(--radius-full)" }} />
        </div>
        <div className="skeleton" style={{ width: 120, height: 32, borderRadius: "var(--radius-lg)" }} />
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

      {/* Recent Applications Skeleton */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-6)" }}>
          <div className="skeleton" style={{ width: 200, height: 24 }} />
          <div className="skeleton" style={{ width: 80, height: 28, borderRadius: "var(--radius-lg)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-3)" }}>
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: "var(--radius-lg)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: 180, height: 16, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: 120, height: 14 }} />
              </div>
              <div className="skeleton" style={{ width: 80, height: 24, borderRadius: "var(--radius-full)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
