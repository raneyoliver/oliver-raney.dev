"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";

interface Project {
  title: string;
  description: string;
  tech: string[];
  color: string;
  status: string;
}

const PROJECTS: Project[] = [
  {
    title: "PROJECT ALPHA",
    description: "A full-stack web application with real-time features and modern architecture.",
    tech: ["React", "Node.js", "WebSocket"],
    color: "#FF00FF",
    status: "COMPLETE",
  },
  {
    title: "PROJECT BETA",
    description: "Interactive data visualization dashboard with custom charting engine.",
    tech: ["D3.js", "TypeScript", "Python"],
    color: "#00FFFF",
    status: "COMPLETE",
  },
  {
    title: "PROJECT GAMMA",
    description: "Mobile-first progressive web app with offline capabilities.",
    tech: ["Next.js", "PWA", "Tailwind"],
    color: "#39FF14",
    status: "IN PROGRESS",
  },
  {
    title: "PROJECT DELTA",
    description: "Machine learning pipeline with automated data processing and model training.",
    tech: ["Python", "TensorFlow", "Docker"],
    color: "#FFBF00",
    status: "COMPLETE",
  },
];

export default function ProjectsPage() {
  return (
    <PageWrapper title="PROJECTS" color="#FF00FF">
      <FloatingPixels />

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div
          className="font-pixel"
          style={{
            fontSize: 8,
            color: "#FF00FF88",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          {">"} ls -la ./projects/
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {PROJECTS.map((project) => (
            <div
              key={project.title}
              style={{
                background: "#000811",
                border: `1px solid ${project.color}33`,
                padding: "1.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 4,
                  height: "100%",
                  background: project.color,
                  boxShadow: `0 0 10px ${project.color}`,
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.75rem",
                }}
              >
                <h3
                  className="font-pixel"
                  style={{
                    fontSize: "clamp(8px, 1.5vw, 12px)",
                    color: project.color,
                    textShadow: `0 0 6px ${project.color}`,
                    margin: 0,
                  }}
                >
                  {project.title}
                </h3>
                <span
                  className="font-pixel"
                  style={{
                    fontSize: 7,
                    color: project.status === "IN PROGRESS" ? "#FFBF00" : "#39FF14",
                    textShadow: `0 0 4px ${project.status === "IN PROGRESS" ? "#FFBF00" : "#39FF14"}`,
                  }}
                >
                  [{project.status}]
                </span>
              </div>

              <p
                className="font-terminal"
                style={{
                  fontSize: "clamp(16px, 2vw, 20px)",
                  color: "#edededcc",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                {project.description}
              </p>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="font-pixel"
                    style={{
                      fontSize: 6,
                      color: project.color,
                      border: `1px solid ${project.color}44`,
                      padding: "0.25rem 0.5rem",
                      background: `${project.color}11`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
