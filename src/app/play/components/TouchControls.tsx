"use client";

import { useRef, useEffect, useCallback, useState } from "react";

interface TouchControlsProps {
  visible: boolean;
  onMove: (dx: number, dy: number) => void;
  onRotate: (delta: number) => void;
  onFire: () => void;
}

export default function TouchControls({ visible, onMove, onRotate, onFire }: TouchControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const joystickCenter = useRef({ x: 0, y: 0 });
  const rotateRef = useRef<{ id: number; lastX: number } | null>(null);
  const moveInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentMove = useRef({ dx: 0, dy: 0 });

  const handleJoystickStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = joystickRef.current?.getBoundingClientRect();
    if (!rect) return;
    joystickCenter.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    setJoystickActive(true);

    moveInterval.current = setInterval(() => {
      if (currentMove.current.dx !== 0 || currentMove.current.dy !== 0) {
        onMove(currentMove.current.dx, currentMove.current.dy);
      }
    }, 16);
  }, [onMove]);

  const handleJoystickMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (!joystickActive) return;
    const touch = e.touches[0];
    const dx = touch.clientX - joystickCenter.current.x;
    const dy = touch.clientY - joystickCenter.current.y;
    const dist = Math.hypot(dx, dy);
    const maxDist = 50;
    const clampDist = Math.min(dist, maxDist);
    const normDx = dist > 0 ? (dx / dist) * clampDist : 0;
    const normDy = dist > 0 ? (dy / dist) * clampDist : 0;

    if (knobRef.current) {
      knobRef.current.style.transform = `translate(calc(-50% + ${normDx}px), calc(-50% + ${normDy}px))`;
    }
    currentMove.current = { dx: normDx / maxDist, dy: normDy / maxDist };
  }, [joystickActive]);

  const handleJoystickEnd = useCallback(() => {
    setJoystickActive(false);
    currentMove.current = { dx: 0, dy: 0 };
    if (knobRef.current) {
      knobRef.current.style.transform = "translate(-50%, -50%)";
    }
    if (moveInterval.current) {
      clearInterval(moveInterval.current);
      moveInterval.current = null;
    }
  }, []);

  // Right side rotation area
  useEffect(() => {
    if (!visible) return;
    const handleTouchStart = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.clientX > window.innerWidth / 2 && t.clientY < window.innerHeight - 150) {
          rotateRef.current = { id: t.identifier, lastX: t.clientX };
        }
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!rotateRef.current) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === rotateRef.current.id) {
          const delta = t.clientX - rotateRef.current.lastX;
          rotateRef.current.lastX = t.clientX;
          onRotate(delta * 2);
        }
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (rotateRef.current && e.changedTouches[i].identifier === rotateRef.current.id) {
          rotateRef.current = null;
        }
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [visible, onRotate]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={joystickRef}
        className="touch-joystick"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
      >
        <div ref={knobRef} className="touch-joystick-knob" />
      </div>
      <div className="touch-fire-btn" onTouchStart={(e) => { e.preventDefault(); onFire(); }} />
    </>
  );
}
