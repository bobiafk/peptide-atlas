import type { Comparison } from "@/lib/types";

export function CompareTable({ comparison }: { comparison: Comparison }): JSX.Element {
  const quickComparison = comparison.sections?.["quick-comparison"] ?? "No quick comparison table available.";

  return (
    <section className="soft-card p-5">
      <h3 className="text-3xl font-semibold tracking-tight text-text">{comparison.title}</h3>
      {comparison.summary ? <p className="mt-2 text-sm text-muted">{comparison.summary}</p> : null}
      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-panel-muted p-4 text-xs leading-relaxed text-muted">
        {quickComparison}
      </pre>
    </section>
  );
}
