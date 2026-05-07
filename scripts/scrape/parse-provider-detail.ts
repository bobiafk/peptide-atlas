import { BASE_URL } from "./constants";
import { fetchCached } from "./fetch";
import type { ProviderInput } from "./schema";
import type { ProviderSeed, ProviderType } from "./types";
import { normalizeText, toAbsoluteUrl } from "./utils";

// Derive type from listing prefix text (e.g. "Telehealth ### Name …")
function parseTypeFromListingText(text: string): ProviderType {
  const prefix = text.split("###")[0] ?? "";
  const normalized = prefix.toLowerCase();
  if (normalized.includes("telehealth")) return "Telehealth";
  if (normalized.includes("pharmacy")) return "Pharmacy";
  if (normalized.includes("physician")) return "Physician";
  return "Other";
}

// Build a provider record purely from listing-page seed data — no HTTP request.
export function buildProviderFromSeed(seed: ProviderSeed, rawListingText?: string): ProviderInput {
  return {
    slug: seed.slug,
    name: seed.name,
    type: rawListingText ? parseTypeFromListingText(rawListingText) : "Other",
    city: seed.city,
    state: seed.state,
    fullAddress: undefined,
    website: seed.website ? (seed.website.startsWith("http") ? seed.website : `https://${seed.website}`) : undefined,
    description: seed.shortDescription,
    verified: false,
    claimed: false,
    similarSlugs: [],
    suppliedPeptideSlugs: [],
    sourceUrl: toAbsoluteUrl(seed.url, BASE_URL),
  };
}

function parseProviderType(value?: string): ProviderType {
  const normalized = (value ?? "").toLowerCase();
  if (normalized.includes("telehealth")) return "Telehealth";
  if (normalized.includes("pharmacy")) return "Pharmacy";
  if (normalized.includes("physician") || normalized.includes("doctor")) return "Physician";
  return "Other";
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

function getSectionRaw(markdown: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`###\\s+${escaped}\\s*\\n([\\s\\S]*?)(?:\\n###\\s+|\\n##\\s+|$)`, "i");
  return (markdown.match(regex)?.[1] ?? "").trim();
}

export async function parseProviderDetail(seed: ProviderSeed): Promise<ProviderInput> {
  const markdown = await fetchCached(seed.url);
  const titleHeading = normalizeText(markdown.match(/^#\s+(.+?)\s*\|\s*.+$/m)?.[1] ?? seed.name);
  const locationLine = normalizeText(
    markdown.match(/^Location:\s*([^\n]+)$/m)?.[1] ?? `${seed.city ?? ""}, ${seed.state ?? ""}`,
  );
  const fallbackCityState = parseCityState(locationLine);
  const typeLine = normalizeText(markdown.match(/^Provider Type:\s*([^\n]+)$/m)?.[1] ?? "");
  const verified = /Verified:\s*Yes/i.test(markdown) || /Status\s+Verified/i.test(markdown);
  const claimedFromField = markdown.match(/^Claimed:\s*(Yes|No)$/im)?.[1];
  const claimed =
    claimedFromField?.toLowerCase() === "yes" ||
    (!/Claim this listing/i.test(markdown) && /Claimed/i.test(markdown));

  const descriptionMatch = markdown.match(
    /\n(?:\[Is this your business\?[^\n]+\n)?\n?([^\n]{20,})\n\nLocation\n/i,
  );
  const description = normalizeText(descriptionMatch?.[1] ?? seed.shortDescription);

  const locationBlock = markdown.match(/\nLocation\n\n([\s\S]*?)\n\nWebsite\n/i)?.[1] ?? "";
  const locationLines = locationBlock
    .split(/\n+/)
    .map((line) => normalizeText(line))
    .filter(Boolean);
  const fullAddress = locationLines.length > 0 ? locationLines.join(", ") : undefined;

  const website = normalizeText(
    markdown.match(/\[Visit Website\]\((https?:\/\/[^)]+)\)/i)?.[1] ??
      (seed.website ? `https://${seed.website}` : ""),
  );

  const similarSlugs: string[] = [];
  const similarSection = getSectionRaw(markdown, "Similar Telehealth Providers")
    || getSectionRaw(markdown, "Similar Physician Providers")
    || getSectionRaw(markdown, "Similar Pharmacy Providers")
    || getSectionRaw(markdown, "Similar Providers");
  const providerLinkRegex =
    /\((https?:\/\/(?:www\.)?thepeptidelist\.com\/providers\/([a-z0-9-]+))\)/gi;
  for (const match of similarSection.matchAll(providerLinkRegex)) {
    const slug = match[2];
    if (!slug || slug === seed.slug) continue;
    if (!similarSlugs.includes(slug)) similarSlugs.push(slug);
  }

  return {
    slug: seed.slug,
    name: titleHeading || seed.name,
    type: parseProviderType(typeLine),
    city: fallbackCityState.city ?? seed.city,
    state: fallbackCityState.state ?? seed.state,
    fullAddress,
    website: website || undefined,
    description: description || seed.shortDescription,
    verified,
    claimed,
    similarSlugs,
    suppliedPeptideSlugs: [],
    sourceUrl: toAbsoluteUrl(seed.url, BASE_URL),
  };
}
