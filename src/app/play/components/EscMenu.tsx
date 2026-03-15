"use client";

import Link from "next/link";

interface EscMenuProps {
  visible: boolean;
  onResume: () => void;
}

export default function EscMenu({ visible, onResume }: EscMenuProps) {
  if (!visible) return null;

  return (
    <div className="esc-menu-overlay">
      <div className="esc-menu-title">PAUSED</div>
      <button className="esc-menu-btn" onClick={onResume}>
        RESUME
      </button>
      <Link href="/" style={{ textDecoration: "none" }}>
        <button className="esc-menu-btn">
          BACK TO ARCADE
        </button>
      </Link>
    </div>
  );
}
