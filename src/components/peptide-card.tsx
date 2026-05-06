import Link from "next/link";

import { AvailabilityChip } from "@/components/availability-chip";
import { CategoryChip } from "@/components/category-chip";
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
  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className={cn(
        "group block h-full rounded-3xl border border-hairline bg-panel p-5 shadow-[0_10px_30px_rgba(11,65,125,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-blue",
        priority && "ring-1 ring-accent-blue/15",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        {rank ? (
          <span className="rounded-full bg-panel-muted px-2.5 py-1 font-mono text-[11px] leading-none text-muted">
            #{rank}
          </span>
        ) : null}
        <AvailabilityChip availability={peptide.availability} />
      </div>
      <h3 className="line-clamp-2 text-[28px] font-semibold tracking-tight text-text">{title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{peptide.shortDescription}</p>
      <div className="mt-3">
        <CategoryChip slug={peptide.category.slug} label={peptide.category.name} />
      </div>
      <ul className="mt-4 space-y-2 text-xs text-muted">
        {peptide.benefits.slice(0, 3).map((benefit) => (
          <li key={benefit.label} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent-blue" />
            <span>{benefit.label}</span>
          </li>
        ))}
      </ul>
    </Link>
  );
}
