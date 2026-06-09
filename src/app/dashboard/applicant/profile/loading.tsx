export default function ProfileLoading() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="skeleton" style={{ width: 160, height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 300, height: 20 }} />
      </div>

      <div className="card" style={{ padding: "var(--space-8)" }}>
        {/* Avatar skeleton */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", marginBottom: "var(--space-8)" }}>
          <div className="skeleton" style={{ width: 80, height: 80, borderRadius: "50%" }} />
          <div>
            <div className="skeleton" style={{ width: 180, height: 20, marginBottom: 8 }} />
            <div className="skeleton" style={{ width: 220, height: 16 }} />
          </div>
        </div>

        {/* Form fields skeleton */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="skeleton" style={{ width: 100, height: 14, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: "100%", height: 42, borderRadius: "var(--radius-lg)" }} />
            </div>
          ))}
        </div>

        <div className="skeleton" style={{ width: 140, height: 44, borderRadius: "var(--radius-lg)", marginTop: "var(--space-8)" }} />
      </div>
    </div>
  );
}
