export const AVAILABILITY_VALUES = [
  "Prescription Available",
  "Primarily Compoundable",
  "Mixed Availability",
  "Research Only",
  "Cosmetic",
] as const;

export type Availability = (typeof AVAILABILITY_VALUES)[number];

export interface Study {
  title: string;
  authors: string;
  journal: string;
  year: number;
  trialType?: "RCT" | "Observational" | "Meta-analysis";
  phase?: "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4";
  n?: number;
  weeks?: number;
  summary: string;
}

export interface Benefit {
  label: string;
  evidence?: string;
}

export interface Vendor {
  name: string;
  type?: string;
  url?: string;
}

export interface PeptideEvidence {
  strength?: "Strong Evidence" | "Moderate Evidence" | "Limited Evidence";
  phase?: string;
  totalStudies?: number;
  humanStudies?: number;
  summary: string;
  keyStudies: Study[];
}

export interface Peptide {
  slug: string;
  name: string;
  displayName: string;
  shortDescription: string;
  longDescription: string;
  category: { slug: string; name: string };
  availability: Availability;
  listingIndex?: number;
  popularityRank?: { rank: number; total: number };
  researchNotes?: string;
  mechanisms: string;
  benefits: Benefit[];
  evidence: PeptideEvidence;
  vendors: Vendor[];
  fdaStatus: { status: string; notes: string; lastVerified?: string };
  faq: { q: string; a: string }[];
  relatedSlugs: string[];
  comparisonSlugs: string[];
  providerSlugs?: string[];
  sourceUrl: string;
}

export type ProviderType = "Physician" | "Pharmacy" | "Telehealth" | "Other";

export interface Provider {
  slug: string;
  name: string;
  type: ProviderType;
  city?: string;
  state?: string;
  fullAddress?: string;
  website?: string;
  description: string;
  verified: boolean;
  claimed: boolean;
  similarSlugs: string[];
  suppliedPeptideSlugs: string[];
  sourceUrl: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  count: number;
  peptideSlugs: string[];
  sourceUrl: string;
}

export interface Comparison {
  slug: string;
  aSlug: string;
  bSlug: string;
  title: string;
  summary?: string;
  sections?: Record<string, string>;
  sourceUrl: string;
}
