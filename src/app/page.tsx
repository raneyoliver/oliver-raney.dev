"use client";

import { useState, useCallback } from "react";
import { ArcadeScene } from "@/components/three/ArcadeScene";
import { ScanlineOverlay } from "@/components/ui/ScanlineOverlay";
import { FloatingPixels } from "@/components/ui/FloatingPixels";
import { Attribution } from "@/components/ui/Attribution";
import { ContentOverlay } from "@/components/ui/ContentOverlay";
import { usePerformanceTier, getPixelCount } from "@/hooks/usePerformanceTier";
import type { CabinetConfig } from "@/lib/cabinets";

export default function Home() {
  const tier = usePerformanceTier();
  const [activeCabinet, setActiveCabinet] = useState<CabinetConfig | null>(null);

  const handleZoomedIn = useCallback((cabinet: CabinetConfig) => {
    setActiveCabinet(cabinet);
  }, []);

  const handleExit = useCallback(() => {
    setActiveCabinet(null);
    history.replaceState(null, "", "/");
  }, []);

  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <div style={{ visibility: activeCabinet ? "hidden" : "visible", width: "100%", height: "100%" }}>
        <ArcadeScene onZoomedIn={handleZoomedIn} overlayActive={!!activeCabinet} />
      </div>
      {!activeCabinet && <FloatingPixels count={getPixelCount(tier)} />}
      <ScanlineOverlay />
      {!activeCabinet && <Attribution />}
      {activeCabinet && (
        <ContentOverlay cabinet={activeCabinet} onExit={handleExit} />
      )}
    </main>
  );
}
