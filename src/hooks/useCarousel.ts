"use client";

import { useState, useCallback, useEffect } from "react";
import { useSpring } from "@react-spring/three";
import { CABINETS } from "@/lib/cabinets";
import { ROTATION_STEP } from "@/lib/theme";

export function useCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = CABINETS.length;

  const [spring, api] = useSpring(() => ({
    rotation: 0,
    config: { mass: 2, tension: 120, friction: 30 },
  }));

  const rotateTo = useCallback(
    (index: number) => {
      setActiveIndex(index);
      api.start({ rotation: -index * ROTATION_STEP });
    },
    [api]
  );

  const rotateNext = useCallback(() => {
    const next = (activeIndex + 1) % count;
    rotateTo(next);
  }, [activeIndex, count, rotateTo]);

  const rotatePrev = useCallback(() => {
    const prev = (activeIndex - 1 + count) % count;
    rotateTo(prev);
  }, [activeIndex, count, rotateTo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "d") rotateNext();
      if (e.key === "ArrowLeft" || e.key === "a") rotatePrev();
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) rotateNext();
      else rotatePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [rotateNext, rotatePrev]);

  return {
    activeIndex,
    spring,
    rotateNext,
    rotatePrev,
    rotateTo,
    activeCabinet: CABINETS[activeIndex],
  };
}
