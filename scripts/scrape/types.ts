export interface PeptideSeed {
  name: string;
  slug: string;
  displayName: string;
  url: string;
  shortDescription: string;
  categoryName: string;
  categorySlug: string;
  availability: string;
  benefits: string[];
  listingIndex: number;
}

export interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  count: number;
  url: string;
}

export type ProviderType = "Physician" | "Pharmacy" | "Telehealth" | "Other";

export interface ProviderSeed {
  slug: string;
  name: string;
  type?: ProviderType;
  city?: string;
  state?: string;
  website?: string;
  shortDescription: string;
  listingIndex: number;
  page: number;
  url: string;
}
