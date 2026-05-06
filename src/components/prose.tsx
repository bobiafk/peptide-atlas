import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export function Prose({
  children,
  className,
}: PropsWithChildren<{ className?: string }>): JSX.Element {
  return (
    <div
      className={cn(
        "space-y-4 text-sm leading-relaxed text-muted [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:tracking-tight [&>h3]:text-text",
        className,
      )}
    >
      {children}
    </div>
  );
}
