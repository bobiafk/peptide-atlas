import { notFound } from "next/navigation";

import { CompareTable } from "@/components/compare-table";
import { getComparisonBySlug, getComparisons } from "@/lib/data";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const comparisons = await getComparisons();
  return comparisons.map((comparison) => ({ slug: comparison.slug }));
}

export default async function CompareDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) notFound();

  return (
    <div className="space-y-6">
      <CompareTable comparison={comparison} />
      <section className="space-y-4">
        {Object.entries(comparison.sections ?? {}).map(([key, value]) => (
          <article key={key} className="soft-card p-4">
            <h3 className="text-2xl font-semibold capitalize tracking-tight text-text">{key.replaceAll("-", " ")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
