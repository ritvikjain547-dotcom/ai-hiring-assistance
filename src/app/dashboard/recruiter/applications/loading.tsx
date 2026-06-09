export default function RecruiterApplicationsLoading() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="skeleton" style={{ width: 200, height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 340, height: 20 }} />
      </div>

      <div className="table-container">
        {/* Table header skeleton */}
        <div style={{ display: "flex", gap: "var(--space-6)", padding: "var(--space-4) var(--space-6)", borderBottom: "1px solid var(--color-border)", background: "rgba(255,255,255,0.02)" }}>
          {["Candidate", "Job", "Applied", "Status", "Resume", "Actions"].map((h) => (
            <div key={h} className="skeleton" style={{ width: 80, height: 12 }} />
          ))}
        </div>
        {/* Table rows skeleton */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-6)",
              padding: "var(--space-4) var(--space-6)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flex: 1 }}>
              <div className="skeleton" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
              <div>
                <div className="skeleton" style={{ width: 120, height: 14, marginBottom: 4 }} />
                <div className="skeleton" style={{ width: 160, height: 12 }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: 140, height: 14, marginBottom: 4 }} />
              <div className="skeleton" style={{ width: 100, height: 12 }} />
            </div>
            <div className="skeleton" style={{ width: 80, height: 14 }} />
            <div className="skeleton" style={{ width: 80, height: 24, borderRadius: "var(--radius-full)" }} />
            <div className="skeleton" style={{ width: 30, height: 30, borderRadius: "var(--radius-md)" }} />
            <div className="skeleton" style={{ width: 100, height: 32, borderRadius: "var(--radius-lg)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
