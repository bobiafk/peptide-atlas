import type { PropsWithChildren } from "react";

export function BentoGrid({ children }: PropsWithChildren): JSX.Element {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}
