import { ArrowUpRight, GitCompare } from "lucide-react";
import Link from "next/link";

import { getComparisons } from "@/lib/data";

export default async function CompareIndexPage(): Promise<JSX.Element> {
  const comparisons = await getComparisons();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-blue">
          Head-to-head
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Comparisons</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Side-by-side peptide breakdowns highlighting mechanism differences,
          dosing context, and trial maturity.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {comparisons.map((comparison) => (
          <Link
            key={comparison.slug}
            href={`/compare/${comparison.slug}`}
            className="lift-card group flex flex-col gap-3 p-5"
          >
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent-blue/10 to-accent-violet/10 text-accent-blue">
                <GitCompare className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-accent-blue" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-text">{comparison.title}</h2>
            {comparison.summary ? (
              <p className="line-clamp-3 text-sm text-muted">{comparison.summary}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
