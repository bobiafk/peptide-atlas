import {
  Activity,
  Brain,
  Droplet,
  Flame,
  HeartPulse,
  Leaf,
  Moon,
  Shield,
  Sparkles,
  Stethoscope,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface CategoryStyle {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  surfaceFrom: string;
  surfaceTo: string;
  accent: string;
  ring: string;
}

const FALLBACK: CategoryStyle = {
  icon: Sparkles,
  iconColor: "#7AB2FF",
  iconBg: "rgba(122,178,255,0.16)",
  surfaceFrom: "rgba(122,178,255,0.22)",
  surfaceTo: "rgba(13,20,38,0.35)",
  accent: "#7AB2FF",
  ring: "ring-[#2B4C7D]",
};

const STYLES: Record<string, CategoryStyle> = {
  "weight-loss": {
    icon: Flame,
    iconColor: "#7AB2FF",
    iconBg: "rgba(122,178,255,0.15)",
    surfaceFrom: "rgba(122,178,255,0.24)",
    surfaceTo: "rgba(11,18,34,0.3)",
    accent: "#7AB2FF",
    ring: "ring-[#2C4F82]",
  },
  "tissue-repair": {
    icon: HeartPulse,
    iconColor: "#FF8FA0",
    iconBg: "rgba(255,143,160,0.16)",
    surfaceFrom: "rgba(255,143,160,0.24)",
    surfaceTo: "rgba(14,16,29,0.32)",
    accent: "#FF9AAC",
    ring: "ring-[#703545]",
  },
  "growth-hormone": {
    icon: Activity,
    iconColor: "#50E3CD",
    iconBg: "rgba(80,227,205,0.15)",
    surfaceFrom: "rgba(80,227,205,0.24)",
    surfaceTo: "rgba(10,21,25,0.3)",
    accent: "#50E3CD",
    ring: "ring-[#2D625A]",
  },
  cognitive: {
    icon: Brain,
    iconColor: "#A38BFF",
    iconBg: "rgba(163,139,255,0.16)",
    surfaceFrom: "rgba(163,139,255,0.24)",
    surfaceTo: "rgba(17,13,33,0.32)",
    accent: "#B49EFF",
    ring: "ring-[#4F3E88]",
  },
  "skin-hair": {
    icon: Wand2,
    iconColor: "#FF7CB6",
    iconBg: "rgba(255,124,182,0.16)",
    surfaceFrom: "rgba(255,124,182,0.24)",
    surfaceTo: "rgba(24,13,25,0.32)",
    accent: "#FF8BC0",
    ring: "ring-[#6E3560]",
  },
  "anti-aging": {
    icon: Leaf,
    iconColor: "#7BECA8",
    iconBg: "rgba(123,236,168,0.16)",
    surfaceFrom: "rgba(123,236,168,0.24)",
    surfaceTo: "rgba(12,23,20,0.32)",
    accent: "#8BEEB2",
    ring: "ring-[#365E4B]",
  },
  immune: {
    icon: Shield,
    iconColor: "#83C1FF",
    iconBg: "rgba(131,193,255,0.16)",
    surfaceFrom: "rgba(131,193,255,0.24)",
    surfaceTo: "rgba(13,20,33,0.32)",
    accent: "#94CAFF",
    ring: "ring-[#335775]",
  },
  "sleep-stress": {
    icon: Moon,
    iconColor: "#9FAFFF",
    iconBg: "rgba(159,175,255,0.16)",
    surfaceFrom: "rgba(159,175,255,0.24)",
    surfaceTo: "rgba(14,16,34,0.32)",
    accent: "#AEBBFF",
    ring: "ring-[#4D4C84]",
  },
  "sexual-function": {
    icon: Droplet,
    iconColor: "#FFB36B",
    iconBg: "rgba(255,179,107,0.16)",
    surfaceFrom: "rgba(255,179,107,0.24)",
    surfaceTo: "rgba(25,17,11,0.32)",
    accent: "#FFC182",
    ring: "ring-[#705237]",
  },
  other: {
    icon: Zap,
    iconColor: "#BAC6DF",
    iconBg: "rgba(186,198,223,0.15)",
    surfaceFrom: "rgba(186,198,223,0.22)",
    surfaceTo: "rgba(14,17,26,0.34)",
    accent: "#C8D2E8",
    ring: "ring-[#49546A]",
  },
};

export function getCategoryStyle(slug: string): CategoryStyle {
  return STYLES[slug] ?? FALLBACK;
}

export const CATEGORY_FALLBACK_ICON = Stethoscope;
