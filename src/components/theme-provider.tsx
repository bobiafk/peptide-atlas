"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { PropsWithChildren } from "react";

export function ThemeProvider({ children }: PropsWithChildren): JSX.Element {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      themes={["light"]}
    >
      {children}
    </NextThemesProvider>
  );
}
