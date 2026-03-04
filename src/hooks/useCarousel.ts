"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { CABINETS } from "@/lib/cabinets";
import { ROTATION_STEP } from "@/lib/theme";

export function useCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const count = CABINETS.length;
  const wheelCooldown = useRef(false);

  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const zoomTarget = useRef(0);
  const currentZoom = useRef(0);

  const rotateTo = useCallback(
    (index: number) => {
      if (isZooming) return;
      setActiveIndex(index);
      targetRotation.current = -index * ROTATION_STEP;
    },
    [isZooming]
  );

  const rotateNext = useCallback(() => {
    if (isZooming) return;
    const next = (activeIndex + 1) % count;
    rotateTo(next);
  }, [activeIndex, count, rotateTo, isZooming]);

  const rotatePrev = useCallback(() => {
    if (isZooming) return;
    const prev = (activeIndex - 1 + count) % count;
    rotateTo(prev);
  }, [activeIndex, count, rotateTo, isZooming]);

  const enterCabinet = useCallback((): Promise<void> => {
    if (isZooming) return Promise.resolve();
    setIsZooming(true);
    zoomTarget.current = 1;
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (currentZoom.current > 0.95) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    });
  }, [isZooming]);

  const exitCabinet = useCallback(() => {
    setIsZooming(false);
    zoomTarget.current = 0;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZooming) return;
      if (e.key === "ArrowRight" || e.key === "d") rotateNext();
      if (e.key === "ArrowLeft" || e.key === "a") rotatePrev();
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isZooming || wheelCooldown.current) return;
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
  }, [rotateNext, rotatePrev, isZooming]);

  return {
    activeIndex,
    targetRotation,
    currentRotation,
    zoomTarget,
    currentZoom,
    isZooming,
    rotateNext,
    rotatePrev,
    rotateTo,
    enterCabinet,
    exitCabinet,
    activeCabinet: CABINETS[activeIndex],
  };
}
