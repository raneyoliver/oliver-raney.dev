"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSpring } from "@react-spring/three";
import { CABINETS } from "@/lib/cabinets";
import { ROTATION_STEP } from "@/lib/theme";

export function useCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const count = CABINETS.length;
  const wheelCooldown = useRef(false);

  const [spring, api] = useSpring(() => ({
    rotation: 0,
    config: { mass: 2, tension: 120, friction: 30 },
  }));

  const [zoomSpring, zoomApi] = useSpring(() => ({
    zoom: 0,
    config: { mass: 1, tension: 100, friction: 20 },
  }));

  const rotateTo = useCallback(
    (index: number) => {
      if (isZooming) return;
      setActiveIndex(index);
      api.start({ rotation: -index * ROTATION_STEP });
    },
    [api, isZooming]
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
    return new Promise((resolve) => {
      zoomApi.start({
        zoom: 1,
        onRest: () => resolve(),
      });
    });
  }, [isZooming, zoomApi]);

  const exitCabinet = useCallback(() => {
    setIsZooming(false);
    zoomApi.start({ zoom: 0 });
  }, [zoomApi]);

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
    spring,
    zoomSpring,
    isZooming,
    rotateNext,
    rotatePrev,
    rotateTo,
    enterCabinet,
    exitCabinet,
    activeCabinet: CABINETS[activeIndex],
  };
}
