import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProviderCard } from "@/components/provider-card";
import { getProviders } from "@/lib/data";

export async function generateStaticParams(): Promise<{ state: string }[]> {
  const providers = await getProviders();
  const states = Array.from(
    new Set(providers.map((provider) => provider.state).filter(Boolean) as string[]),
  );
  return states.map((state) => ({ state: state.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  return {
    title: `Providers in ${state.toUpperCase()}`,
    description: `Provider directory filtered by state ${state.toUpperCase()}.`,
  };
}

export default async function ProvidersByStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<JSX.Element> {
  const { state } = await params;
  const stateCode = state.toUpperCase();
  const providers = (await getProviders()).filter((provider) => provider.state === stateCode);
  if (providers.length === 0) notFound();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-blue">
          State directory
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Providers in {stateCode}
        </h1>
        <p className="text-sm text-muted">
          <span className="font-mono text-text">{providers.length}</span> providers listed in this
          state.
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
