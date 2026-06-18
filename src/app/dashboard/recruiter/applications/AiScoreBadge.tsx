'use client';

interface AiScoreBadgeProps {
  score: number | null;
  classification: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function AiScoreBadge({ score, classification, size = 'md' }: AiScoreBadgeProps) {
  if (score === null || score === undefined) {
    return (
      <div className={`ai-score-badge pending ${size}`}>
        <div className="ai-score-ring">
          <svg viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="15.5"
              fill="none"
              stroke="rgba(99, 102, 241, 0.15)"
              strokeWidth="3"
            />
          </svg>
          <span className="ai-score-text">—</span>
        </div>
        <span className="ai-score-label">Pending</span>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 15.5;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  let color = '#ef4444'; // red
  let label = 'Not Match';
  if (score >= 75) {
    color = '#10b981'; // green
    label = 'Match';
  } else if (score >= 50) {
    color = '#f59e0b'; // amber
    label = 'Near';
  }

  return (
    <div className={`ai-score-badge ${size}`}>
      <div className="ai-score-ring">
        <svg viewBox="0 0 36 36">
          {/* Background circle */}
          <circle
            cx="18" cy="18" r="15.5"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx="18" cy="18" r="15.5"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <span className="ai-score-text" style={{ color }}>{score}</span>
      </div>
      <span className="ai-score-label" style={{ color }}>{label}</span>
    </div>
  );
}
