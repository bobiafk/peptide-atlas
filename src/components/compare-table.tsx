import { GitCompare } from "lucide-react";

import type { Comparison } from "@/lib/types";

export function CompareTable({ comparison }: { comparison: Comparison }): JSX.Element {
  const quickComparison =
    comparison.sections?.["quick-comparison"] ?? "No quick comparison table available.";

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-hairline p-7 md:p-9"
      style={{
        background:
          "linear-gradient(140deg, rgba(110,168,255,0.2) 0%, rgba(157,133,255,0.2) 50%, rgba(67,216,192,0.16) 100%)",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0a1326]/75 text-accent-blue shadow-[0_8px_18px_rgba(0,0,0,0.3)]">
          <GitCompare className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div className="flex-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-blue">
            Comparison
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-text md:text-4xl">
            {comparison.title}
          </h1>
        </div>
      </div>
      {comparison.summary ? (
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{comparison.summary}</p>
      ) : null}
      <pre className="mt-5 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-[#0a1326]/75 p-5 font-mono text-xs leading-relaxed text-muted backdrop-blur">
        {quickComparison}
      </pre>
    </section>
  );
}
