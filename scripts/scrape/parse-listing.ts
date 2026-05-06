import { BASE_URL } from "./constants";
import { fetchCached } from "./fetch";
import type { CategorySeed, PeptideSeed } from "./types";
import { normalizeText, toSlug } from "./utils";

const AVAILABILITY_PATTERNS = [
  "Prescription Available",
  "Primarily Compoundable",
  "Mixed Availability",
  "Research Only",
  "cosmetic",
] as const;

function normalizeAvailability(text: string): string {
  const hit = AVAILABILITY_PATTERNS.find((value) => text.includes(value));
  if (!hit) return "Research Only";
  if (hit === "cosmetic") return "Cosmetic";
  return hit;
}

export async function parseListingPage(): Promise<{
  peptides: PeptideSeed[];
  categories: CategorySeed[];
}> {
  const markdown = await fetchCached(`${BASE_URL}/peptides`);

  const peptides: PeptideSeed[] = [];
  const seen = new Set<string>();
  const cardRegex =
    /\[([^\]]+)\]\((https?:\/\/thepeptidelist\.com\/peptides\/[a-z0-9-]+)\)/gi;

  for (const match of markdown.matchAll(cardRegex)) {
    const body = normalizeText(match[1] ?? "");
    if (!body.includes("###")) continue;
    const url = match[2] ?? "";
    const slug = url.split("/").filter(Boolean).pop() ?? "";
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);

    const postHeading = normalizeText(body.split("###").pop() ?? "");
    const tokens = postHeading.split(" ");
    const nameTokens: string[] = [];
    for (const token of tokens) {
      if (/^[A-Z0-9()+\-\/]+$/.test(token)) {
        nameTokens.push(token);
      } else {
        break;
      }
    }
    const name = normalizeText(nameTokens.join(" ") || slug.replace(/-/g, " ").toUpperCase());
    const preName = normalizeText(body.split("###")[0] ?? "");
    const categoryName = preName
      .replace(/(Prescription Available|Primarily Compoundable|Mixed Availability|Research Only|cosmetic)/gi, "")
      .trim();
    const availability = normalizeAvailability(preName);

    const afterName = normalizeText(postHeading.replace(name, ""));
    const shortDescription =
      normalizeText(afterName.match(/(.+? is .*?\.)/)?.[1] ?? afterName.match(/(.+?\.)/)?.[1] ?? "") ||
      `${name} research profile.`;
    const benefitsSource = normalizeText(afterName.replace(shortDescription, "").replace(/\+\d+\s+more/i, ""));
    const benefits = benefitsSource
      .split(/\s{2,}|(?<=\.)\s+(?=[A-Z])/)
      .map((value) => normalizeText(value))
      .filter((value) => value.length > 4 && !value.includes("+"))
      .slice(0, 5);

    peptides.push({
      name,
      displayName: name,
      slug,
      url,
      shortDescription,
      categoryName: categoryName || "Other & Emerging",
      categorySlug: toSlug(categoryName || "other-emerging"),
      availability,
      benefits,
      listingIndex: peptides.length,
    });
  }

  const categories: CategorySeed[] = [];
  const categoryRegex =
    /\[([^\]]+?)\]\((https?:\/\/thepeptidelist\.com\/peptides\/category\/[a-z0-9-]+)\)/gi;
  for (const match of markdown.matchAll(categoryRegex)) {
    const text = normalizeText(match[1] ?? "");
    const url = match[2] ?? "";
    const slug = url.split("/").filter(Boolean).pop() ?? "";
    const name = text.replace(/\d+\s+peptides?/i, "").trim();
    const countMatch = text.match(/(\d+)\s+peptides?/i);
    const count = countMatch ? Number(countMatch[1]) : 0;
    const description = name ? normalizeText(text.replace(name, "").replace(/\d+\s+peptides?/i, "")) : "";
    if (!slug || !name) continue;
    if (categories.some((entry) => entry.slug === slug)) continue;

    categories.push({
      slug,
      name,
      count,
      description,
      url,
    });
  }

  return { peptides, categories };
}
