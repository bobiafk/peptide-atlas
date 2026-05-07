import { BASE_URL } from "./constants";
import { fetchCached } from "./fetch";
import type { ProviderSeed, ProviderType } from "./types";
import { normalizeText, toAbsoluteUrl } from "./utils";

function parseTypeFromText(text: string): ProviderType {
  const lower = text.toLowerCase();
  if (lower.startsWith("telehealth")) return "Telehealth";
  if (lower.startsWith("pharmacy")) return "Pharmacy";
  if (lower.startsWith("physician")) return "Physician";
  return "Other";
}

interface ProviderListingPageResult {
  providers: ProviderSeed[];
  page: number;
  totalPages?: number;
}

function parseTotalPages(markdown: string): number | undefined {
  const match = markdown.match(/page\s+\d+\s+of\s+(\d+)/i);
  return match ? Number(match[1]) : undefined;
}

function parseCityState(raw?: string): { city?: string; state?: string } {
  if (!raw) return {};
  const match = raw.match(/^(.+?),\s*([A-Z]{2}|[A-Za-z]{2,})$/);
  if (!match) return {};
  return {
    city: normalizeText(match[1] ?? ""),
    state: normalizeText(match[2] ?? "").toUpperCase(),
  };
}

function parseProviderCardText(text: string): {
  name: string;
  city?: string;
  state?: string;
  website?: string;
  shortDescription: string;
} {
  const normalized = normalizeText(
    text
      .replace(/^(Telehealth|Physician|Pharmacy)\s+###\s+/i, "")
      .replace(/\s*Leave Review\s*$/i, ""),
  );
  const websiteMatch = normalized.match(
    /\b(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+\b/i,
  );
  const website = websiteMatch ? websiteMatch[0].replace(/^https?:\/\//i, "") : undefined;
  const beforeWebsite = websiteMatch
    ? normalizeText(normalized.slice(0, websiteMatch.index))
    : normalized;
  const afterWebsite = websiteMatch
    ? normalizeText(
        normalized.slice((websiteMatch.index ?? 0) + (websiteMatch[0]?.length ?? 0)),
      )
    : "";
  const locationMatch = beforeWebsite.match(/(.+?,\s*(?:[A-Z]{2}|[A-Za-z]{2,}))$/);
  const location = locationMatch ? normalizeText(locationMatch[1] ?? "") : undefined;
  const name = location
    ? normalizeText(beforeWebsite.slice(0, Math.max(0, beforeWebsite.lastIndexOf(location))))
    : beforeWebsite;
  const locationParts = parseCityState(location);

  return {
    name: name || "Unknown Provider",
    city: locationParts.city,
    state: locationParts.state,
    website,
    shortDescription: afterWebsite || "Provider listing on The Peptide List.",
  };
}

function parseProvidersFromMarkdown(markdown: string, page: number): ProviderSeed[] {
  const providers: ProviderSeed[] = [];
  const seen = new Set<string>();
  const entryRegex =
    /\[([^\]]+)\]\((https?:\/\/(?:www\.)?thepeptidelist\.com\/providers\/[a-z0-9-]+)\)/gi;

  for (const match of markdown.matchAll(entryRegex)) {
    const text = normalizeText(match[1] ?? "");
    if (!/Leave Review|###/i.test(text)) continue;
    const rawUrl = match[2] ?? "";
    const slug = rawUrl.split("/").filter(Boolean).pop() ?? "";
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    const parsed = parseProviderCardText(text);
    providers.push({
      slug,
      name: parsed.name,
      type: parseTypeFromText(text),
      city: parsed.city,
      state: parsed.state,
      website: parsed.website,
      shortDescription: parsed.shortDescription,
      listingIndex: providers.length,
      page,
      url: toAbsoluteUrl(rawUrl, BASE_URL),
    });
  }
  return providers;
}

export async function parseProvidersListingPage(
  page: number,
): Promise<ProviderListingPageResult> {
  const queryUrl =
    page <= 1 ? `${BASE_URL}/providers/` : `${BASE_URL}/providers/?page=${page}`;
  let markdown = await fetchCached(queryUrl);
  let providers = parseProvidersFromMarkdown(markdown, page);

  if (providers.length === 0 && page > 1) {
    const pathUrl = `${BASE_URL}/providers/page/${page}`;
    markdown = await fetchCached(pathUrl);
    providers = parseProvidersFromMarkdown(markdown, page);
  }

  return {
    providers,
    page,
    totalPages: parseTotalPages(markdown),
  };
}

export async function parseAllProvidersListings(): Promise<ProviderSeed[]> {
  const allProviders: ProviderSeed[] = [];
  const seen = new Set<string>();
  let page = 1;
  let totalPages: number | undefined;
  let consecutiveEmpty = 0;

  while (true) {
    const result = await parseProvidersListingPage(page);

    if (result.totalPages !== undefined && result.totalPages > 0) {
      totalPages = result.totalPages;
    }

    if (result.providers.length === 0) {
      consecutiveEmpty += 1;
      // Stop if we know totalPages and are past it, or 3 consecutive empty pages
      if (totalPages && page >= totalPages) break;
      if (consecutiveEmpty >= 3) break;
    } else {
      consecutiveEmpty = 0;
      for (const provider of result.providers) {
        if (seen.has(provider.slug)) continue;
        seen.add(provider.slug);
        allProviders.push({ ...provider, listingIndex: allProviders.length });
      }
    }

    if (totalPages && page >= totalPages) break;
    page += 1;
  }

  console.log(`  Listing pages scanned: ${page}, totalPages detected: ${totalPages ?? "unknown"}`);
  return allProviders;
}
