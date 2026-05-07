import type { PeptideInput, ProviderInput } from "./schema";

interface PeptideAlias {
  slug: string;
  alias: string;
}

function normalizeForMatch(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9+/\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectAliases(peptide: PeptideInput): string[] {
  const slugAsWords = peptide.slug.replace(/-/g, " ");
  return [
    peptide.displayName,
    peptide.name,
    slugAsWords,
    slugAsWords.replace(/\s+/g, ""),
  ]
    .map((entry) => entry.trim())
    .filter((entry) => {
      const hasDigit = /\d/.test(entry);
      return entry.length >= 4 || hasDigit;
    });
}

function buildAliasIndex(peptides: PeptideInput[]): PeptideAlias[] {
  const aliases: PeptideAlias[] = [];
  const seen = new Set<string>();

  for (const peptide of peptides) {
    for (const alias of collectAliases(peptide)) {
      const normalized = normalizeForMatch(alias);
      const key = `${peptide.slug}::${normalized}`;
      if (!normalized || seen.has(key)) continue;
      seen.add(key);
      aliases.push({
        slug: peptide.slug,
        alias: normalized,
      });
    }
  }

  aliases.sort((a, b) => b.alias.length - a.alias.length);
  return aliases;
}

function matchProviderPeptides(
  provider: ProviderInput,
  aliases: PeptideAlias[],
): string[] {
  const haystack = normalizeForMatch(`${provider.name} ${provider.description}`);
  const hits = new Set<string>();

  for (const item of aliases) {
    const pattern = new RegExp(`(^|[^A-Z0-9])${escapeRegex(item.alias)}([^A-Z0-9]|$)`);
    if (pattern.test(haystack)) {
      hits.add(item.slug);
    }
  }

  return Array.from(hits).sort((a, b) => a.localeCompare(b));
}

export function enrichPeptideProviderLinks(
  providers: ProviderInput[],
  peptides: PeptideInput[],
): {
  providers: ProviderInput[];
  peptides: PeptideInput[];
} {
  const aliasIndex = buildAliasIndex(peptides);
  const providerToPeptides = new Map<string, string[]>();
  const peptideToProviders = new Map<string, string[]>();

  for (const provider of providers) {
    const matched = matchProviderPeptides(provider, aliasIndex);
    providerToPeptides.set(provider.slug, matched);
    for (const peptideSlug of matched) {
      if (!peptideToProviders.has(peptideSlug)) {
        peptideToProviders.set(peptideSlug, []);
      }
      peptideToProviders.get(peptideSlug)?.push(provider.slug);
    }
  }

  const enrichedProviders = providers.map((provider) => ({
    ...provider,
    suppliedPeptideSlugs: providerToPeptides.get(provider.slug) ?? [],
  }));

  const enrichedPeptides = peptides.map((peptide) => ({
    ...peptide,
    providerSlugs: (peptideToProviders.get(peptide.slug) ?? []).sort((a, b) =>
      a.localeCompare(b),
    ),
  }));

  return {
    providers: enrichedProviders,
    peptides: enrichedPeptides,
  };
}
