import Link from "next/link";

export function StickyTOC({
  items,
}: {
  items: { id: string; label: string }[];
}): JSX.Element {
  return (
    <aside className="top-28 hidden h-fit rounded-3xl border border-hairline bg-panel/80 p-5 shadow-[0_8px_24px_rgba(11,65,125,0.06)] backdrop-blur lg:sticky lg:block">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-blue">
        On this page
      </p>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className="block rounded-lg px-2 py-1.5 text-muted transition hover:bg-panel-muted hover:text-text"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
