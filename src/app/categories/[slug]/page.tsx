import { notFound } from "next/navigation";

import { PeptideCard } from "@/components/peptide-card";
import { getCategoryStyle } from "@/lib/category-style";
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
  const style = getCategoryStyle(category.slug);
  const Icon = style.icon;

  return (
    <div className="space-y-8">
      <header
        className="relative overflow-hidden rounded-3xl border border-hairline p-8 md:p-10"
        style={{
          background: `linear-gradient(140deg, ${style.surfaceFrom} 0%, ${style.surfaceTo} 70%, rgba(10,16,33,0.88) 100%)`,
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div
            className="grid h-14 w-14 place-items-center rounded-2xl shadow-[0_8px_18px_rgba(11,65,125,0.12)]"
            style={{ background: style.iconBg, color: style.iconColor }}
          >
            <Icon className="h-6 w-6" strokeWidth={1.8} />
          </div>
          <div>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.16em]"
              style={{ color: style.accent }}
            >
              Therapeutic area
            </p>
            <h1 className="mt-1 text-4xl font-semibold tracking-tight md:text-5xl">
              {category.name}
            </h1>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">
          {category.description}
        </p>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0a1326]/75 px-3 py-1 text-xs">
          <span className="font-mono text-text">{categoryPeptides.length}</span>
          <span className="text-muted">peptides in this category</span>
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categoryPeptides.map((peptide) => (
          <PeptideCard key={peptide.slug} peptide={peptide} />
        ))}
      </div>
    </div>
  );
}
