"use client";

import { Html } from "@react-three/drei";
import type { CabinetConfig } from "@/lib/cabinets";

interface CabinetScreenProps {
  config: CabinetConfig;
  isActive: boolean;
}

function ScreenContent({ config, isActive }: CabinetScreenProps) {
  return (
    <div
      style={{
        width: 200,
        height: 160,
        background: "#000811",
        border: `1px solid ${config.color}33`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Press Start 2P', monospace",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, ${config.color}15 0%, transparent 70%)`,
        }}
      />

      <div
        style={{
          fontSize: 9,
          color: config.color,
          textShadow: `0 0 6px ${config.color}, 0 0 12px ${config.color}`,
          marginBottom: 8,
          textAlign: "center",
          lineHeight: 1.6,
          zIndex: 1,
          animation: isActive ? "none" : undefined,
        }}
      >
        {config.subtitle}
      </div>

      <AttractAnimation id={config.id} color={config.color} isActive={isActive} />

      {isActive && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            fontSize: 6,
            color: "#ffffff88",
            animation: "blink 1.5s step-end infinite",
            zIndex: 1,
          }}
        >
          PRESS ENTER
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scroll-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        @keyframes type-cursor {
          0%, 100% { border-right-color: transparent; }
          50% { border-right-color: currentColor; }
        }
        @keyframes pixel-rain {
          0% { transform: translateY(-10px); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function AttractAnimation({ id, color, isActive }: { id: string; color: string; isActive: boolean }) {
  switch (id) {
    case "about":
      return (
        <div style={{ zIndex: 1, textAlign: "center" }}>
          <div
            style={{
              fontSize: 20,
              animation: "blink 2s step-end infinite",
              marginBottom: 4,
            }}
          >
            👾
          </div>
          <div style={{ fontSize: 6, color: color + "aa", lineHeight: 1.8 }}>
            PLAYER 1<br />READY
          </div>
        </div>
      );

    case "projects":
      return (
        <div style={{ zIndex: 1, display: "flex", gap: 4, alignItems: "end" }}>
          {[0.6, 0.9, 0.5, 0.8, 0.7].map((h, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: h * 50,
                background: `linear-gradient(to top, ${color}, ${color}44)`,
                boxShadow: `0 0 4px ${color}66`,
                animation: isActive ? `pulse ${1 + i * 0.2}s ease-in-out infinite alternate` : undefined,
              }}
            />
          ))}
          <style>{`@keyframes pulse { 0% { opacity: 0.6; } 100% { opacity: 1; } }`}</style>
        </div>
      );

    case "resume":
      return (
        <div
          style={{
            zIndex: 1,
            fontSize: 6,
            color: color + "cc",
            lineHeight: 2,
            textAlign: "left",
            borderRight: "1px solid currentColor",
            paddingRight: 2,
            animation: "type-cursor 1s step-end infinite",
          }}
        >
          {">"} LOADING XP...<br />
          {">"} SKILLS: ████░░<br />
          {">"} LVL: MAX
        </div>
      );

    case "contact":
      return (
        <div style={{ zIndex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 16, marginBottom: 4 }}>✉</div>
          <div style={{ fontSize: 6, color: color + "aa", lineHeight: 1.8 }}>
            SEND<br />MESSAGE
          </div>
        </div>
      );

    case "blog":
      return (
        <div
          style={{
            zIndex: 1,
            overflow: "hidden",
            height: 60,
            width: 140,
          }}
        >
          <div
            style={{
              fontSize: 6,
              color: color + "bb",
              lineHeight: 2.2,
              animation: "scroll-up 8s linear infinite",
            }}
          >
            {">"} NEW POST LOADED<br />
            {">"} THOUGHTS.EXE<br />
            {">"} BLOG ACTIVE<br />
            {">"} ENTRIES: 42<br />
            {">"} STATUS: WRITING
          </div>
        </div>
      );

    case "skills":
      return (
        <div style={{ zIndex: 1, width: 140 }}>
          {["REACT", "THREE", "TS"].map((skill, i) => (
            <div key={skill} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 5, color: color + "aa", marginBottom: 1 }}>{skill}</div>
              <div
                style={{
                  height: 4,
                  background: "#ffffff11",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: `${70 + i * 10}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                    boxShadow: `0 0 4px ${color}`,
                    animation: isActive ? `grow-bar 2s ease-out ${i * 0.3}s both` : undefined,
                  }}
                />
              </div>
            </div>
          ))}
          <style>{`@keyframes grow-bar { 0% { width: 0%; } }`}</style>
        </div>
      );

    default:
      return null;
  }
}

export function CabinetScreen({ config, isActive }: CabinetScreenProps) {
  return (
    <Html
      transform
      occlude={false}
      position={[0, 0.15, 0.42]}
      scale={0.0045}
      style={{ pointerEvents: "none" }}
    >
      <ScreenContent config={config} isActive={isActive} />
    </Html>
  );
}
