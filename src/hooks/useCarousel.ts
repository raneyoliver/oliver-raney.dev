"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { CABINETS } from "@/lib/cabinets";
import { ROTATION_STEP } from "@/lib/theme";

export function useCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const count = CABINETS.length;
  const wheelCooldown = useRef(false);

  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const zoomTarget = useRef(0);
  const currentZoom = useRef(0);

  const rotateTo = useCallback(
    (index: number) => {
      if (isZooming || isZoomedIn) return;
      setActiveIndex(index);
      const newTarget = -index * ROTATION_STEP;
      let delta = newTarget - targetRotation.current;
      delta = ((delta % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
      targetRotation.current += delta;
    },
    [isZooming, isZoomedIn]
  );

  const rotateNext = useCallback(() => {
    if (isZooming || isZoomedIn) return;
    const next = (activeIndex + 1) % count;
    rotateTo(next);
  }, [activeIndex, count, rotateTo, isZooming, isZoomedIn]);

  const rotatePrev = useCallback(() => {
    if (isZooming || isZoomedIn) return;
    const prev = (activeIndex - 1 + count) % count;
    rotateTo(prev);
  }, [activeIndex, count, rotateTo, isZooming, isZoomedIn]);

  const enterCabinet = useCallback((): Promise<void> => {
    if (isZooming || isZoomedIn) return Promise.resolve();
    setIsZooming(true);
    zoomTarget.current = 1;
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (currentZoom.current > 0.95) {
          clearInterval(check);
          setIsZoomedIn(true);
          resolve();
        }
      }, 50);
    });
  }, [isZooming, isZoomedIn]);

  const exitCabinet = useCallback(() => {
    setIsZoomedIn(false);
    setIsZooming(false);
    zoomTarget.current = 0;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZooming || isZoomedIn) return;
      if (e.key === "ArrowRight" || e.key === "d") rotatePrev();
      if (e.key === "ArrowLeft" || e.key === "a") rotateNext();
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isZooming || isZoomedIn || wheelCooldown.current) return;
      wheelCooldown.current = true;
      setTimeout(() => { wheelCooldown.current = false; }, 400);
      if (e.deltaY > 0) rotateNext();
      else rotatePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [rotateNext, rotatePrev, isZooming, isZoomedIn]);

  return {
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
    activeCabinet: CABINETS[activeIndex],
  };
}
