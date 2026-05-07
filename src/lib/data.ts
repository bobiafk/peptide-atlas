import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";

import type { Category, Comparison, Peptide, Provider } from "@/lib/types";

const DATA_PATH = path.join(process.cwd(), "data");

async function readJsonFile<T>(fileName: string): Promise<T> {
  const file = await fs.readFile(path.join(DATA_PATH, fileName), "utf8");
  return JSON.parse(file) as T;
}

export const getPeptides = cache(async (): Promise<Peptide[]> => {
  return readJsonFile<Peptide[]>("peptides.json");
});

export const getCategories = cache(async (): Promise<Category[]> => {
  return readJsonFile<Category[]>("categories.json");
});

export const getComparisons = cache(async (): Promise<Comparison[]> => {
  return readJsonFile<Comparison[]>("comparisons.json");
});

export const getProviders = cache(async (): Promise<Provider[]> => {
  return readJsonFile<Provider[]>("providers.json");
});

export const getPeptideBySlug = cache(async (slug: string): Promise<Peptide | undefined> => {
  const peptides = await getPeptides();
  return peptides.find((peptide) => peptide.slug === slug);
});

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | undefined> => {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
});

export const getComparisonBySlug = cache(
  async (slug: string): Promise<Comparison | undefined> => {
    const comparisons = await getComparisons();
    return comparisons.find((comparison) => comparison.slug === slug);
  },
);

export const getProviderBySlug = cache(async (slug: string): Promise<Provider | undefined> => {
  const providers = await getProviders();
  return providers.find((provider) => provider.slug === slug);
});

export const getProvidersForPeptide = cache(async (peptideSlug: string): Promise<Provider[]> => {
  const providers = await getProviders();
  return providers.filter((provider) => provider.suppliedPeptideSlugs.includes(peptideSlug));
});
