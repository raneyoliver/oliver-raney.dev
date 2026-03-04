"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";

interface Experience {
  role: string;
  company: string;
  period: string;
  details: string[];
  color: string;
}

const EXPERIENCE: Experience[] = [
  {
    role: "SENIOR DEVELOPER",
    company: "TECH CORP",
    period: "2023 - PRESENT",
    details: [
      "Led development of customer-facing web applications",
      "Architected scalable microservices infrastructure",
      "Mentored junior developers and conducted code reviews",
    ],
    color: "#39FF14",
  },
  {
    role: "FULL STACK DEV",
    company: "STARTUP INC",
    period: "2021 - 2023",
    details: [
      "Built and maintained React/Node.js applications",
      "Implemented CI/CD pipelines and automated testing",
      "Contributed to open source projects",
    ],
    color: "#00FFFF",
  },
  {
    role: "JUNIOR DEVELOPER",
    company: "AGENCY CO",
    period: "2019 - 2021",
    details: [
      "Developed client websites and web applications",
      "Collaborated with design team on UI/UX",
      "Learned modern web development practices",
    ],
    color: "#FF00FF",
  },
];

const EDUCATION = [
  {
    degree: "B.S. COMPUTER SCIENCE",
    school: "UNIVERSITY",
    year: "2019",
    color: "#FFBF00",
  },
];

export default function ResumePage() {
  return (
    <PageWrapper title="RESUME" color="#39FF14">
      <FloatingPixels />

      <div style={{ maxWidth: 750, margin: "0 auto" }}>
        {/* Terminal header */}
        <div
          className="font-pixel"
          style={{
            fontSize: 8,
            color: "#39FF1488",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          {">"} cat resume.dat | parse --format=retro
        </div>

        {/* Experience section */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            className="font-pixel"
            style={{
              fontSize: "clamp(9px, 1.5vw, 13px)",
              color: "#39FF14",
              textShadow: "0 0 8px #39FF14",
              marginBottom: "1.5rem",
              borderBottom: "1px solid #39FF1433",
              paddingBottom: "0.5rem",
            }}
          >
            EXPERIENCE
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {EXPERIENCE.map((exp) => (
              <div
                key={exp.role + exp.company}
                style={{
                  background: "#000811",
                  border: `1px solid ${exp.color}22`,
                  padding: "1.25rem",
                  borderLeft: `3px solid ${exp.color}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h3
                    className="font-pixel"
                    style={{
                      fontSize: "clamp(7px, 1.3vw, 11px)",
                      color: exp.color,
                      textShadow: `0 0 6px ${exp.color}`,
                      margin: 0,
                    }}
                  >
                    {exp.role}
                  </h3>
                  <span
                    className="font-pixel"
                    style={{ fontSize: 7, color: "#ffffff55" }}
                  >
                    {exp.period}
                  </span>
                </div>
                <div
                  className="font-pixel"
                  style={{
                    fontSize: 7,
                    color: "#ffffff88",
                    marginBottom: "0.75rem",
                  }}
                >
                  @ {exp.company}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {exp.details.map((d, i) => (
                    <li
                      key={i}
                      className="font-terminal"
                      style={{
                        fontSize: "clamp(14px, 2vw, 18px)",
                        color: "#edededbb",
                        lineHeight: 1.8,
                        paddingLeft: "1rem",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          color: exp.color,
                        }}
                      >
                        ▸
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education section */}
        <section>
          <h2
            className="font-pixel"
            style={{
              fontSize: "clamp(9px, 1.5vw, 13px)",
              color: "#FFBF00",
              textShadow: "0 0 8px #FFBF00",
              marginBottom: "1.5rem",
              borderBottom: "1px solid #FFBF0033",
              paddingBottom: "0.5rem",
            }}
          >
            EDUCATION
          </h2>

          {EDUCATION.map((edu) => (
            <div
              key={edu.degree}
              style={{
                background: "#000811",
                border: `1px solid ${edu.color}22`,
                padding: "1.25rem",
                borderLeft: `3px solid ${edu.color}`,
              }}
            >
              <h3
                className="font-pixel"
                style={{
                  fontSize: "clamp(7px, 1.3vw, 11px)",
                  color: edu.color,
                  textShadow: `0 0 6px ${edu.color}`,
                  margin: 0,
                  marginBottom: "0.25rem",
                }}
              >
                {edu.degree}
              </h3>
              <div
                className="font-terminal"
                style={{ fontSize: 18, color: "#ffffff88" }}
              >
                {edu.school} &middot; {edu.year}
              </div>
            </div>
          ))}
        </section>
      </div>
    </PageWrapper>
  );
}
