"use client";

import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";

export default function AboutPage() {
  return (
    <PageWrapper title="ABOUT ME" color="#00FFFF">
      <FloatingPixels />

      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Avatar area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              border: "2px solid #00FFFF",
              boxShadow: "0 0 15px #00FFFF44, inset 0 0 15px #00FFFF11",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              marginBottom: "1.5rem",
            }}
          >
            👾
          </div>
          <h2
            className="font-pixel"
            style={{
              fontSize: "clamp(10px, 2vw, 16px)",
              color: "#00FFFF",
              textShadow: "0 0 8px #00FFFF",
              textAlign: "center",
            }}
          >
            OLIVER RANEY
          </h2>
        </div>

        {/* Bio terminal */}
        <div
          style={{
            background: "#000811",
            border: "1px solid #00FFFF33",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 0 10px #00FFFF11",
          }}
        >
          <div
            className="font-pixel"
            style={{
              fontSize: 8,
              color: "#00FFFF88",
              marginBottom: "1rem",
              borderBottom: "1px solid #00FFFF22",
              paddingBottom: "0.5rem",
            }}
          >
            {">"} cat about.txt
          </div>
          <p
            className="font-terminal"
            style={{
              fontSize: "clamp(16px, 2.5vw, 22px)",
              color: "#edededd0",
              lineHeight: 1.8,
            }}
          >
            Welcome to my corner of the digital world. I&apos;m a developer who
            loves building creative, interactive experiences on the web. When
            I&apos;m not coding, you can find me exploring new technologies,
            playing retro games, or tinkering with creative projects.
          </p>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            { label: "LOCATION", value: "EARTH.EXE", icon: "📍" },
            { label: "STATUS", value: "ONLINE", icon: "🟢" },
            { label: "CLASS", value: "DEVELOPER", icon: "⚔️" },
            { label: "QUEST", value: "BUILD COOL STUFF", icon: "🎯" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#0a001488",
                border: "1px solid #00FFFF22",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: "0.5rem" }}>{stat.icon}</div>
              <div
                className="font-pixel"
                style={{ fontSize: 7, color: "#00FFFF88", marginBottom: "0.25rem" }}
              >
                {stat.label}
              </div>
              <div
                className="font-terminal"
                style={{ fontSize: 18, color: "#00FFFF" }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
