"use client";

import { ArcadeScene } from "@/components/three/ArcadeScene";
import { ScanlineOverlay } from "@/components/ui/ScanlineOverlay";
import { FloatingPixels } from "@/components/ui/FloatingPixels";
import { usePerformanceTier, getPixelCount } from "@/hooks/usePerformanceTier";

export default function Home() {
  const tier = usePerformanceTier();

  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <ArcadeScene />
      <FloatingPixels count={getPixelCount(tier)} />
      <ScanlineOverlay />
    </main>
  );
}
