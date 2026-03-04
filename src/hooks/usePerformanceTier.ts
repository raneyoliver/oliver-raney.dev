"use client";

import { useMemo } from "react";

export type PerformanceTier = "low" | "medium" | "high";

export function usePerformanceTier(): PerformanceTier {
  return useMemo(() => {
    if (typeof window === "undefined") return "medium";

    const cores = navigator.hardwareConcurrency ?? 4;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const memoryGB = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;

    if (isMobile && (cores <= 4 || memoryGB <= 2)) return "low";
    if (isMobile || cores <= 4) return "medium";
    return "high";
  }, []);
}

export function getStarCount(tier: PerformanceTier): number {
  switch (tier) {
    case "low": return 150;
    case "medium": return 300;
    case "high": return 500;
  }
}

export function getPixelCount(tier: PerformanceTier): number {
  switch (tier) {
    case "low": return 5;
    case "medium": return 10;
    case "high": return 15;
  }
}
