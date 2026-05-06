export default function Loading(): JSX.Element {
  return (
    <div className="lift-card flex items-center gap-3 p-6 text-sm text-muted">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-blue/60" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-accent-blue" />
      </span>
      Loading peptide data…
    </div>
  );
}
