import { z } from "zod";

export const availabilitySchema = z.enum([
  "Prescription Available",
  "Primarily Compoundable",
  "Mixed Availability",
  "Research Only",
  "Cosmetic",
]);

export const studySchema = z.object({
  title: z.string().min(1),
  authors: z.string().default(""),
  journal: z.string().default(""),
  year: z.number().int().gte(1900).lte(2100).default(2026),
  trialType: z.enum(["RCT", "Observational", "Meta-analysis"]).optional(),
  phase: z.enum(["Phase 1", "Phase 2", "Phase 3", "Phase 4"]).optional(),
  n: z.number().int().positive().optional(),
  weeks: z.number().int().positive().optional(),
  summary: z.string().default(""),
});

export const benefitSchema = z.object({
  label: z.string().min(1),
  evidence: z.string().optional(),
});

export const vendorSchema = z.object({
  name: z.string().min(1),
  type: z.string().optional(),
  url: z.string().url().optional(),
});

export const evidenceSchema = z.object({
  strength: z
    .enum(["Strong Evidence", "Moderate Evidence", "Limited Evidence"])
    .optional(),
  phase: z.string().optional(),
  totalStudies: z.number().int().nonnegative().optional(),
  humanStudies: z.number().int().nonnegative().optional(),
  summary: z.string().default(""),
  keyStudies: z.array(studySchema).default([]),
});

export const peptideSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  displayName: z.string().min(1),
  shortDescription: z.string().default(""),
  longDescription: z.string().default(""),
  category: z.object({
    slug: z.string().min(1),
    name: z.string().min(1),
  }),
  availability: availabilitySchema,
  listingIndex: z.number().int().nonnegative().optional(),
  popularityRank: z
    .object({
      rank: z.number().int().positive(),
      total: z.number().int().positive(),
    })
    .optional(),
  researchNotes: z.string().optional(),
  mechanisms: z.string().default(""),
  benefits: z.array(benefitSchema).default([]),
  evidence: evidenceSchema,
  vendors: z.array(vendorSchema).default([]),
  fdaStatus: z.object({
    status: z.string().default(""),
    notes: z.string().default(""),
    lastVerified: z.string().optional(),
  }),
  faq: z
    .array(
      z.object({
        q: z.string().min(1),
        a: z.string().min(1),
      }),
    )
    .default([]),
  relatedSlugs: z.array(z.string()).default([]),
  comparisonSlugs: z.array(z.string()).default([]),
  sourceUrl: z.string().url(),
});

export const categorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  count: z.number().int().nonnegative(),
  peptideSlugs: z.array(z.string()).default([]),
  sourceUrl: z.string().url(),
});

export const comparisonSchema = z.object({
  slug: z.string().min(1),
  aSlug: z.string().min(1),
  bSlug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional(),
  sections: z.record(z.string(), z.string()).optional(),
  sourceUrl: z.string().url(),
});

export const peptidesSchema = z.array(peptideSchema);
export const categoriesSchema = z.array(categorySchema);
export const comparisonsSchema = z.array(comparisonSchema);

export type PeptideInput = z.infer<typeof peptideSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ComparisonInput = z.infer<typeof comparisonSchema>;
