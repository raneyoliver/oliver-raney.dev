"use client";

import { useState, useEffect } from "react";
import type { CabinetConfig } from "@/lib/cabinets";

interface ArcadeHUDProps {
  activeCabinet: CabinetConfig;
  onEnter: () => void;
  isZooming: boolean;
  freeCam: boolean;
  freeCamPending: boolean;
  onToggleFreeCam: () => void;
}

export function ArcadeHUD({ activeCabinet, onEnter, isZooming, freeCam, freeCamPending, onToggleFreeCam }: ArcadeHUDProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

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
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {isDesktop && (
          <button
            onClick={onToggleFreeCam}
            style={{
              pointerEvents: "auto",
              background: freeCam ? "rgba(0, 255, 255, 0.15)" : freeCamPending ? "rgba(255, 191, 0, 0.15)" : "none",
              border: `1px solid ${freeCam ? "#00FFFF" : freeCamPending ? "#FFBF00" : "#00FFFF66"}`,
              color: freeCamPending ? "#FFBF00" : "#00FFFF",
              padding: "0.4rem 0.8rem",
              cursor: "pointer",
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(6px, 1vw, 9px)",
              textShadow: freeCamPending ? "0 0 6px #FFBF00" : "0 0 6px #00FFFF",
              boxShadow: freeCam ? "0 0 8px #00FFFF44" : freeCamPending ? "0 0 8px #FFBF0044" : "none",
              transition: "all 0.2s",
            }}
          >
            {freeCam ? "FREE CAM ON" : freeCamPending ? "CANCEL" : "FREE CAM"}
          </button>
        )}
      </div>

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
          {freeCam ? "WASD MOVE &nbsp;|&nbsp; MOUSE LOOK &nbsp;|&nbsp; ESC EXIT" : "← → ROTATE &nbsp;|&nbsp; CLICK TO ENTER"}
        </p>
      </div>
    </div>
  );
}
