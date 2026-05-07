import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AvailabilityChip } from "@/components/availability-chip";
import { EvidenceMeter } from "@/components/evidence-meter";
import { FAQAccordion } from "@/components/faq-accordion";
import { Prose } from "@/components/prose";
import { StickyTOC } from "@/components/sticky-toc";
import { StudyCitation } from "@/components/study-citation";
import { getCategoryStyle } from "@/lib/category-style";
import { getPeptideBySlug, getPeptides, getProvidersForPeptide } from "@/lib/data";

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
    title: `${peptide.displayName || peptide.name} | Peptide Atlas`,
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
  const providers = await getProvidersForPeptide(peptide.slug);

  const related = peptides
    .filter((item) => peptide.relatedSlugs.includes(item.slug))
    .slice(0, 6);
  const style = getCategoryStyle(peptide.category.slug);
  const CategoryIcon = style.icon;
  const title = peptide.displayName || peptide.name;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalEntity",
    name: title,
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
        <section
          className="relative overflow-hidden rounded-3xl border border-hairline p-8 md:p-10"
          style={{
            background: `linear-gradient(140deg, ${style.surfaceFrom} 0%, ${style.surfaceTo} 65%, rgba(10,16,33,0.88) 100%)`,
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/categories/${peptide.category.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1"
              style={{
                background: style.iconBg,
                color: style.iconColor,
                boxShadow: "0 0 0 1px rgba(173,205,255,0.22) inset",
              }}
            >
              <CategoryIcon className="h-3 w-3" strokeWidth={2} />
              {peptide.category.name}
            </Link>
            <AvailabilityChip availability={peptide.availability} />
            {peptide.evidence.phase ? (
              <span className="stat-pill">{peptide.evidence.phase}</span>
            ) : null}
          </div>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-[64px] md:leading-[1.05]">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            {peptide.longDescription}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-6">
            <EvidenceMeter evidence={peptide.evidence} />
          </div>
        </section>

        <section id="mechanisms" className="lift-card p-7">
          <SectionHeading eyebrow="Mechanism" title="Research overview & mechanisms" />
          <Prose className="mt-4">
            <p>{peptide.mechanisms}</p>
          </Prose>
        </section>

        <section id="benefits" className="lift-card p-7">
          <SectionHeading eyebrow="Benefits" title="Reported research benefits" />
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {peptide.benefits.map((benefit) => (
              <li
                key={benefit.label}
                className="flex items-start gap-3 rounded-2xl border border-hairline bg-panel-muted p-4 text-sm"
              >
                <span
                  className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ background: style.accent }}
                />
                <div>
                  <p className="text-text">{benefit.label}</p>
                  {benefit.evidence ? (
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                      {benefit.evidence}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="evidence" className="lift-card p-7">
          <SectionHeading eyebrow="Evidence" title="Clinical evidence" />
          <div className="mt-5 rounded-2xl border border-hairline bg-panel-muted p-5 text-sm leading-relaxed text-muted">
            {peptide.evidence.summary || "Evidence summary not available."}
          </div>
          <div className="mt-5 space-y-3">
            {peptide.evidence.keyStudies.slice(0, 8).map((study) => (
              <StudyCitation key={study.title} study={study} />
            ))}
          </div>
        </section>

        <section id="fda" className="lift-card p-7">
          <SectionHeading eyebrow="Regulatory" title="FDA regulatory status" />
          <p className="mt-4 inline-flex rounded-full bg-panel-muted px-3 py-1 text-sm font-medium text-text">
            {peptide.fdaStatus.status}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{peptide.fdaStatus.notes}</p>
        </section>

        <section id="faq" className="lift-card p-7">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
          <div className="mt-5">
            <FAQAccordion items={peptide.faq} />
          </div>
        </section>

        <section id="providers" className="lift-card p-7">
          <SectionHeading eyebrow="Providers" title="Where to source" />
          {providers.length > 0 ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {providers.slice(0, 12).map((provider) => (
                <Link
                  key={provider.slug}
                  href={`/providers/${provider.slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-hairline bg-panel-muted px-4 py-3 text-sm text-text transition hover:border-accent-blue/50"
                >
                  <span className="line-clamp-1">
                    {provider.name}
                    {provider.state ? ` · ${provider.state}` : ""}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted transition group-hover:text-accent-blue" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              No provider descriptions currently mention this peptide.
            </p>
          )}
        </section>

        <section id="related" className="lift-card p-7">
          <SectionHeading eyebrow="Related" title="Related peptides" />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/peptides/${item.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-hairline bg-panel-muted px-4 py-3 text-sm text-text transition hover:border-accent-blue/50"
              >
                <span>{item.displayName || item.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted transition group-hover:text-accent-blue" />
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
          { id: "providers", label: "Where to source" },
          { id: "related", label: "Related" },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}): JSX.Element {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-blue">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
    </div>
  );
}
