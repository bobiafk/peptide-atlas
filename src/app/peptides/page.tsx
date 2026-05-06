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
    <div className="space-y-6">
      <header className="soft-card p-6">
        <h1 className="text-4xl font-semibold tracking-tight">All Peptides</h1>
        <p className="mt-2 text-sm text-muted">{peptides.length} peptides found</p>
      </header>
      <PeptidesGridClient
        peptides={peptides}
        categories={categories.map((category) => category.slug)}
      />
    </div>
  );
}
