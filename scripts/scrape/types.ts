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
