"use client";
import { forwardRef } from "react";

const GameCanvas = forwardRef<HTMLCanvasElement>(function GameCanvas(_props, ref) {
  return <canvas ref={ref} className="game-canvas" />;
});

export default GameCanvas;
