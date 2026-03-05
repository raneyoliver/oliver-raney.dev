"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { CabinetRing } from "./CabinetRing";
import { NeonLighting } from "./NeonLighting";
import { RetroGrid } from "./RetroGrid";
import { StarfieldBg } from "./StarfieldBg";
import { CameraController } from "./CameraController";
import { FreeCamController } from "./FreeCamController";
import { CanvasRefSetter } from "./CanvasRefSetter";
import { ArcadeHUD } from "@/components/ui/ArcadeHUD";
import { useCarousel } from "@/hooks/useCarousel";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { usePerformanceTier, getStarCount } from "@/hooks/usePerformanceTier";
import { useEffect, useRef, useState, useCallback } from "react";
import type { CabinetConfig } from "@/lib/cabinets";

interface ArcadeSceneProps {
  onZoomedIn?: (cabinet: CabinetConfig) => void;
  overlayActive: boolean;
}

export function ArcadeScene({ onZoomedIn, overlayActive }: ArcadeSceneProps) {
  const tier = usePerformanceTier();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [freeCam, setFreeCam] = useState(false);
  const [freeCamPending, setFreeCamPending] = useState(false);
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
  } = useCarousel({ disableInput: freeCam });

  const bind = useSwipeGesture({
    onSwipeLeft: rotatePrev,
    onSwipeRight: rotateNext,
  });

  const handleEnter = useCallback(async () => {
    if (freeCam) setFreeCam(false);
    if (freeCamPending) setFreeCamPending(false);
    await enterCabinet();
    history.replaceState(null, "", activeCabinet.route);
    onZoomedIn?.(activeCabinet);
  }, [enterCabinet, activeCabinet, onZoomedIn, freeCam, freeCamPending]);

  const handleToggleFreeCam = useCallback(() => {
    if (freeCam) {
      document.exitPointerLock();
      setFreeCam(false);
    } else if (freeCamPending) {
      setFreeCamPending(false);
    } else {
      setFreeCamPending(true);
    }
  }, [freeCam, freeCamPending]);

  const handleCanvasAreaClick = useCallback(() => {
    if (!freeCamPending) return;
    canvasRef.current?.requestPointerLock();
    setFreeCam(true);
    setFreeCamPending(false);
  }, [freeCamPending]);

  const prevOverlayActive = useRef(false);
  useEffect(() => {
    if (prevOverlayActive.current && !overlayActive) {
      exitCabinet();
    }
    prevOverlayActive.current = overlayActive;
  }, [overlayActive, exitCabinet]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isZoomedIn && !freeCam && !freeCamPending) handleEnter();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleEnter, isZoomedIn, freeCam, freeCamPending]);

  return (
    <>
      <div
        {...bind()}
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          touchAction: "none",
        }}
      >
        {freeCamPending && (
          <div
            onClick={handleCanvasAreaClick}
            onKeyDown={(e) => e.key === "Enter" && handleCanvasAreaClick()}
            role="button"
            tabIndex={0}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.5)",
              cursor: "pointer",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(8px, 1.5vw, 12px)",
              color: "#00FFFF",
              textShadow: "0 0 8px #00FFFF",
            }}
          >
            CLICK TO START FREE CAM
          </div>
        )}
        <Canvas
          camera={{ position: [0, 0.4, 0], fov: 75, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: false }}
          dpr={tier === "low" ? [1, 1] : [1, 2]}
        >
          <color attach="background" args={["#0a0014"]} />
          <fog attach="fog" args={["#0a0014", 5, 15]} />
          <CanvasRefSetter canvasRef={canvasRef} />
          <Suspense fallback={null}>
            {freeCam ? (
              <FreeCamController onExit={() => setFreeCam(false)} />
            ) : (
              <CameraController
                zoomTarget={zoomTarget}
                currentZoom={currentZoom}
              />
            )}
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
        freeCam={freeCam}
        freeCamPending={freeCamPending}
        onToggleFreeCam={handleToggleFreeCam}
      />
    </>
  );
}
