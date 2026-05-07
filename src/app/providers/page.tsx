import type { Metadata } from "next";

import { ProvidersGridClient } from "@/components/providers-grid-client";
import { getPeptides, getProviders } from "@/lib/data";

export const metadata: Metadata = {
  title: "Providers",
  description:
    "Browse peptide providers by type, state, and supplied peptides.",
};

export default async function ProvidersPage(): Promise<JSX.Element> {
  const [providers, peptides] = await Promise.all([getProviders(), getPeptides()]);
  const types = Array.from(new Set(providers.map((provider) => provider.type))).sort((a, b) =>
    a.localeCompare(b),
  );
  const states = Array.from(
    new Set(providers.map((provider) => provider.state).filter(Boolean) as string[]),
  ).sort((a, b) => a.localeCompare(b));
  const peptideOptions = peptides
    .filter((peptide) => (peptide.providerSlugs?.length ?? 0) > 0)
    .map((peptide) => ({
      slug: peptide.slug,
      name: peptide.displayName || peptide.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-blue">
          Directory
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Provider Directory</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Explore providers, filter by state and provider type, and discover which peptides each
          clinic or pharmacy references in their public listing.
        </p>
      </header>

      <ProvidersGridClient
        providers={providers}
        types={types}
        states={states}
        peptideOptions={peptideOptions}
      />
    </div>
  );
}
