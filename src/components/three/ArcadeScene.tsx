"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { CabinetRing } from "./CabinetRing";
import { NeonLighting } from "./NeonLighting";
import { RetroGrid } from "./RetroGrid";
import { StarfieldBg } from "./StarfieldBg";
import { CameraController } from "./CameraController";
import { ArcadeHUD } from "@/components/ui/ArcadeHUD";
import { useCarousel } from "@/hooks/useCarousel";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { usePerformanceTier, getStarCount } from "@/hooks/usePerformanceTier";
import { useEffect, useCallback, useRef } from "react";
import type { CabinetConfig } from "@/lib/cabinets";

interface ArcadeSceneProps {
  onZoomedIn?: (cabinet: CabinetConfig) => void;
  overlayActive: boolean;
}

export function ArcadeScene({ onZoomedIn, overlayActive }: ArcadeSceneProps) {
  const tier = usePerformanceTier();
  const {
    activeIndex,
    targetRotation,
    currentRotation,
    zoomTarget,
    currentZoom,
    isZooming,
    isZoomedIn,
    rotateNext,
    rotatePrev,
    rotateTo,
    enterCabinet,
    exitCabinet,
    activeCabinet,
  } = useCarousel();

  const bind = useSwipeGesture({
    onSwipeLeft: rotatePrev,
    onSwipeRight: rotateNext,
  });

  const handleEnter = useCallback(async () => {
    await enterCabinet();
    history.replaceState(null, "", activeCabinet.route);
    onZoomedIn?.(activeCabinet);
  }, [enterCabinet, activeCabinet, onZoomedIn]);

  const prevOverlayActive = useRef(false);
  useEffect(() => {
    if (prevOverlayActive.current && !overlayActive) {
      exitCabinet();
    }
    prevOverlayActive.current = overlayActive;
  }, [overlayActive, exitCabinet]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isZoomedIn) handleEnter();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleEnter, isZoomedIn]);

  return (
    <>
      <div {...bind()} style={{ width: "100vw", height: "100vh", touchAction: "none" }}>
        <Canvas
          camera={{ position: [0, 0.4, 0], fov: 75, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: false }}
          dpr={tier === "low" ? [1, 1] : [1, 2]}
        >
          <color attach="background" args={["#0a0014"]} />
          <fog attach="fog" args={["#0a0014", 5, 15]} />
          <Suspense fallback={null}>
            <CameraController
              zoomTarget={zoomTarget}
              currentZoom={currentZoom}
            />
            <Environment preset="night" environmentIntensity={0.5} />
            <NeonLighting />
            <CabinetRing
              targetRotation={targetRotation}
              currentRotation={currentRotation}
              activeIndex={activeIndex}
              onSelectCabinet={rotateTo}
            />
            <RetroGrid />
            <StarfieldBg count={getStarCount(tier)} />
          </Suspense>
        </Canvas>
      </div>
      <ArcadeHUD
        activeCabinet={activeCabinet}
        onEnter={handleEnter}
        isZooming={isZooming}
      />
    </>
  );
}
