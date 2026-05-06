const scoreMap: Record<string, number> = {
  "Strong Evidence": 92,
  "Moderate Evidence": 74,
  "Limited Evidence": 58,
};

export function EvidenceMeter({ strength }: { strength?: string }): JSX.Element {
  const score = strength ? scoreMap[strength] ?? 55 : 55;
  const ringColor = score >= 85 ? "#21C9A5" : score >= 70 ? "#0A84FF" : "#FF7F7F";
  const ringBg = "#E6EEF8";
  return (
    <div className="flex items-center gap-4">
      <div
        className="relative h-18 w-18 rounded-full"
        style={{
          background: `conic-gradient(${ringColor} ${score}%, ${ringBg} ${score}%)`,
        }}
      >
        <div
          className="absolute inset-1 grid place-items-center rounded-full bg-panel text-center"
        />
        <span className="absolute inset-0 grid place-items-center text-sm font-semibold text-text">
          {score}%
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.08em] text-muted">Evidence Score</p>
        <p className="text-sm font-medium text-text">{strength ?? "Limited Evidence"}</p>
      </div>
    </div>
  );
}
