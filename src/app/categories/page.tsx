import { CategoryShowcase } from "@/components/category-showcase";
import { getCategories } from "@/lib/data";

export default async function CategoriesPage(): Promise<JSX.Element> {
  const categories = (await getCategories())
    .slice()
    .sort((a, b) => b.count - a.count);
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-blue">
          Therapeutic areas
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Categories</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Browse peptides by research goal and mechanism. Each category aggregates compounds
          with shared targets, study profiles, and clinical maturity.
        </p>
      </header>
      <CategoryShowcase categories={categories} />
    </div>
  );
}
