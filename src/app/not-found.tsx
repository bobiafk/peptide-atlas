import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NotFound(): JSX.Element {
  return (
    <div className="hero-mesh relative px-8 py-16 text-center md:py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-blue">
        404
      </p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight md:text-6xl">
        Page not found
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-muted">
        The peptide you&apos;re looking for couldn&apos;t be located in the atlas.
      </p>
      <Link
        href="/peptides"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-blue px-5 py-2.5 text-sm font-medium text-[#061021] shadow-[0_10px_22px_rgba(110,168,255,0.35)] transition hover:brightness-110"
      >
        Back to all peptides
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
