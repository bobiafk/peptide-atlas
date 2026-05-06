import Link from "next/link";

import { PeptideCard } from "@/components/peptide-card";
import { getCategories, getPeptides } from "@/lib/data";

export default async function HomePage() {
  const [peptides, categories] = await Promise.all([getPeptides(), getCategories()]);
  const featured = peptides
    .sort((a, b) => (a.listingIndex ?? 999) - (b.listingIndex ?? 999))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="soft-card overflow-hidden p-2">
        <div className="grid gap-8 rounded-[18px] bg-linear-to-r from-[#EAF3FF] via-[#F6FBFF] to-[#EEFDF7] p-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-accent-blue/15 bg-white/70 px-3 py-1 text-xs font-medium text-accent-blue">
              Evidence-first. Patient-focused.
            </span>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              102 peptides.
              <br />
              The science, distilled.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted">
              Curated peptide data with mechanisms, trial context, and practical research summaries.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/peptides"
                className="rounded-full bg-accent-blue px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_20px_rgba(10,132,255,0.25)]"
              >
                Explore Peptides
              </Link>
              <Link
                href="/compare"
                className="rounded-full border border-hairline bg-white px-5 py-2.5 text-sm text-text"
              >
                Compare Compounds
              </Link>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.08em] text-muted">Top Categories</p>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex items-center justify-between rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-text hover:border-accent-blue/35"
                  >
                    <span>{category.name}</span>
                    <span className="font-mono text-xs text-muted">{category.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight">Featured Peptides</h2>
        <p className="text-sm text-muted">Ordered by source listing priority.</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((peptide) => (
            <PeptideCard key={peptide.slug} peptide={peptide} priority />
          ))}
        </div>
      </section>

      <section className="soft-card grid gap-3 p-5 md:grid-cols-3">
        <div className="rounded-2xl bg-panel-muted p-4">
          <h3 className="text-sm font-semibold text-text">Evidence-based</h3>
          <p className="mt-1 text-sm text-muted">We prioritize peer-reviewed and clinical studies.</p>
        </div>
        <div className="rounded-2xl bg-panel-muted p-4">
          <h3 className="text-sm font-semibold text-text">Transparent</h3>
          <p className="mt-1 text-sm text-muted">Methods, sample sizes, and status always visible.</p>
        </div>
        <div className="rounded-2xl bg-panel-muted p-4">
          <h3 className="text-sm font-semibold text-text">Patient-friendly</h3>
          <p className="mt-1 text-sm text-muted">Readable summaries without losing scientific precision.</p>
        </div>
      </section>
    </div>
  );
}
