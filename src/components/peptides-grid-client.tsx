"use client";

import { motion } from "framer-motion";
import Fuse from "fuse.js";
import { useMemo } from "react";
import { parseAsString, useQueryState } from "nuqs";

import { BentoGrid } from "@/components/bento-grid";
import { FilterBar } from "@/components/filter-bar";
import { PeptideCard } from "@/components/peptide-card";
import type { Peptide } from "@/lib/types";

export function PeptidesGridClient({
  peptides,
  categories,
}: {
  peptides: Peptide[];
  categories: string[];
}): JSX.Element {
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const [category, setCategory] = useQueryState("category", parseAsString.withDefault(""));
  const [availability, setAvailability] = useQueryState("availability", parseAsString.withDefault(""));

  const fuse = useMemo(
    () =>
      new Fuse(peptides, {
        keys: ["name", "shortDescription", "benefits.label"],
        threshold: 0.32,
      }),
    [peptides],
  );

  const filtered = useMemo(() => {
    const searched = search.trim() ? fuse.search(search.trim()).map((result) => result.item) : peptides;
    return searched.filter((peptide) => {
      const categoryOk = category ? peptide.category.slug === category : true;
      const availabilityOk = availability ? peptide.availability === availability : true;
      return categoryOk && availabilityOk;
    });
  }, [availability, category, fuse, peptides, search]);

  const availabilityOptions = useMemo(
    () => Array.from(new Set(peptides.map((item) => item.availability))),
    [peptides],
  );

  return (
    <div className="space-y-6">
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        availability={availability}
        onAvailabilityChange={setAvailability}
        categories={categories}
        availabilities={availabilityOptions}
      />
      <BentoGrid>
        {filtered.map((peptide, index) => (
          <motion.div
            key={peptide.slug}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.015, 0.3) }}
          >
            <PeptideCard peptide={peptide} priority={Boolean((peptide.listingIndex ?? 999) < 6)} />
          </motion.div>
        ))}
      </BentoGrid>
    </div>
  );
}
