import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  weight: ["400", "600"],
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peptide Script",
  description: "Clinical peptide research directory with transparent evidence summaries.",
  metadataBase: new URL("https://peptide-script.local"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-text">
        <NuqsAdapter>
          <ThemeProvider>
            <div className="clinical-shell">
              <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6">
                <header className="sticky top-0 z-20 mt-4 rounded-full border border-hairline bg-panel/85 px-5 py-3 shadow-[0_6px_20px_rgba(10,132,255,0.08)] backdrop-blur">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-br from-accent-blue to-accent-mint text-xs font-semibold text-white">
                        P
                      </span>
                      <span className="font-semibold tracking-tight">Peptide Atlas</span>
                    </Link>
                    <nav className="flex items-center gap-2 text-sm text-muted">
                      <Link href="/peptides" className="rounded-full px-3 py-1.5 hover:bg-panel-muted hover:text-text">
                        Peptides
                      </Link>
                      <Link href="/categories" className="rounded-full px-3 py-1.5 hover:bg-panel-muted hover:text-text">
                        Categories
                      </Link>
                      <Link href="/compare" className="rounded-full px-3 py-1.5 hover:bg-panel-muted hover:text-text">
                        Compare
                      </Link>
                    </nav>
                  </div>
                </header>
                <main className="flex-1 py-8">{children}</main>
                <SiteFooter />
              </div>
            </div>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
