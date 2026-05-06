import { FileText } from "lucide-react";

import type { Study } from "@/lib/types";

export function StudyCitation({ study }: { study: Study }): JSX.Element {
  return (
    <article className="group rounded-2xl border border-hairline bg-panel p-5 transition hover:border-accent-blue/40">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-blue/8 text-accent-blue">
          <FileText className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <div className="flex-1">
          <h4 className="font-medium leading-snug text-text">{study.title}</h4>
          <p className="mt-1 text-xs text-muted">
            {study.authors} · <span className="italic">{study.journal}</span> ({study.year})
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {study.trialType ? <span className="stat-pill">{study.trialType}</span> : null}
        {study.phase ? <span className="stat-pill is-violet">{study.phase}</span> : null}
        {study.n ? <span className="stat-pill is-mint">n={study.n}</span> : null}
        {study.weeks ? <span className="stat-pill is-amber">{study.weeks} wks</span> : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{study.summary}</p>
    </article>
  );
}
