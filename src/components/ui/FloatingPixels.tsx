"use client";

import { useState, useEffect } from "react";

const PIXEL_SPRITES = ["★", "♦", "●", "▲", "♥", "✦", "◆", "✶"];
const COLORS = ["#00FFFF", "#FF00FF", "#39FF14", "#FFBF00", "#FF6B6B", "#A855F7"];

interface Particle {
  id: number;
  char: string;
  color: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

interface FloatingPixelsProps {
  count?: number;
}

export function FloatingPixels({ count = 15 }: FloatingPixelsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        char: PIXEL_SPRITES[Math.floor(Math.random() * PIXEL_SPRITES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 10 + Math.random() * 15,
        size: 8 + Math.random() * 14,
      }))
    );
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 40,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="animate-float-up"
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-20px",
            fontSize: p.size,
            color: p.color,
            opacity: 0,
            textShadow: `0 0 6px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
