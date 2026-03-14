"use client";

import { SITE_CONFIG } from "@/lib/siteConfig";

interface Project {
  title: string;
  description: string;
  tech: string[];
  color: string;
  status: string;
  url?: string;
}

const PROJECTS: Project[] = [
  {
    title: "HASHROOM – AGENTIC AI GROUP CHAT",
    description:
      "Mobile app featuring Model Context Protocol (MCP) support and graph memory context for agentic AI interactions. Engineered RAG systems for persistent LLM context. Expanded productivity use cases with MCP servers and fine-tuned parameters for personalized responses.",
    tech: ["MCP Server", "LLM", "NLP", "React Native", "TypeScript"],
    color: "#FF00FF",
    status: "COMPLETE",
  },
  {
    title: "REINFORCEMENT LEARNING IN DRONE SYSTEMS",
    description:
      "Paper published at ICASSP: Optimized drone triangulation using Q-Learning and Neural Networks. Led research team at SMU, delegating tasks and organizing final presentation for Lyle School of Engineering staff.",
    tech: ["Python", "Q-Learning", "Neural Networks"],
    color: "#00FFFF",
    status: "COMPLETE",
    url: `${SITE_CONFIG.github}/CS8321Labs-public/blob/main/lab5/Emitter%20Localization%20using%20Q-Learning%20Optimized%20Sensor%20Positioning.pdf`,
  },
  {
    title: "MAXIMIZING NEURON ACTIVATION IN CNNS",
    description:
      "Analyzed CNNs to identify circuits responsible for conceptual visualization, improving model interpretability. Produced visual insights into neuron activation to showcase findings on deep learning optimization.",
    tech: ["Python", "TensorFlow", "Scikit-learn", "Jupyter"],
    color: "#39FF14",
    status: "COMPLETE",
    url: `${SITE_CONFIG.github}/CS8321Labs-public/blob/main/lab3/lab3.ipynb`,
  },
  {
    title: "NEURAL NETWORK FROM SCRATCH",
    description:
      "Built and fine-tuned a Multi-layered Perceptron (MLP) neural network, manually implementing back-propagation algorithms to deepen understanding of model architecture.",
    tech: ["Python", "Scikit-learn", "TensorFlow"],
    color: "#FFBF00",
    status: "COMPLETE",
  },
  {
    title: "FRONTEND REACT NATIVE MOBILE APP",
    description:
      "Designed a cross-platform fitness application for logging workouts with a focus on intuitive UI/UX. Collaborated with team to ensure seamless integration of frontend designs with backend logic.",
    tech: ["React Native", "JavaScript", "iOS", "Android"],
    color: "#A855F7",
    status: "COMPLETE",
    url: `${SITE_CONFIG.github}/fisico-frontend-mvp-public`,
  },
  {
    title: "FULL-STACK WEB APPLICATION (A&M)",
    description:
      "Developed a full-stack tracker application for SASE at Texas A&M using Agile methodologies and daily Scrum. Managed client expectations and ensured product alignment through rigorous unit testing and continuous feedback loops.",
    tech: ["React", "Ruby on Rails", "PostgreSQL", "Cucumber"],
    color: "#FF6B6B",
    status: "COMPLETE",
    url: `${SITE_CONFIG.github}/SASE-Participation-Tracker-public`,
  },
];

interface ProjectsContentProps {
  color: string;
}

export function ProjectsContent({ color }: ProjectsContentProps) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div
        className="font-pixel"
        style={{
          fontSize: 8,
          color: `${color}88`,
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
                flexWrap: "wrap",
                gap: "0.5rem",
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
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      transition: "opacity 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    {project.title} ⟨↗⟩
                  </a>
                ) : (
                  project.title
                )}
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
  );
}
