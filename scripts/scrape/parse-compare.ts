import { BASE_URL } from "./constants";
import { fetchCached } from "./fetch";
import type { ComparisonInput } from "./schema";
import { normalizeText, toAbsoluteUrl, toSlug } from "./utils";

export function comparisonSlugToPair(slug: string): { aSlug: string; bSlug: string } {
  const [a, b] = slug.split("-vs-");
  return {
    aSlug: a || slug,
    bSlug: b || slug,
  };
}

export async function parseComparisonPage(slug: string): Promise<ComparisonInput> {
  const url = `${BASE_URL}/compare/${slug}`;
  const markdown = await fetchCached(url);

  const title =
    normalizeText(markdown.match(/^Title:\s*(.+)$/m)?.[1] ?? "") ||
    slug.replace(/-/g, " ").toUpperCase();
  const summary =
    normalizeText(
      markdown.match(
        /are both popular peptides[\s\S]*?This comparison will help you understand the key differences[^.]*\./i,
      )?.[0] ?? "",
    ) || normalizeText(markdown.match(/Peptide Comparison[\s\S]*?\n\n([^\n]+)/i)?.[1] ?? "");

  const sections: Record<string, string> = {};
  const sectionRegex = /##\s+([^\n]+)\n([\s\S]*?)(?=\n##\s+|$)/g;
  for (const match of markdown.matchAll(sectionRegex)) {
    const sectionName = normalizeText(match[1] ?? "");
    const key = toSlug(sectionName);
    if (!key) continue;
    sections[key] = normalizeText(match[2] ?? "");
  }

  const pair = comparisonSlugToPair(slug);
  return {
    slug,
    title,
    summary,
    sections,
    ...pair,
    sourceUrl: toAbsoluteUrl(url, BASE_URL),
  };
}
