import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  title: "Peptide Atlas — Evidence-first peptide intelligence",
  description:
    "Curated peptide research with mechanisms, trial phases, and transparent evidence summaries.",
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
              <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 md:px-6">
                <SiteHeader />
                <main className="flex-1 py-10 md:py-14">{children}</main>
                <SiteFooter />
              </div>
            </div>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
