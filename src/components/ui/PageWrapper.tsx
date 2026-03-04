"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ScanlineOverlay } from "./ScanlineOverlay";

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
  color: string;
}

export function PageWrapper({ children, title, color }: PageWrapperProps) {
  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0014",
        color: "#ededed",
        overflow: "auto",
      }}
    >
      <ScanlineOverlay />

      {/* Top bar */}
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
          borderBottom: `1px solid ${color}33`,
          backdropFilter: "blur(8px)",
        }}
      >
        <Link
          href="/"
          className="font-pixel"
          style={{
            fontSize: "clamp(7px, 1.2vw, 10px)",
            color: "#00FFFF",
            textDecoration: "none",
            textShadow: "0 0 6px #00FFFF",
            transition: "opacity 0.2s",
          }}
        >
          ← BACK TO ARCADE
        </Link>
        <h1
          className="font-pixel"
          style={{
            fontSize: "clamp(8px, 1.5vw, 14px)",
            color: color,
            textShadow: `0 0 8px ${color}`,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <div style={{ width: 120 }} />
      </header>

      {/* Content */}
      <main style={{ padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
