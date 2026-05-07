"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/peptides", label: "Peptides" },
  { href: "/providers", label: "Providers" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
];

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <header className="sticky top-4 z-30 mt-4">
      <div
        className={
          isHome
            ? "flex items-center justify-between border-b border-white/10 bg-transparent px-1 py-2.5"
            : "glass-pill flex items-center justify-between rounded-full px-4 py-2.5"
        }
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-2xl bg-linear-to-br from-accent-blue via-[#5b8df8] to-accent-violet text-white shadow-[0_8px_18px_rgba(10,132,255,0.35)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="6" cy="6" r="2" />
              <circle cx="18" cy="6" r="2" />
              <circle cx="12" cy="18" r="2" />
              <line x1="6" y1="6" x2="18" y2="6" />
              <line x1="6" y1="6" x2="12" y2="18" />
              <line x1="18" y1="6" x2="12" y2="18" />
            </svg>
          </span>
          <div className="leading-none">
            <p className="text-[15px] font-semibold tracking-tight">Peptide Atlas</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Clinical research
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "rounded-full px-3 py-1.5 transition " +
                  (active
                    ? "bg-accent-blue text-[#061021] shadow-[0_6px_18px_rgba(110,168,255,0.35)]"
                    : isHome
                      ? "text-[#b8c9ea] hover:bg-white/8 hover:text-text"
                      : "text-muted hover:bg-panel-muted hover:text-text")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
