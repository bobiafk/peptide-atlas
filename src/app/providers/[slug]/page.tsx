import type { Metadata } from "next";
import { ArrowUpRight, BadgeCheck, Building2, MapPin, Stethoscope } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPeptideBySlug, getProviderBySlug, getProviders } from "@/lib/data";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const providers = await getProviders();
  return providers.map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return {};
  return {
    title: `${provider.name} | Provider`,
    description: provider.description,
  };
}

function ProviderTypeIcon({ type }: { type: string }): JSX.Element {
  if (type === "Physician") return <Stethoscope className="h-4 w-4" strokeWidth={1.8} />;
  if (type === "Pharmacy") return <Building2 className="h-4 w-4" strokeWidth={1.8} />;
  return <BadgeCheck className="h-4 w-4" strokeWidth={1.8} />;
}

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const peptides = await Promise.all(
    provider.suppliedPeptideSlugs.map(async (entry) => getPeptideBySlug(entry)),
  );
  const linkedPeptides = peptides.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const similarProviders = await Promise.all(
    provider.similarSlugs.slice(0, 8).map(async (entry) => getProviderBySlug(entry)),
  );
  const similar = similarProviders.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <div className="space-y-8">
      <section className="lift-card space-y-5 p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-panel-muted px-2.5 py-1 text-xs text-muted">
            <ProviderTypeIcon type={provider.type} />
            {provider.type}
          </span>
          {provider.verified ? (
            <span className="inline-flex rounded-full border border-[#2d625a] bg-[#0d2522] px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-[#8ff5e3]">
              Verified
            </span>
          ) : null}
          {provider.state ? (
            <Link
              href={`/providers/state/${provider.state.toLowerCase()}`}
              className="inline-flex rounded-full border border-hairline bg-panel-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-muted hover:border-accent-blue hover:text-accent-blue"
            >
              {provider.state}
            </Link>
          ) : null}
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{provider.name}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">{provider.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          {provider.city || provider.state ? (
            <p className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {[provider.city, provider.state].filter(Boolean).join(", ")}
            </p>
          ) : null}
          {provider.website ? (
            <a
              href={provider.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-accent-blue hover:underline"
            >
              Visit website
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </section>

      {provider.fullAddress ? (
        <section className="lift-card p-6">
          <h2 className="text-xl font-semibold tracking-tight">Address</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{provider.fullAddress}</p>
        </section>
      ) : null}

      <section className="lift-card p-6">
        <h2 className="text-xl font-semibold tracking-tight">Peptides supplied</h2>
        {linkedPeptides.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {linkedPeptides.map((peptide) => (
              <Link
                key={peptide.slug}
                href={`/peptides/${peptide.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-hairline bg-panel-muted px-4 py-3 text-sm text-text transition hover:border-accent-blue/50"
              >
                <span>{peptide.displayName || peptide.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted transition group-hover:text-accent-blue" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">
            No peptide matches were detected in this provider&apos;s public description.
          </p>
        )}
      </section>

      {similar.length > 0 ? (
        <section className="lift-card p-6">
          <h2 className="text-xl font-semibold tracking-tight">Similar providers</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {similar.map((entry) => (
              <Link
                key={entry.slug}
                href={`/providers/${entry.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-hairline bg-panel-muted px-4 py-3 text-sm text-text transition hover:border-accent-blue/50"
              >
                <span>{entry.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted transition group-hover:text-accent-blue" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
