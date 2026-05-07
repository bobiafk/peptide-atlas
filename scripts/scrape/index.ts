import fs from "node:fs/promises";
import path from "node:path";

import pLimit from "p-limit";

import { DATA_DIR } from "./constants";
import { ensureDataDirectories } from "./fetch";
import { parseCategoryPage } from "./parse-category";
import { parseComparisonPage } from "./parse-compare";
import { parsePeptideDetail } from "./parse-detail";
import { parseListingPage } from "./parse-listing";
import { buildProviderFromSeed } from "./parse-provider-detail";
import { parseAllProvidersListings } from "./parse-providers-listing";
import { enrichPeptideProviderLinks } from "./peptide-supply";
import {
  categoriesSchema,
  comparisonsSchema,
  peptideSchema,
  peptidesSchema,
  providersSchema,
  providerSchema,
} from "./schema";

interface ValidationErrorEntry {
  scope: "peptide" | "category" | "comparison" | "provider";
  slug: string;
  issues: string[];
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(task: () => Promise<T>, attempts = 4): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      await sleep(700 * (i + 1));
    }
  }
  throw lastError;
}

async function writeJson(fileName: string, data: unknown): Promise<void> {
  const absolutePath = path.join(DATA_DIR, fileName);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, JSON.stringify(data, null, 2), "utf8");
}

async function run(): Promise<void> {
  await ensureDataDirectories();

  const errors: ValidationErrorEntry[] = [];
  const { peptides: seeds, categories: categorySeeds } = await parseListingPage();
  console.log(`Found ${seeds.length} peptide cards on listing page.`);

  const peptideLimit = pLimit(4);
  const peptideResults = await Promise.all(
    seeds.map((seed) =>
      peptideLimit(async () => {
        try {
          const parsed = await withRetry(() => parsePeptideDetail(seed));
          const validated = peptideSchema.parse(parsed);
          return validated;
        } catch (error) {
          const issues =
            error instanceof Error ? [error.message] : ["Unknown detail parsing error."];
          errors.push({ scope: "peptide", slug: seed.slug, issues });
          return null;
        }
      }),
    ),
  );
  const peptides = peptideResults.filter((item): item is NonNullable<typeof item> => Boolean(item));
  peptidesSchema.parse(peptides);

  const inferredCategoryMap = new Map(
    peptides.map((peptide) => [peptide.category.slug, peptide.category.name]),
  );
  const mergedCategorySeeds = [
    ...categorySeeds,
    ...Array.from(inferredCategoryMap.entries()).map(([slug, name]) => ({
      slug,
      name,
      description: "",
      count: peptides.filter((item) => item.category.slug === slug).length,
      url: `https://thepeptidelist.com/peptides/category/${slug}`,
    })),
  ].filter(
    (seed, index, list) => list.findIndex((entry) => entry.slug === seed.slug) === index,
  );

  const categoryLimit = pLimit(3);
  const categoryResults = await Promise.all(
    mergedCategorySeeds.map((seed) =>
      categoryLimit(async () => {
        try {
          return await withRetry(() => parseCategoryPage(seed));
        } catch (error) {
          errors.push({
            scope: "category",
            slug: seed.slug,
            issues: [error instanceof Error ? error.message : "Unknown category parsing error."],
          });
          return null;
        }
      }),
    ),
  );
  const categories = categoriesSchema.parse(
    categoryResults.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
  );
  const peptideSlugSet = new Set(peptides.map((item) => item.slug));
  const canonicalCategoryMap: Record<string, string> = {
    "weight-loss-and-metabolic": "weight-loss",
    "tissue-repair-and-healing": "tissue-repair",
    "growth-hormone-secretion": "growth-hormone",
    "cognitive-enhancement": "cognitive",
    "skin-hair-and-cosmetic": "skin-hair",
    "skin-hair-and": "skin-hair",
    "anti-aging-and-longevity": "anti-aging",
    "sexual-function-and-libido": "sexual-function",
    "immune-support": "immune",
    "sleep-and-stress-recovery": "sleep-stress",
    "other-and-emerging": "other",
  };
  const canonicalNames: Record<string, string> = {
    "weight-loss": "Weight Loss & Metabolic",
    "tissue-repair": "Tissue Repair & Healing",
    "growth-hormone": "Growth Hormone Secretion",
    cognitive: "Cognitive Enhancement",
    "skin-hair": "Skin, Hair & Cosmetic",
    "anti-aging": "Anti-Aging & Longevity",
    "sexual-function": "Sexual Function & Libido",
    immune: "Immune Support",
    "sleep-stress": "Sleep & Stress Recovery",
    other: "Other & Emerging",
  };
  const canonicalCategoriesMap = new Map<string, (typeof categories)[number]>();
  for (const category of categories) {
    const canonicalSlug = canonicalCategoryMap[category.slug] ?? category.slug;
    const existing = canonicalCategoriesMap.get(canonicalSlug);
    const mergedSlugs = Array.from(
      new Set([
        ...(existing?.peptideSlugs ?? []),
        ...category.peptideSlugs.filter((slug) => peptideSlugSet.has(slug)),
      ]),
    );
    canonicalCategoriesMap.set(canonicalSlug, {
      ...category,
      slug: canonicalSlug,
      name: canonicalNames[canonicalSlug] ?? category.name,
      count: Math.max(existing?.count ?? 0, mergedSlugs.length, category.count),
      peptideSlugs: mergedSlugs,
    });
  }
  for (const peptide of peptides) {
    const canonicalSlug = canonicalCategoryMap[peptide.category.slug] ?? peptide.category.slug;
    peptide.category.slug = canonicalSlug;
    peptide.category.name = canonicalNames[canonicalSlug] ?? peptide.category.name;
    const existing = canonicalCategoriesMap.get(canonicalSlug);
    if (existing && !existing.peptideSlugs.includes(peptide.slug)) {
      existing.peptideSlugs.push(peptide.slug);
      existing.count = existing.peptideSlugs.length;
    }
  }
  const canonicalCategories = Array.from(canonicalCategoriesMap.values())
    .filter((category) => category.peptideSlugs.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const comparisonSlugs = Array.from(
    new Set(peptides.flatMap((peptide) => peptide.comparisonSlugs)),
  ).filter(Boolean);
  const comparisonLimit = pLimit(3);
  const comparisonResults = await Promise.all(
    comparisonSlugs.map((slug) =>
      comparisonLimit(async () => {
        try {
          return await withRetry(() => parseComparisonPage(slug));
        } catch (error) {
          errors.push({
            scope: "comparison",
            slug,
            issues: [error instanceof Error ? error.message : "Unknown comparison parsing error."],
          });
          return null;
        }
      }),
    ),
  );
  const comparisons = comparisonsSchema.parse(
    comparisonResults.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
  );

  const providerSeeds = await parseAllProvidersListings();
  console.log(`Found ${providerSeeds.length} provider listings. Building from seeds (no detail fetch)...`);
  const providerResults = providerSeeds.map((seed) => {
    try {
      const parsed = buildProviderFromSeed(seed);
      return providerSchema.parse({ ...parsed, type: seed.type ?? "Other" });
    } catch (error) {
      errors.push({
        scope: "provider",
        slug: seed.slug,
        issues: [error instanceof Error ? error.message : "Unknown provider seed error."],
      });
      return null;
    }
  });
  const providers = providersSchema.parse(
    providerResults.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
  );

  const enriched = enrichPeptideProviderLinks(providers, peptides);

  await writeJson("peptides.json", enriched.peptides);
  await writeJson("categories.json", canonicalCategories);
  await writeJson("comparisons.json", comparisons);
  await writeJson("providers.json", enriched.providers);
  await writeJson("errors.json", errors);

  console.log(
    `Done. peptides=${enriched.peptides.length}, categories=${canonicalCategories.length}, comparisons=${comparisons.length}, providers=${enriched.providers.length}, errors=${errors.length}`,
  );
}

void run();
