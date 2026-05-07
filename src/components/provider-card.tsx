import { BadgeCheck, Building2, ChevronRight, MapPin, Stethoscope } from "lucide-react";
import Link from "next/link";

import type { Provider } from "@/lib/types";

function typeIcon(type: Provider["type"]): JSX.Element {
  if (type === "Physician") return <Stethoscope className="h-4 w-4" strokeWidth={1.8} />;
  if (type === "Pharmacy") return <Building2 className="h-4 w-4" strokeWidth={1.8} />;
  return <BadgeCheck className="h-4 w-4" strokeWidth={1.8} />;
}

export function ProviderCard({
  provider,
  peptideName,
}: {
  provider: Provider;
  peptideName?: string;
}): JSX.Element {
  const location = [provider.city, provider.state].filter(Boolean).join(", ");
  const peptideCount = provider.suppliedPeptideSlugs.length;

  return (
    <Link
      href={`/providers/${provider.slug}`}
      className="lift-card group flex h-full flex-col gap-4 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-panel-muted px-2.5 py-1 text-xs text-muted">
          {typeIcon(provider.type)}
          <span>{provider.type}</span>
        </div>
        {provider.verified ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#2d625a] bg-[#0d2522] px-2 py-1 text-[11px] uppercase tracking-[0.08em] text-[#8ff5e3]">
            Verified
          </span>
        ) : null}
      </div>

      <div className="space-y-1">
        <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-text">
          {provider.name}
        </h3>
        {location ? (
          <p className="inline-flex items-center gap-1.5 text-xs text-muted">
            <MapPin className="h-3 w-3" />
            {location}
          </p>
        ) : null}
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-muted">
        {provider.description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-hairline/70 pt-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
          {peptideName
            ? `Supplies ${peptideName}`
            : `${peptideCount} peptide${peptideCount === 1 ? "" : "s"}`}
        </p>
        <span className="inline-flex items-center gap-1 text-xs text-accent-blue transition group-hover:translate-x-1">
          View
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
