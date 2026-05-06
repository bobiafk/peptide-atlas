import { BASE_URL } from "./constants";
import { fetchCached } from "./fetch";
import type { CategoryInput } from "./schema";
import type { CategorySeed } from "./types";
import { normalizeText, toAbsoluteUrl, toSlug } from "./utils";

export async function parseCategoryPage(seed: CategorySeed): Promise<CategoryInput> {
  const markdown = await fetchCached(seed.url);
  const heading =
    normalizeText(markdown.match(/^#\s+(.+?)\s+\|\s+The Peptide List/m)?.[1] ?? "") || seed.name;
  const description =
    normalizeText(
      markdown.match(/#\s+[^\n]+\n\n([^\n]+)\n\n[^\n]*\n\n\d+\s+peptides/i)?.[1] ?? "",
    ) || seed.description;
  const peptideSlugs: string[] = [];

  const peptideRegex = /\((https?:\/\/thepeptidelist\.com\/peptides\/([a-z0-9-]+))\)/g;
  for (const match of markdown.matchAll(peptideRegex)) {
    const slug = match[2];
    if (!slug) continue;
    if (!peptideSlugs.includes(slug)) peptideSlugs.push(slug);
  }

  return {
    slug: seed.slug || toSlug(heading),
    name: heading,
    description: description || seed.description,
    count: seed.count || peptideSlugs.length,
    peptideSlugs,
    sourceUrl: toAbsoluteUrl(seed.url, BASE_URL),
  };
}
