export default function ApplicationsLoading() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="skeleton" style={{ width: 200, height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: 280, height: 20 }} />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                padding: "var(--space-4) var(--space-6)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: "var(--radius-lg)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: 180, height: 16, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: 120, height: 14 }} />
              </div>
              <div className="skeleton" style={{ width: 80, height: 14 }} />
              <div className="skeleton" style={{ width: 80, height: 24, borderRadius: "var(--radius-full)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
