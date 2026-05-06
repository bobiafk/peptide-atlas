import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CategoryShowcase } from "@/components/category-showcase";
import { HomeHero } from "@/components/home-hero";
import { PeptideCard } from "@/components/peptide-card";
import { TrustFeatureRow } from "@/components/trust-feature-row";
import { getCategories, getPeptides } from "@/lib/data";

export default async function HomePage(): Promise<JSX.Element> {
  const [peptides, categories] = await Promise.all([getPeptides(), getCategories()]);
  const featured = peptides
    .slice()
    .sort((a, b) => (a.listingIndex ?? 999) - (b.listingIndex ?? 999))
    .slice(0, 6);
  const studyCount = peptides.reduce((acc, peptide) => acc + (peptide.evidence.totalStudies ?? 0), 0);
  const sortedCategories = categories
    .slice()
    .sort((a, b) => b.count - a.count);

  return (
    <div className="landing-canvas -mx-6 px-6 md:-mx-10 md:px-10 lg:-mx-12 lg:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('/07-dna-peptide%20(1).webp')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      <div className="space-y-14 pb-6">
        <HomeHero
          peptideCount={peptides.length}
          studyCount={studyCount}
          categoryCount={categories.length}
        />

        <section className="space-y-6">
          <SectionHeader
            eyebrow="Featured"
            title="Most-researched peptides today"
            description="Ordered by source listing priority and clinical signal strength."
            ctaHref="/peptides"
            ctaLabel="View all peptides"
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((peptide) => (
              <PeptideCard key={peptide.slug} peptide={peptide} priority />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader
            eyebrow="Therapeutic areas"
            title="Browse by clinical category"
            description="Each landing page reviews mechanisms, top compounds, and trial maturity."
            ctaHref="/categories"
            ctaLabel="All categories"
          />
          <CategoryShowcase categories={sortedCategories.slice(0, 6)} />
        </section>

        <section className="space-y-6">
          <SectionHeader
            eyebrow="Why Peptide Atlas"
            title="Built for evidence, not hype"
            description="Designed with three commitments that apply to every entry."
          />
          <TrustFeatureRow />
        </section>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}): JSX.Element {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-blue">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight md:text-[40px]">{title}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
      </div>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-hairline bg-panel px-4 py-2 text-sm font-medium text-text shadow-[0_6px_20px_rgba(10,132,255,0.06)] transition hover:border-accent-blue/40 hover:text-accent-blue"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
