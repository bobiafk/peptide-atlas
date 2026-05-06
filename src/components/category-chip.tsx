import Link from "next/link";

export function CategoryChip({
  slug,
  label,
}: {
  slug: string;
  label: string;
}): JSX.Element {
  return (
    <Link
      href={`/categories/${slug}`}
      className="inline-flex items-center rounded-full border border-hairline bg-panel-muted px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent-blue hover:text-text"
    >
      {label}
    </Link>
  );
}
