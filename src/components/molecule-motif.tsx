export function MoleculeMotif({
  className = "",
}: {
  className?: string;
}): JSX.Element {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="m-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7048E8" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="m-node-blue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5BA8FF" />
          <stop offset="100%" stopColor="#0A84FF" />
        </radialGradient>
        <radialGradient id="m-node-violet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9C7CF2" />
          <stop offset="100%" stopColor="#7048E8" />
        </radialGradient>
        <radialGradient id="m-node-mint" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5DDABA" />
          <stop offset="100%" stopColor="#21C9A5" />
        </radialGradient>
      </defs>
      <g stroke="url(#m-line)" strokeWidth="1.6">
        <line x1="160" y1="60" x2="80" y2="120" />
        <line x1="160" y1="60" x2="240" y2="120" />
        <line x1="80" y1="120" x2="80" y2="220" />
        <line x1="240" y1="120" x2="240" y2="220" />
        <line x1="80" y1="220" x2="160" y2="270" />
        <line x1="240" y1="220" x2="160" y2="270" />
        <line x1="160" y1="60" x2="160" y2="170" strokeDasharray="3 4" />
        <line x1="80" y1="120" x2="240" y2="220" strokeDasharray="3 4" />
        <line x1="240" y1="120" x2="80" y2="220" strokeDasharray="3 4" />
      </g>
      <circle cx="160" cy="60" r="9" fill="url(#m-node-blue)" />
      <circle cx="80" cy="120" r="9" fill="url(#m-node-violet)" />
      <circle cx="240" cy="120" r="9" fill="url(#m-node-mint)" />
      <circle cx="80" cy="220" r="9" fill="url(#m-node-blue)" />
      <circle cx="240" cy="220" r="9" fill="url(#m-node-violet)" />
      <circle cx="160" cy="270" r="9" fill="url(#m-node-mint)" />
      <circle cx="160" cy="170" r="6" fill="#FFFFFF" stroke="#0A84FF" strokeOpacity="0.5" strokeWidth="1.2" />
    </svg>
  );
}
