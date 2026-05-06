import type { Metadata } from "next";

import { PeptidesGridClient } from "@/components/peptides-grid-client";
import { getCategories, getPeptides } from "@/lib/data";

export const metadata: Metadata = {
  title: "Peptides",
  description: "Explore all peptide profiles with category and availability filters.",
};

export default async function PeptidesPage(): Promise<JSX.Element> {
  const [peptides, categories] = await Promise.all([getPeptides(), getCategories()]);
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-blue">
            Library
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">All Peptides</h1>
          <p className="text-sm text-muted">
            <span className="font-mono text-text">{peptides.length}</span> compounds across{" "}
            <span className="font-mono text-text">{categories.length}</span> therapeutic categories.
          </p>
        </div>
      </header>
      <PeptidesGridClient
        peptides={peptides}
        categories={categories.map((category) => category.slug)}
      />
    </div>
  );
}
