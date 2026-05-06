import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AvailabilityChip } from "@/components/availability-chip";
import { EvidenceMeter } from "@/components/evidence-meter";
import { FAQAccordion } from "@/components/faq-accordion";
import { Prose } from "@/components/prose";
import { StickyTOC } from "@/components/sticky-toc";
import { StudyCitation } from "@/components/study-citation";
import { getPeptideBySlug, getPeptides } from "@/lib/data";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const peptides = await getPeptides();
  return peptides.map((peptide) => ({ slug: peptide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const peptide = await getPeptideBySlug(slug);
  if (!peptide) return {};
  return {
    title: `${peptide.displayName || peptide.name} | Peptide Script`,
    description: peptide.shortDescription,
  };
}

export default async function PeptideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> {
  const { slug } = await params;
  const peptide = await getPeptideBySlug(slug);
  const peptides = await getPeptides();
  if (!peptide) notFound();

  const related = peptides
    .filter((item) => peptide.relatedSlugs.includes(item.slug))
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalEntity",
    name: peptide.displayName || peptide.name,
    description: peptide.longDescription,
    url: `https://example.com/peptides/${peptide.slug}`,
    additionalProperty: [
      { name: "Availability", value: peptide.availability },
      { name: "Category", value: peptide.category.name },
      { name: "FDA Status", value: peptide.fdaStatus.status },
    ],
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="space-y-8">
        <section className="soft-card p-6">
          <div className="flex flex-wrap items-center gap-3">
            <AvailabilityChip availability={peptide.availability} />
            <span className="text-xs uppercase tracking-[0.08em] text-muted">{peptide.category.name}</span>
          </div>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">{peptide.displayName || peptide.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{peptide.longDescription}</p>
        </section>

        <section id="mechanisms" className="soft-card p-6">
          <h2 className="text-3xl font-semibold tracking-tight">Research Overview & Mechanisms</h2>
          <Prose className="mt-3">
            <p>{peptide.mechanisms}</p>
          </Prose>
        </section>

        <section id="benefits" className="soft-card p-6">
          <h2 className="text-3xl font-semibold tracking-tight">Reported Research Benefits</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {peptide.benefits.map((benefit) => (
              <li key={benefit.label} className="rounded-2xl border border-hairline bg-panel-muted p-3 text-sm text-muted">
                <p className="text-text">{benefit.label}</p>
                {benefit.evidence ? <p className="mt-1 font-mono text-xs">{benefit.evidence}</p> : null}
              </li>
            ))}
          </ul>
        </section>

        <section id="evidence" className="soft-card p-6">
          <h2 className="text-3xl font-semibold tracking-tight">Clinical Evidence</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <EvidenceMeter strength={peptide.evidence.strength} />
            <div className="rounded-2xl border border-hairline bg-panel-muted p-4 text-sm text-muted">
              <p className="font-mono text-xs uppercase tracking-[0.08em]">Summary</p>
              <p className="mt-2 leading-relaxed">{peptide.evidence.summary || "Evidence summary not available."}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {peptide.evidence.keyStudies.slice(0, 8).map((study) => (
              <StudyCitation key={study.title} study={study} />
            ))}
          </div>
        </section>

        <section id="fda" className="soft-card p-6">
          <h2 className="text-3xl font-semibold tracking-tight">FDA Regulatory Status</h2>
          <p className="mt-3 text-sm text-text">{peptide.fdaStatus.status}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{peptide.fdaStatus.notes}</p>
        </section>

        <section id="faq" className="soft-card p-6">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
          <FAQAccordion items={peptide.faq} />
        </section>

        <section id="related" className="soft-card p-6">
          <h2 className="text-3xl font-semibold tracking-tight">Related Peptides</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/peptides/${item.slug}`}
                className="rounded-2xl border border-hairline bg-panel-muted px-3 py-2 text-sm text-muted hover:border-accent-blue hover:text-text"
              >
                {item.displayName || item.name}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <StickyTOC
        items={[
          { id: "mechanisms", label: "Mechanisms" },
          { id: "benefits", label: "Benefits" },
          { id: "evidence", label: "Clinical Evidence" },
          { id: "fda", label: "FDA Status" },
          { id: "faq", label: "FAQ" },
          { id: "related", label: "Related" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
