import Link from "next/link";

import { getComparisons } from "@/lib/data";

export default async function CompareIndexPage(): Promise<JSX.Element> {
  const comparisons = await getComparisons();

  return (
    <div className="space-y-6">
      <header className="soft-card p-6">
        <h1 className="text-4xl font-semibold tracking-tight">Comparisons</h1>
        <p className="mt-2 text-sm text-muted">Head-to-head peptide breakdowns.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {comparisons.map((comparison) => (
          <Link
            key={comparison.slug}
            href={`/compare/${comparison.slug}`}
            className="soft-card p-4 hover:border-accent-blue"
          >
            <h2 className="text-lg font-medium text-text">{comparison.title}</h2>
            {comparison.summary ? <p className="mt-2 text-sm text-muted">{comparison.summary}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
