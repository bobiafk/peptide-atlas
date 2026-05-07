import type { ProviderType } from "@/lib/types";

export const PROVIDER_TYPE_OPTIONS: ProviderType[] = [
  "Physician",
  "Pharmacy",
  "Telehealth",
  "Other",
];

export function providerTypeToSlug(type: ProviderType): string {
  return type.toLowerCase();
}

export function providerSlugToType(slug: string): ProviderType | undefined {
  const normalized = slug.toLowerCase();
  if (normalized === "physician") return "Physician";
  if (normalized === "pharmacy") return "Pharmacy";
  if (normalized === "telehealth") return "Telehealth";
  if (normalized === "other") return "Other";
  return undefined;
}

export function normalizeStateCode(value?: string): string {
  return (value ?? "").trim().toUpperCase();
}
