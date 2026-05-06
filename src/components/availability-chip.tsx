import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import type { Availability } from "@/lib/types";

const chipStyles = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] uppercase",
  {
    variants: {
      tone: {
        research: "border-[#DCEBFF] bg-[#F2F8FF] text-[#0A84FF]",
        prescription: "border-[#D6F4EB] bg-[#EEFBF7] text-[#0CA678]",
        compoundable: "border-[#D7EFFB] bg-[#EFF8FD] text-[#1C7ED6]",
        mixed: "border-[#ECDFFF] bg-[#F7F2FF] text-[#7048E8]",
        cosmetic: "border-[#FFE8CC] bg-[#FFF5E8] text-[#E67700]",
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
