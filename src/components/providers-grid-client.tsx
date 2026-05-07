"use client";

import { motion } from "framer-motion";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import { useMemo } from "react";
import { parseAsString, useQueryState } from "nuqs";

import { BentoGrid } from "@/components/bento-grid";
import { ProviderCard } from "@/components/provider-card";
import type { Provider } from "@/lib/types";

interface PeptideOption {
  slug: string;
  name: string;
}

export function ProvidersGridClient({
  providers,
  types,
  states,
  peptideOptions,
}: {
  providers: Provider[];
  types: string[];
  states: string[];
  peptideOptions: PeptideOption[];
}): JSX.Element {
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const [type, setType] = useQueryState("type", parseAsString.withDefault(""));
  const [state, setState] = useQueryState("state", parseAsString.withDefault(""));
  const [peptide, setPeptide] = useQueryState("peptide", parseAsString.withDefault(""));

  const fuse = useMemo(
    () =>
      new Fuse(providers, {
        keys: ["name", "description", "city", "state", "suppliedPeptideSlugs"],
        threshold: 0.32,
      }),
    [providers],
  );

  const filtered = useMemo(() => {
    const searched = search.trim()
      ? fuse.search(search.trim()).map((result) => result.item)
      : providers;
    return searched.filter((provider) => {
      const typeOk = type ? provider.type.toLowerCase() === type.toLowerCase() : true;
      const stateOk = state ? provider.state?.toUpperCase() === state.toUpperCase() : true;
      const peptideOk = peptide ? provider.suppliedPeptideSlugs.includes(peptide) : true;
      return typeOk && stateOk && peptideOk;
    });
  }, [fuse, peptide, providers, search, state, type]);

  const hasFilters = Boolean(search || type || state || peptide);

  return (
    <div className="space-y-6">
      <div className="lift-card flex flex-col gap-3 p-5 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search provider name or peptide..."
            className="w-full rounded-full border border-hairline bg-panel-muted py-2.5 pl-10 pr-4 text-sm text-text outline-none ring-accent-blue/30 focus:ring"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="rounded-full border border-hairline bg-panel-muted px-4 py-2.5 text-sm text-text outline-none ring-accent-blue/30 focus:ring"
          >
            <option value="">All types</option>
            {types.map((entry) => (
              <option key={entry} value={entry.toLowerCase()}>
                {entry}
              </option>
            ))}
          </select>
          <select
            value={state}
            onChange={(event) => setState(event.target.value)}
            className="rounded-full border border-hairline bg-panel-muted px-4 py-2.5 text-sm text-text outline-none ring-accent-blue/30 focus:ring"
          >
            <option value="">All states</option>
            {states.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <select
            value={peptide}
            onChange={(event) => setPeptide(event.target.value)}
            className="rounded-full border border-hairline bg-panel-muted px-4 py-2.5 text-sm text-text outline-none ring-accent-blue/30 focus:ring"
          >
            <option value="">Supplies any peptide</option>
            {peptideOptions.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.name}
              </option>
            ))}
          </select>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setType("");
                setState("");
                setPeptide("");
              }}
              className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-2.5 text-xs font-medium text-muted transition hover:border-accent-coral/40 hover:text-accent-coral"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <p className="text-sm text-muted">
        Showing <span className="font-mono text-text">{filtered.length}</span> providers.
      </p>

      <BentoGrid>
        {filtered.map((provider, index) => (
          <motion.div
            key={provider.slug}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.01, 0.28) }}
          >
            <ProviderCard provider={provider} />
          </motion.div>
        ))}
      </BentoGrid>
    </div>
  );
}
