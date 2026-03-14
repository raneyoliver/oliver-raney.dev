"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/lib/siteConfig";

interface ContactContentProps {
  color: string;
}

export function ContactContent({ color }: ContactContentProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#000811",
    border: `1px solid ${color}33`,
    color,
    padding: "0.75rem",
    fontFamily: "'VT323', monospace",
    fontSize: 18,
    outline: "none",
    boxShadow: `inset 0 0 5px ${color}11`,
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div
        className="font-pixel"
        style={{
          fontSize: 8,
          color: `${color}88`,
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        {">"} open --channel=communication
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "GITHUB", url: SITE_CONFIG.github, icon: "⟨/⟩" },
          { label: "LINKEDIN", url: SITE_CONFIG.linkedin, icon: "in" },
          { label: "EMAIL", url: `mailto:${SITE_CONFIG.email}`, icon: "✉" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="font-pixel"
            style={{
              fontSize: 8,
              color,
              textDecoration: "none",
              border: `1px solid ${color}44`,
              padding: "0.75rem 1rem",
              textShadow: `0 0 6px ${color}`,
              boxShadow: `0 0 8px ${color}22`,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 14 }}>{link.icon}</span>
            {link.label}
          </a>
        ))}
      </div>

      {submitted ? (
        <div
          style={{
            background: "#000811",
            border: "1px solid #39FF1433",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: "1rem" }}>✓</div>
          <p
            className="font-pixel"
            style={{
              fontSize: 10,
              color: "#39FF14",
              textShadow: "0 0 6px #39FF14",
            }}
          >
            MESSAGE SENT!
          </p>
          <p
            className="font-terminal"
            style={{ fontSize: 18, color: "#ffffff88", marginTop: "0.5rem" }}
          >
            Thanks for reaching out. I&apos;ll get back to you soon.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <label
              className="font-pixel"
              style={{
                fontSize: 7,
                color: `${color}88`,
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              NAME
            </label>
            <input
              type="text"
              required
              placeholder="ENTER YOUR NAME..."
              style={inputStyle}
            />
          </div>

          <div>
            <label
              className="font-pixel"
              style={{
                fontSize: 7,
                color: `${color}88`,
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              EMAIL
            </label>
            <input
              type="email"
              required
              placeholder="YOUR@EMAIL.COM"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              className="font-pixel"
              style={{
                fontSize: 7,
                color: `${color}88`,
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              MESSAGE
            </label>
            <textarea
              required
              rows={5}
              placeholder="TYPE YOUR MESSAGE..."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            className="font-pixel"
            style={{
              background: "transparent",
              border: `2px solid ${color}`,
              color,
              padding: "0.8rem",
              fontSize: 10,
              cursor: "pointer",
              textShadow: `0 0 6px ${color}`,
              boxShadow: `0 0 10px ${color}44`,
              transition: "all 0.2s",
              alignSelf: "center",
              marginTop: "0.5rem",
            }}
          >
            SEND TRANSMISSION
          </button>
        </form>
      )}
    </div>
  );
}
