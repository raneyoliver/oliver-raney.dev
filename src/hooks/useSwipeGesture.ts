"use client";

import { useDrag } from "@use-gesture/react";
import { useCallback, useRef } from "react";

interface UseSwipeGestureOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: UseSwipeGestureOptions) {
  const hasFired = useRef(false);

  const bind = useDrag(
    useCallback(
      ({ movement: [mx], down, cancel }) => {
        if (!down) {
          hasFired.current = false;
          return;
        }
        if (hasFired.current) return;

        if (mx < -threshold) {
          hasFired.current = true;
          onSwipeLeft();
          cancel?.();
        } else if (mx > threshold) {
          hasFired.current = true;
          onSwipeRight();
          cancel?.();
        }
      },
      [onSwipeLeft, onSwipeRight, threshold]
    ),
    { axis: "x", filterTaps: true }
  );

  return bind;
}
