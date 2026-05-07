import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export function SiteFooter(): JSX.Element {
  return (
    <footer className="mt-16 py-10">
      <div className="soft-card flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-accent-amber/10 text-accent-amber">
            <ShieldAlert className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Informational content only and not medical advice. Always consult a licensed
            physician before using any peptide compound.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/providers"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-accent-blue"
          >
            Providers
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            © Peptide Atlas
          </p>
        </div>
      </div>
    </footer>
  );
}
