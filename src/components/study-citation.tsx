import type { Study } from "@/lib/types";

export function StudyCitation({ study }: { study: Study }): JSX.Element {
  return (
    <article className="rounded-2xl border border-hairline bg-panel p-4 shadow-[0_8px_24px_rgba(11,65,125,0.06)]">
      <h4 className="font-medium text-text">{study.title}</h4>
      <p className="mt-1 text-sm text-muted">
        {study.authors} · {study.journal} ({study.year})
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {study.trialType ? (
          <span className="rounded-full bg-panel-muted px-2 py-1 font-mono text-muted">{study.trialType}</span>
        ) : null}
        {study.phase ? (
          <span className="rounded-full bg-panel-muted px-2 py-1 font-mono text-muted">{study.phase}</span>
        ) : null}
        {study.n ? <span className="rounded-full bg-panel-muted px-2 py-1 font-mono text-muted">n={study.n}</span> : null}
        {study.weeks ? (
          <span className="rounded-full bg-panel-muted px-2 py-1 font-mono text-muted">{study.weeks} weeks</span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{study.summary}</p>
    </article>
  );
}
