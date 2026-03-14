"use client";

import Image from "next/image";
import { useState } from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";

interface AboutContentProps {
  color: string;
}

export function AboutContent({ color }: AboutContentProps) {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
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
            width: 480,
            height: 480,
            border: `2px solid ${color}`,
            boxShadow: `0 0 15px ${color}44, inset 0 0 15px ${color}11`,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            fontSize: 48,
            marginBottom: "1.5rem",
            overflow: "hidden",
          }}
        >
          {!avatarError ? (
            <Image
              src={SITE_CONFIG.avatarPath}
              alt={SITE_CONFIG.name}
              width={480}
              height={120}
              style={{ objectFit: "cover" }}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span>👾</span>
          )}
        </div>
        <h2
          className="font-pixel"
          style={{
            fontSize: "clamp(10px, 2vw, 16px)",
            color,
            textShadow: `0 0 8px ${color}`,
            textAlign: "center",
          }}
        >
          OLIVER RANEY
        </h2>
      </div>

      <div
        style={{
          background: "#000811",
          border: `1px solid ${color}33`,
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: `0 0 10px ${color}11`,
        }}
      >
        <div
          className="font-pixel"
          style={{
            fontSize: 8,
            color: `${color}88`,
            marginBottom: "1rem",
            borderBottom: `1px solid ${color}22`,
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
          Software Developer III at Paycom with a Master&apos;s degree in
          Artificial Intelligence/ML and a strong background in full-stack
          engineering. I offer a dual competency in building scalable web
          applications (React, TypeScript, PHP) and developing advanced AI
          solutions (LLMs, RAG, Neural Networks). Collaborative problem-solver
          eager to leverage expertise in machine learning and software
          architecture to deliver innovative solutions in a challenging
          environment.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
        }}
      >
        {[
          { label: "LOCATION", value: SITE_CONFIG.location, icon: "📍" },
          { label: "STATUS", value: "ONLINE", icon: "🟢" },
          { label: "CLASS", value: "SOFTWARE DEVELOPER III", icon: "⚔️" },
          {
            label: "QUEST",
            value: "BUILD INNOVATIVE AI & WEB SOLUTIONS",
            icon: "🎯",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#0a001488",
              border: `1px solid ${color}22`,
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: "0.5rem" }}>{stat.icon}</div>
            <div
              className="font-pixel"
              style={{ fontSize: 7, color: `${color}88`, marginBottom: "0.25rem" }}
            >
              {stat.label}
            </div>
            <div
              className="font-terminal"
              style={{ fontSize: 18, color }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
