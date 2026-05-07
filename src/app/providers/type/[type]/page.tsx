import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProviderCard } from "@/components/provider-card";
import { getProviders } from "@/lib/data";
import { providerSlugToType } from "@/lib/provider-utils";

export async function generateStaticParams(): Promise<{ type: string }[]> {
  const providers = await getProviders();
  const types = Array.from(new Set(providers.map((provider) => provider.type)));
  return types.map((type) => ({ type: type.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const label = providerSlugToType(type) ?? type;
  return {
    title: `${label} Providers`,
    description: `Directory of ${label} providers.`,
  };
}

export default async function ProvidersByTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<JSX.Element> {
  const { type } = await params;
  const label = providerSlugToType(type);
  if (!label) notFound();
  const providers = (await getProviders()).filter((provider) => provider.type === label);
  if (providers.length === 0) notFound();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-blue">
          Provider type
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{label} Providers</h1>
        <p className="text-sm text-muted">
          <span className="font-mono text-text">{providers.length}</span> providers in this
          category.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard key={provider.slug} provider={provider} />
        ))}
      </div>
    </div>
  );
}
