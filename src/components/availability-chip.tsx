import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { Availability } from "@/lib/types";

const chipStyles = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] uppercase",
  {
    variants: {
      tone: {
        research: "border-[#2c4f82] bg-[#0d1c38] text-[#9fc6ff]",
        prescription: "border-[#2d625a] bg-[#0d2522] text-[#8ff5e3]",
        compoundable: "border-[#335775] bg-[#0f2338] text-[#9ccfff]",
        mixed: "border-[#4f3e88] bg-[#181d3a] text-[#c2b3ff]",
        cosmetic: "border-[#705237] bg-[#2a2011] text-[#ffe2a4]",
      },
    },
  },
);

function toneFromAvailability(availability: Availability): "research" | "prescription" | "compoundable" | "mixed" | "cosmetic" {
  if (availability === "Prescription Available") return "prescription";
  if (availability === "Primarily Compoundable") return "compoundable";
  if (availability === "Mixed Availability") return "mixed";
  if (availability === "Cosmetic") return "cosmetic";
  return "research";
}

export function AvailabilityChip({ availability }: { availability: Availability }): JSX.Element {
  return <span className={cn(chipStyles({ tone: toneFromAvailability(availability) }))}>{availability}</span>;
}
