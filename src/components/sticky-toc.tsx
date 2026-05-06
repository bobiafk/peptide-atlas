import Link from "next/link";

export function StickyTOC({
  items,
}: {
  items: { id: string; label: string }[];
}): JSX.Element {
  return (
    <aside className="top-24 hidden h-fit rounded-2xl border border-hairline bg-panel p-4 shadow-[0_8px_24px_rgba(11,65,125,0.06)] lg:sticky lg:block">
      <p className="mb-3 text-xs uppercase tracking-[0.08em] text-muted">On This Page</p>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`#${item.id}`} className="text-muted transition-colors hover:text-accent-blue">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
