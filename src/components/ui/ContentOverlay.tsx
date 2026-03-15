"use client";

import { useEffect } from "react";
import type { CabinetConfig } from "@/lib/cabinets";
import { AboutContent } from "@/components/content/AboutContent";
import { ProjectsContent } from "@/components/content/ProjectsContent";
import { ResumeContent } from "@/components/content/ResumeContent";
import { ContactContent } from "@/components/content/ContactContent";
import { SkillsContent } from "@/components/content/SkillsContent";

interface ContentOverlayProps {
  cabinet: CabinetConfig;
  onExit: () => void;
}

const contentMap: Record<string, (color: string) => React.ReactNode> = {
  about: (c) => <AboutContent color={c} />,
  projects: (c) => <ProjectsContent color={c} />,
  resume: (c) => <ResumeContent color={c} />,
  contact: (c) => <ContactContent color={c} />,
  play: () => null,
  skills: (c) => <SkillsContent color={c} />,
};

export function ContentOverlay({ cabinet, onExit }: ContentOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onExit]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "#0a0014",
        color: "#ededed",
        overflow: "auto",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          background: "rgba(10, 0, 20, 0.9)",
          borderBottom: `1px solid ${cabinet.color}33`,
          backdropFilter: "blur(8px)",
        }}
      >
        <button
          onClick={onExit}
          className="font-pixel"
          style={{
            fontSize: "clamp(7px, 1.2vw, 10px)",
            color: "#00FFFF",
            textDecoration: "none",
            textShadow: "0 0 6px #00FFFF",
            transition: "opacity 0.2s",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          ← BACK TO ARCADE
        </button>
        <h1
          className="font-pixel"
          style={{
            fontSize: "clamp(8px, 1.5vw, 14px)",
            color: cabinet.color,
            textShadow: `0 0 8px ${cabinet.color}`,
            margin: 0,
          }}
        >
          {cabinet.title}
        </h1>
        <div style={{ width: 120 }} />
      </header>

      <main
        style={{
          padding: cabinet.id === "play" ? 0 : "2rem",
          maxWidth: cabinet.id === "play" ? "none" : 960,
          margin: cabinet.id === "play" ? 0 : "0 auto",
          overflow: cabinet.id === "play" ? "hidden" : undefined,
        }}
      >
        {contentMap[cabinet.id]?.(cabinet.color)}
      </main>
    </div>
  );
}
