"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { getCategoryStyle } from "@/lib/category-style";
import type { Category } from "@/lib/types";

export function CategoryShowcase({
  categories,
}: {
  categories: Category[];
}): JSX.Element {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => {
        const style = getCategoryStyle(category.slug);
        const Icon = style.icon;
        return (
          <motion.div
            key={category.slug}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
          >
            <Link
              href={`/categories/${category.slug}`}
              className="lift-card group relative block h-full overflow-hidden p-5"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-90"
                style={{
                  background: `linear-gradient(180deg, ${style.surfaceFrom} 0%, transparent 100%)`,
                }}
              />
              <div className="relative flex items-start justify-between gap-3">
                <div
                  className="grid h-12 w-12 place-items-center rounded-2xl shadow-[0_4px_12px_rgba(11,65,125,0.06)]"
                  style={{ background: style.iconBg, color: style.iconColor }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <span className="font-mono text-xs text-muted">{category.count} peptides</span>
              </div>
              <h3 className="relative mt-4 text-lg font-semibold tracking-tight text-text">
                {category.name}
              </h3>
              <p className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                {category.description || "Curated peptides in this therapeutic category."}
              </p>
              <span
                className="relative mt-4 inline-flex items-center gap-1 text-xs font-medium transition-transform group-hover:translate-x-1"
                style={{ color: style.accent }}
              >
                Explore category
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
