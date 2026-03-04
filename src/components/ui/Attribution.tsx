"use client";

export function Attribution() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 6,
        right: 12,
        zIndex: 60,
        pointerEvents: "auto",
      }}
    >
      <a
        href="https://sketchfab.com/3d-models/blade-runner-arcade-cabinet-e7ebdd2a9ca64ece8f8c2c51e0edb9df"
        target="_blank"
        rel="noopener noreferrer"
        className="font-terminal"
        style={{
          fontSize: 12,
          color: "#ffffff44",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff88")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff44")}
      >
        Cabinet model by Glowbox 3D (CC BY)
      </a>
    </div>
  );
}
