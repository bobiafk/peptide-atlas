"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { MoleculeMotif } from "@/components/molecule-motif";

interface HomeHeroProps {
  peptideCount: number;
  studyCount: number;
  categoryCount: number;
}

export function HomeHero({
  peptideCount,
  studyCount,
  categoryCount,
}: HomeHeroProps): JSX.Element {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <section className="hero-mesh relative isolate -mx-6 overflow-hidden px-6 py-14 md:-mx-10 md:px-10 md:py-16 lg:-mx-12 lg:px-12 lg:py-20">
      <Image
        src="/07-dna-peptide (1).webp"
        alt="DNA peptide structure"
        fill
        className="object-cover object-[70%_center] opacity-50"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(4,10,22,0.95)_0%,rgba(4,10,22,0.88)_42%,rgba(5,13,28,0.58)_68%,rgba(7,15,31,0.72)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(110,168,255,0.28),transparent_45%),radial-gradient(circle_at_85%_22%,rgba(157,133,255,0.22),transparent_45%)]" />
      <MoleculeMotif className="molecule-svg float-slow -right-8 top-4 hidden h-80 w-80 lg:block" />

      <div className="relative space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0a1326]/55 px-3.5 py-1.5 text-[12px] font-medium text-accent-blue backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
          Evidence-first peptide intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="max-w-3xl text-[46px] font-semibold leading-[1.01] tracking-[-0.02em] md:text-[76px]"
        >
          The science of peptides,
          <br className="hidden md:block" />{" "}
          <span className="gradient-text">distilled beautifully.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="max-w-2xl text-base leading-relaxed text-[#c3d3f2] md:text-[19px]"
        >
          Curated mechanisms, trial phases, sample sizes, and human-grade summaries
          across {peptideCount} compounds — engineered for fast, defensible decisions.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          onSubmit={(event) => {
            event.preventDefault();
            const trimmed = query.trim();
            router.push(trimmed ? `/peptides?q=${encodeURIComponent(trimmed)}` : "/peptides");
          }}
          className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-white/15 bg-[#0a1326]/55 p-1.5 pl-4 backdrop-blur"
        >
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Retatrutide, BPC-157, GHK-Cu…"
            className="flex-1 bg-transparent py-2 text-sm text-text outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue px-5 py-2 text-sm font-semibold text-[#061021] shadow-[0_8px_20px_rgba(110,168,255,0.32)] transition hover:brightness-110"
          >
            Explore
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="grid max-w-xl grid-cols-3 gap-2 pt-2"
        >
          <Stat label="Peptides" value={peptideCount} />
          <Stat label="Categories" value={categoryCount} />
          <Stat label="Studies indexed" value={studyCount} />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }): JSX.Element {
  return (
    <div className="rounded-xl border border-white/15 bg-[#0a1326]/60 px-3 py-2.5 backdrop-blur">
      <p className="font-mono text-base font-semibold text-text">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted">{label}</p>
    </div>
  );
}
