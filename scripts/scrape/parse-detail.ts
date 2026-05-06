import { BASE_URL } from "./constants";
import { fetchCached } from "./fetch";
import type { PeptideInput } from "./schema";
import type { PeptideSeed } from "./types";
import {
  normalizeText,
  parseNumberFromText,
  parseWeeks,
  splitAuthorJournalYear,
  toAbsoluteUrl,
} from "./utils";

function getSectionRaw(markdown: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?:\\n##\\s+|$)`, "i");
  return (markdown.match(regex)?.[1] ?? "").trim();
}

function getSection(markdown: string, heading: string): string {
  return normalizeText(getSectionRaw(markdown, heading));
}

export async function parsePeptideDetail(seed: PeptideSeed): Promise<PeptideInput> {
  const markdown = await fetchCached(seed.url);
  const lines = markdown.split("\n").map((line) => line.trim()).filter(Boolean);

  const title = normalizeText(
    lines.find((line) => line.startsWith("Title:"))?.replace("Title:", "") ?? seed.name,
  );
  const displayName = normalizeText(title.replace(/\s+Research Peptide$/i, ""));
  const heroParagraph =
    normalizeText(lines.find((line) => line.toLowerCase().includes(`${seed.slug.replace(/-/g, " ")} is`)) ?? "") ||
    seed.shortDescription;

  const quickFactsText = getSection(markdown, "Quick Facts");
  const popularityText = quickFactsText.match(/#(\d+)\s+of\s+(\d+)/i);
  const popularityRank = popularityText
    ? { rank: Number(popularityText[1]), total: Number(popularityText[2]) }
    : undefined;

  const researchNotes =
    quickFactsText.split("Research Notes").pop()?.split("Search providers")[0]?.trim() || undefined;

  const mechanisms = getSection(markdown, "Research Overview & Mechanisms");

  const benefits: PeptideInput["benefits"] = [];
  const benefitsSection = getSectionRaw(markdown, "Reported Research Benefits");
  for (const line of benefitsSection.split(/\n+/)) {
    const text = normalizeText(line);
    if (!text) continue;
    if (text.startsWith("##")) continue;
    const evidence =
      text.match(/(\d+\s+RCTs?,\s*n=\d+[\d,]*|\d+\s+human studies?|\d+\s+RCTs?)/i)?.[1] ??
      undefined;
    const label = normalizeText(text.replace(evidence ?? "", "").replace(/\s+\d+\s*$/, ""));
    if (!label) continue;
    if (!benefits.some((item) => item.label === label)) {
      benefits.push({ label, evidence });
    }
  }

  const evidenceText = getSection(markdown, "Clinical Evidence");
  const strength = evidenceText.match(/(Strong Evidence|Moderate Evidence|Limited Evidence)/i)?.[1] as
    | "Strong Evidence"
    | "Moderate Evidence"
    | "Limited Evidence"
    | undefined;
  const phase = evidenceText.match(/(Phase\s+[1-4])/i)?.[1];
  const totalStudies = parseNumberFromText(evidenceText.match(/(\d+)\s+studies/i)?.[0] ?? "");
  const humanStudies = parseNumberFromText(evidenceText.match(/(\d+)\s+human/i)?.[0] ?? "");
  const summaryMatch = markdown.match(
    /#\s+[A-Za-z0-9\s-]+ Clinical Evidence Summary([\s\S]*?)(?:\n###\s+Key Studies|\n##\s+Where to Buy|$)/i,
  );
  const summary = normalizeText(summaryMatch?.[1] ?? "");

  const keyStudies: PeptideInput["evidence"]["keyStudies"] = [];
  const studyRegex =
    /####\s+([^\n]+)\n+([^\n]*·[^\n]+)\n+(?:\[\]\([^)]+\)\n+)?([^\n]*?(?:Phase\s+[1-4])?[^\n]*)\n+([^\n]+)/g;
  for (const match of markdown.matchAll(studyRegex)) {
    const studyTitle = normalizeText(match[1] ?? "");
    const byline = normalizeText(match[2] ?? "");
    const tags = normalizeText(match[3] ?? "");
    const summaryText = normalizeText(match[4] ?? "");
    if (!studyTitle || !byline.includes("·")) continue;
    const parsed = splitAuthorJournalYear(byline);
    const n = parseNumberFromText(tags.match(/n=\d[\d,]*/i)?.[0] ?? "");
    const weeks = parseWeeks(tags);
    const trialType = tags.includes("RCT") ? "RCT" : undefined;
    const phaseTag = tags.match(/Phase\s+[1-4]/i)?.[0] as
      | "Phase 1"
      | "Phase 2"
      | "Phase 3"
      | "Phase 4"
      | undefined;
    keyStudies.push({
      title: studyTitle,
      authors: parsed.authors,
      journal: parsed.journal,
      year: parsed.year,
      trialType,
      phase: phaseTag,
      n,
      weeks,
      summary: summaryText,
    });
  }

  const vendors: PeptideInput["vendors"] = [];
  const vendorBlock = getSectionRaw(markdown, `Where to Buy ${seed.name}`);
  for (const line of vendorBlock.split(/\n+/)) {
    const clean = normalizeText(line.replace(/^#+\s*/, ""));
    if (!clean || clean.includes("Search All Providers")) continue;
    if (clean.length < 3 || clean.length > 60) continue;
    if (!vendors.some((item) => item.name === clean)) vendors.push({ name: clean });
  }

  const fdaText = getSection(markdown, "FDA Regulatory Status");
  const lastVerified = fdaText.match(/Last verified:\s*([A-Za-z]+\s+\d{4})/i)?.[1];
  const status = normalizeText(fdaText.split(".")[0] ?? "") || seed.availability;

  const faq: { q: string; a: string }[] = [];
  const faqSection = getSection(markdown, "Frequently Asked Questions");
  const faqRegex = /###\s+([^\n]+)\n+([^\n][\s\S]*?)(?=\n###\s+|$)/g;
  for (const match of faqSection.matchAll(faqRegex)) {
    const q = normalizeText(match[1] ?? "");
    const a = normalizeText(match[2] ?? "");
    if (q && a) {
      faq.push({ q, a });
    }
  }

  const relatedSlugs: string[] = [];
  const relatedRegex = /\((https?:\/\/thepeptidelist\.com\/peptides\/([a-z0-9-]+))\)/g;
  for (const match of markdown.matchAll(relatedRegex)) {
    const slug = match[2];
    if (!slug || slug === seed.slug) continue;
    if (!relatedSlugs.includes(slug)) relatedSlugs.push(slug);
  }

  const comparisonSlugs: string[] = [];
  const compareRegex = /\((https?:\/\/thepeptidelist\.com\/compare\/([a-z0-9-]+))\)/g;
  for (const match of markdown.matchAll(compareRegex)) {
    const slug = match[2];
    if (!slug) continue;
    if (!comparisonSlugs.includes(slug)) comparisonSlugs.push(slug);
  }

  return {
    slug: seed.slug,
    name: seed.name,
    displayName,
    shortDescription: seed.shortDescription,
    longDescription: heroParagraph,
    category: {
      slug: seed.categorySlug,
      name: seed.categoryName,
    },
    availability: (seed.availability as PeptideInput["availability"]) ?? "Research Only",
    listingIndex: seed.listingIndex,
    popularityRank,
    researchNotes,
    mechanisms,
    benefits:
      benefits.length > 0
        ? benefits
        : seed.benefits.map((entry) => ({
            label: entry,
          })),
    evidence: {
      strength,
      phase,
      totalStudies,
      humanStudies,
      summary,
      keyStudies,
    },
    vendors,
    fdaStatus: {
      status,
      notes: fdaText,
      lastVerified,
    },
    faq,
    relatedSlugs,
    comparisonSlugs,
    sourceUrl: toAbsoluteUrl(seed.url, BASE_URL),
  };
}
