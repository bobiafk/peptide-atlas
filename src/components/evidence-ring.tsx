interface EvidenceRingProps {
  strength?: string;
  size?: number;
  thickness?: number;
  showLabel?: boolean;
}

const SCORE_MAP: Record<string, number> = {
  "Strong Evidence": 92,
  "Moderate Evidence": 74,
  "Limited Evidence": 55,
};

function colorFor(score: number): string {
  if (score >= 85) return "#8FF5E3";
  if (score >= 70) return "#9FC6FF";
  return "#C2B3FF";
}

export function EvidenceRing({
  strength,
  size = 56,
  thickness = 5,
  showLabel = false,
}: EvidenceRingProps): JSX.Element {
  const score = strength ? SCORE_MAP[strength] ?? 50 : 50;
  const color = colorFor(score);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1f3158"
            strokeWidth={thickness}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            fill="transparent"
            style={{ transition: "stroke-dashoffset 600ms ease" }}
          />
        </svg>
        <span
          className="absolute inset-0 grid place-items-center font-mono font-semibold"
          style={{ fontSize: size <= 48 ? 10 : 11, color }}
        >
          {score}
        </span>
      </div>
      {showLabel ? (
        <div className="leading-tight">
          <p className="text-[10px] uppercase tracking-[0.1em] text-muted">Evidence</p>
          <p className="text-xs font-medium text-text">{strength ?? "Limited"}</p>
        </div>
      ) : null}
    </div>
  );
}
