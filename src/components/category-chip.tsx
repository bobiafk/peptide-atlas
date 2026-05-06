import Link from "next/link";

import { getCategoryStyle } from "@/lib/category-style";

export function CategoryChip({
  slug,
  label,
  withIcon = false,
}: {
  slug: string;
  label: string;
  withIcon?: boolean;
}): JSX.Element {
  const style = getCategoryStyle(slug);
  const Icon = style.icon;
  return (
    <Link
      href={`/categories/${slug}`}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition-all hover:translate-y-[-1px]"
      style={{
        background: style.iconBg,
        color: style.iconColor,
        boxShadow: "0 0 0 1px rgba(173,205,255,0.22) inset",
        outline: "none",
      }}
    >
      {withIcon ? <Icon className="h-3 w-3" strokeWidth={2} /> : null}
      {label}
    </Link>
  );
}
