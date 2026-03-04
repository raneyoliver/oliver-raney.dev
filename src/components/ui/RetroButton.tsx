"use client";

interface RetroButtonProps {
  children: React.ReactNode;
  color?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function RetroButton({
  children,
  color = "#00FFFF",
  onClick,
  className = "",
}: RetroButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`font-pixel ${className}`}
      style={{
        background: "transparent",
        border: `2px solid ${color}`,
        color: color,
        padding: "0.8rem 1.5rem",
        fontSize: "clamp(7px, 1.2vw, 11px)",
        cursor: "pointer",
        textShadow: `0 0 6px ${color}`,
        boxShadow: `0 0 10px ${color}44, inset 0 0 10px ${color}11`,
        transition: "all 0.2s",
        letterSpacing: "0.1em",
      }}
    >
      {children}
    </button>
  );
}
