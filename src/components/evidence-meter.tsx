import type { PeptideEvidence } from "@/lib/types";

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

export function EvidenceMeter({
  evidence,
}: {
  evidence: PeptideEvidence;
}): JSX.Element {
  const score = evidence.strength ? SCORE_MAP[evidence.strength] ?? 50 : 50;
  const color = colorFor(score);
  const size = 132;
  const thickness = 10;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id="ev-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
          </defs>
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
            stroke="url(#ev-grad)"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p
              className="font-mono text-[28px] font-semibold leading-none"
              style={{ color }}
            >
              {score}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
              / 100
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.12em] text-muted">Evidence Score</p>
        <p className="text-xl font-semibold tracking-tight text-text">
          {evidence.strength ?? "Limited Evidence"}
        </p>
        <div className="flex flex-wrap gap-2">
          {evidence.phase ? <span className="stat-pill">{evidence.phase}</span> : null}
          {evidence.totalStudies ? (
            <span className="stat-pill is-violet">{evidence.totalStudies} studies</span>
          ) : null}
          {evidence.humanStudies ? (
            <span className="stat-pill is-mint">{evidence.humanStudies} in humans</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
