"use client";

interface SkillCategory {
  name: string;
  color: string;
  skills: { name: string; level: number }[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "LANGUAGES",
    color: "#00FFFF",
    skills: [
      { name: "PYTHON", level: 90 },
      { name: "TYPESCRIPT", level: 90 },
      { name: "JAVASCRIPT", level: 90 },
      { name: "SQL", level: 85 },
      { name: "C++", level: 75 },
      { name: "PHP", level: 85 },
      { name: "RUBY", level: 75 },
      { name: "HTML", level: 90 },
      { name: "MATLAB", level: 70 },
      { name: "SWIFT (iOS)", level: 70 },
    ],
  },
  {
    name: "AI/ML",
    color: "#39FF14",
    skills: [
      { name: "TENSORFLOW", level: 85 },
      { name: "SCIKIT-LEARN", level: 85 },
      { name: "OPENCV", level: 75 },
      { name: "PANDAS", level: 85 },
      { name: "NEURAL NETWORKS", level: 85 },
      { name: "NLP", level: 80 },
      { name: "RAG", level: 80 },
      { name: "Q-LEARNING", level: 75 },
    ],
  },
  {
    name: "FRAMEWORKS & LIBRARIES",
    color: "#FF00FF",
    skills: [
      { name: "REACT", level: 90 },
      { name: "REACT NATIVE", level: 85 },
      { name: "NODE.JS", level: 85 },
      { name: "RUBY ON RAILS", level: 75 },
    ],
  },
  {
    name: "TOOLS & PLATFORMS",
    color: "#FFBF00",
    skills: [
      { name: "GIT", level: 90 },
      { name: "AWS", level: 80 },
      { name: "GCP", level: 75 },
      { name: "JIRA", level: 85 },
      { name: "DOCKER", level: 80 },
      { name: "POSTGRESQL", level: 85 },
      { name: "MCP SERVERS", level: 85 },
      { name: "JUPYTER NOTEBOOK", level: 85 },
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
        <span className="font-pixel" style={{ fontSize: 7, color: `${color}cc` }}>
          {name}
        </span>
        <span className="font-terminal" style={{ fontSize: 14, color: "#ffffff55" }}>
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

interface SkillsContentProps {
  color: string;
}

export function SkillsContent({ color }: SkillsContentProps) {
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
  );
}
