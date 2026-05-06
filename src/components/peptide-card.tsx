import Link from "next/link";

import { AvailabilityChip } from "@/components/availability-chip";
import { EvidenceRing } from "@/components/evidence-ring";
import { getCategoryStyle } from "@/lib/category-style";
import type { Peptide } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PeptideCard({
  peptide,
  priority = false,
}: {
  peptide: Peptide;
  priority?: boolean;
}): JSX.Element {
  const rank = peptide.listingIndex !== undefined ? peptide.listingIndex + 1 : undefined;
  const title = peptide.displayName || peptide.name;
  const style = getCategoryStyle(peptide.category.slug);
  const Icon = style.icon;
  const phase = peptide.evidence.phase;
  const studies = peptide.evidence.totalStudies;
  const humans = peptide.evidence.humanStudies;
  const headline = peptide.benefits[0]?.label ?? peptide.shortDescription;

  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className={cn(
        "lift-card group relative block h-full overflow-hidden p-5",
        priority && "ring-1 ring-accent-blue/15",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-90"
        style={{
          background: `linear-gradient(180deg, ${style.surfaceFrom} 0%, transparent 100%)`,
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-[0_4px_12px_rgba(11,65,125,0.06)]"
            style={{ background: style.iconBg, color: style.iconColor }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <AvailabilityChip availability={peptide.availability} />
            {rank ? (
              <span className="rounded-full bg-[#0a1222]/70 px-2 py-0.5 font-mono text-[10px] leading-none text-muted ring-1 ring-hairline">
                #{rank}
              </span>
            ) : null}
          </div>
        </div>

        <h3 className="mt-4 line-clamp-2 text-[24px] font-semibold leading-tight tracking-tight text-text">
          {title}
        </h3>
        <p className="mt-1 text-xs font-medium" style={{ color: style.accent }}>
          {peptide.category.name}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{headline}</p>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {phase ? <span className="stat-pill">{phase}</span> : null}
          {studies ? <span className="stat-pill is-violet">n={studies}</span> : null}
          {humans ? <span className="stat-pill is-mint">{humans} human</span> : null}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-hairline/70 pt-4">
          <EvidenceRing strength={peptide.evidence.strength} size={44} thickness={4} />
          <span
            className="font-mono text-[11px] uppercase tracking-[0.1em] transition-transform group-hover:translate-x-1"
            style={{ color: style.accent }}
          >
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
