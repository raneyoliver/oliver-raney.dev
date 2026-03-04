"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";

interface SkillCategory {
  name: string;
  color: string;
  skills: { name: string; level: number }[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "FRONTEND",
    color: "#00FFFF",
    skills: [
      { name: "REACT", level: 90 },
      { name: "TYPESCRIPT", level: 85 },
      { name: "NEXT.JS", level: 85 },
      { name: "THREE.JS", level: 70 },
      { name: "CSS/TAILWIND", level: 90 },
    ],
  },
  {
    name: "BACKEND",
    color: "#39FF14",
    skills: [
      { name: "NODE.JS", level: 85 },
      { name: "PYTHON", level: 75 },
      { name: "SQL", level: 80 },
      { name: "REST/GRAPHQL", level: 80 },
      { name: "DOCKER", level: 70 },
    ],
  },
  {
    name: "TOOLS & OTHER",
    color: "#FF00FF",
    skills: [
      { name: "GIT", level: 90 },
      { name: "LINUX", level: 75 },
      { name: "CI/CD", level: 70 },
      { name: "FIGMA", level: 60 },
      { name: "TESTING", level: 75 },
    ],
  },
];

function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.25rem",
        }}
      >
        <span
          className="font-pixel"
          style={{ fontSize: 7, color: `${color}cc` }}
        >
          {name}
        </span>
        <span
          className="font-terminal"
          style={{ fontSize: 14, color: "#ffffff55" }}
        >
          {level}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "#ffffff0a",
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${color}22`,
        }}
      >
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: `${level}%`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 8px ${color}66`,
            transition: "width 1s ease-out",
          }}
        />
        {/* Pixel-style segmentation */}
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(i + 1) * 10}%`,
              top: 0,
              width: 1,
              height: "100%",
              background: "#0a001488",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SkillsPage() {
  return (
    <PageWrapper title="SKILLS" color="#A855F7">
      <FloatingPixels />

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div
          className="font-pixel"
          style={{
            fontSize: 8,
            color: "#A855F788",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          {">"} stat --verbose skills.db
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {SKILL_CATEGORIES.map((category) => (
            <div
              key={category.name}
              style={{
                background: "#000811",
                border: `1px solid ${category.color}22`,
                padding: "1.25rem",
              }}
            >
              <h3
                className="font-pixel"
                style={{
                  fontSize: "clamp(8px, 1.3vw, 11px)",
                  color: category.color,
                  textShadow: `0 0 6px ${category.color}`,
                  marginBottom: "1rem",
                  paddingBottom: "0.5rem",
                  borderBottom: `1px solid ${category.color}22`,
                }}
              >
                {category.name}
              </h3>
              {category.skills.map((skill) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={category.color}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
