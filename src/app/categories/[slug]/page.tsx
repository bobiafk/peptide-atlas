import { notFound } from "next/navigation";

import { PeptideCard } from "@/components/peptide-card";
import { getCategories, getCategoryBySlug, getPeptides } from "@/lib/data";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<JSX.Element> {
  const { slug } = await params;
  const [category, peptides] = await Promise.all([getCategoryBySlug(slug), getPeptides()]);
  if (!category) notFound();

  const categoryPeptides = peptides.filter((item) => category.peptideSlugs.includes(item.slug));

  return (
    <div className="space-y-6">
      <header className="soft-card p-6">
        <h1 className="text-4xl font-semibold tracking-tight">{category.name}</h1>
        <p className="mt-2 text-sm text-muted">{category.description}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categoryPeptides.map((peptide) => (
          <PeptideCard key={peptide.slug} peptide={peptide} />
        ))}
      </div>
    </div>
  );
}
