import { load } from "cheerio";

export function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function toAbsoluteUrl(url: string, base: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return new URL(url, base).toString();
}

export function getPathFromUrl(url: string): string {
  const parsed = new URL(url);
  return parsed.pathname + (parsed.search ? parsed.search : "");
}

export function parseNumberFromText(text: string): number | undefined {
  const match = text.match(/(\d[\d,]*)/);
  if (!match) return undefined;
  return Number(match[1].replace(/,/g, ""));
}

export function parseWeeks(text: string): number | undefined {
  const match = text.match(/(\d+)\s*weeks?/i);
  return match ? Number(match[1]) : undefined;
}

export function parseYear(text: string): number | undefined {
  const match = text.match(/\((19|20)\d{2}\)/);
  return match ? Number(match[0].slice(1, -1)) : undefined;
}

export function splitAuthorJournalYear(byline: string): {
  authors: string;
  journal: string;
  year: number;
} {
  const parts = byline.split("·").map(normalizeText);
  const authors = parts[0] ?? "";
  const journalPart = parts[1] ?? "";
  const year = parseYear(journalPart) ?? 2026;
  const journal = normalizeText(journalPart.replace(/\((19|20)\d{2}\)/, ""));
  return { authors, journal, year };
}

export function htmlToLines(html: string): string[] {
  const $ = load(html);
  const text = normalizeText($("body").text());
  return text.split(" ").filter(Boolean);
}
