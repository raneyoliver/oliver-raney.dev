"use client";

import type { CabinetConfig } from "@/lib/cabinets";

interface ArcadeHUDProps {
  activeCabinet: CabinetConfig;
  onEnter: () => void;
  isZooming: boolean;
}

export function ArcadeHUD({ activeCabinet, onEnter, isZooming }: ArcadeHUDProps) {
  if (isZooming) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2rem",
      }}
    >
      <div />

      {/* Bottom: Controls hint */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <button
          onClick={onEnter}
          style={{
            pointerEvents: "auto",
            background: "none",
            border: `1px solid ${activeCabinet.color}66`,
            color: activeCabinet.color,
            padding: "0.6rem 1.5rem",
            cursor: "pointer",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(7px, 1.2vw, 11px)",
            textShadow: `0 0 6px ${activeCabinet.color}`,
            boxShadow: `0 0 8px ${activeCabinet.color}33, inset 0 0 8px ${activeCabinet.color}11`,
            transition: "all 0.3s",
            alignSelf: "center",
          }}
        >
          INSERT COIN
        </button>
        <p
          className="font-terminal"
          style={{
            fontSize: "clamp(12px, 2vw, 18px)",
            color: "#ffffff55",
            letterSpacing: "0.1em",
          }}
        >
          ← → ROTATE &nbsp;|&nbsp; CLICK TO ENTER
        </p>
      </div>
    </div>
  );
}
