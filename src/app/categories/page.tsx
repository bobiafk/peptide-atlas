import Link from "next/link";

import { getCategories } from "@/lib/data";

export default async function CategoriesPage(): Promise<JSX.Element> {
  const categories = await getCategories();
  return (
    <div className="space-y-6">
      <header className="soft-card p-6">
        <h1 className="text-4xl font-semibold tracking-tight">Categories</h1>
        <p className="mt-2 text-sm text-muted">Browse peptides by research goal and mechanism.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="soft-card p-5 transition-colors hover:border-accent-blue"
          >
            <h2 className="text-2xl font-semibold tracking-tight">{category.name}</h2>
            <p className="mt-2 text-sm text-muted">{category.description || "Category profile and included peptides."}</p>
            <p className="mt-4 font-mono text-xs text-muted">{category.count} peptides</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
