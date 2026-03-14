"use client";

interface Experience {
  role: string;
  company: string;
  period: string;
  details: string[];
  color: string;
}

const EXPERIENCE: Experience[] = [
  {
    role: "SOFTWARE DEVELOPER III",
    company: "PAYCOM | IRVING, TX",
    period: "PRESENT",
    details: [
      "Core Stack: TypeScript, React, PHP, SQL, JIRA",
      "Drive full-stack web development, implementing tangible backend upgrades that actively improve client system performance",
      "Manage the complete software lifecycle, maintaining code quality and tracking issues via JIRA while consistently meeting team deadlines",
      "Collaborate with cross-functional teams to deploy responsive, high-availability web solutions",
    ],
    color: "#39FF14",
  },
  {
    role: "DATA ENGINEER",
    company: "CAPGEMINI | DALLAS, TX",
    period: "JUL 2021 – NOV 2022",
    details: [
      "Core Stack: Python, SQL, Data Transformation",
      "Engineered data accessibility solutions for Citibank, optimizing workflows to save over 6,000 minutes bi-annually",
      "Leveraged Python and SQL to manage large-scale databases, delivering efficient and scalable data transformations",
      "Demonstrated adaptability and strong time management by balancing multiple high-priority projects in a fast-paced corporate environment",
    ],
    color: "#00FFFF",
  },
];

interface EducationEntry {
  degree: string;
  school: string;
  year: string;
  color: string;
  details?: string;
}

const EDUCATION: EducationEntry[] = [
  {
    degree: "M.S. COMPUTER SCIENCE (AI/ML SPECIALIZATION)",
    school: "SOUTHERN METHODIST UNIVERSITY (SMU) | DALLAS, TX",
    year: "DEC 2024",
    details: "GPA: 3.60/4.00 · Relevant Courses: Artificial Intelligence, Machine Learning & Neural Networks, NLP, Algorithm Engineering",
    color: "#FFBF00",
  },
  {
    degree: "B.S. COMPUTER SCIENCE",
    school: "TEXAS A&M UNIVERSITY | COLLEGE STATION, TX",
    year: "MAY 2021",
    details: "Minors: Mathematics, Cybersecurity",
    color: "#FF00FF",
  },
];

interface ResumeContentProps {
  color: string;
}

export function ResumeContent({ color }: ResumeContentProps) {
  return (
    <div style={{ maxWidth: 750, margin: "0 auto" }}>
      <div
        className="font-pixel"
        style={{
          fontSize: 8,
          color: `${color}88`,
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        {">"} cat resume.dat | parse --format=retro
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <h2
          className="font-pixel"
          style={{
            fontSize: "clamp(9px, 1.5vw, 13px)",
            color,
            textShadow: `0 0 8px ${color}`,
            marginBottom: "1.5rem",
            borderBottom: `1px solid ${color}33`,
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
              style={{
                fontSize: 18,
                color: "#ffffff88",
                marginBottom: edu.details ? "0.5rem" : 0,
              }}
            >
              {edu.school} &middot; {edu.year}
            </div>
            {edu.details ? (
              <div
                className="font-terminal"
                style={{ fontSize: 14, color: "#ffffff66" }}
              >
                {edu.details}
              </div>
            ) : null}
          </div>
        ))}
      </section>
    </div>
  );
}
