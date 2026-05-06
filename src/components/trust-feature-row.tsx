"use client";

import { motion } from "framer-motion";
import { BookOpen, FileSearch, ShieldCheck, type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  color: string;
  tone: string;
}

const FEATURES: Feature[] = [
  {
    icon: BookOpen,
    title: "Peer-reviewed first",
    body: "Every claim ties back to a published study with cohort size, phase, and trial type.",
    color: "#0A84FF",
    tone: "rgba(10,132,255,0.08)",
  },
  {
    icon: FileSearch,
    title: "Transparent methodology",
    body: "We surface uncertainty — not just upside. Limited evidence is labeled clearly.",
    color: "#7048E8",
    tone: "rgba(112,72,232,0.08)",
  },
  {
    icon: ShieldCheck,
    title: "Patient-aware framing",
    body: "Mechanisms, FDA status, and availability — written for clinician + curious adult.",
    color: "#21C9A5",
    tone: "rgba(33,201,165,0.10)",
  },
];

export function TrustFeatureRow(): JSX.Element {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {FEATURES.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="lift-card flex flex-col gap-3 p-6"
          >
            <div
              className="grid h-12 w-12 place-items-center rounded-2xl"
              style={{ background: feature.tone, color: feature.color }}
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-text">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{feature.body}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
