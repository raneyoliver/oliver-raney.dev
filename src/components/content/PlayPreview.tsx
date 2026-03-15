"use client";

interface PlayPreviewProps {
  color: string;
}

export function PlayPreview({ color }: PlayPreviewProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: `${color}44`,
        fontSize: 10,
        fontFamily: "Press Start 2P, monospace",
      }}
    >
      PLAY
    </div>
  );
}
