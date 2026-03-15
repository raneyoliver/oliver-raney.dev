"use client";

interface GameHUDProps {
  hearts: number;
  maxHearts: number;
  timer: number;
  score: number;
  recentHit: boolean;
  instructions?: string | null;
}

function HeartSVG({ filled, hit }: { filled: boolean; hit: boolean }) {
  return (
    <svg
      className={`hud-heart${filled ? "" : " empty"}${hit ? " hit" : ""}`}
      viewBox="0 0 24 24"
      fill={filled ? "#ff6b6b" : "none"}
      stroke={filled ? "#ff6b6b" : "#ff6b6b44"}
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function GameHUD({ hearts, maxHearts, timer, score, recentHit, instructions }: GameHUDProps) {
  const timerStr = timer.toFixed(1);
  const isWarning = timer <= 5 && timer > 0;

  return (
    <div className="game-hud-container">
      <div className="game-hud">
      <div className="hud-hearts">
        {Array.from({ length: maxHearts }, (_, i) => (
          <HeartSVG
            key={i}
            filled={i < hearts}
            hit={recentHit && i === hearts}
          />
        ))}
      </div>
      <div className={`hud-timer${isWarning ? " warning" : ""}`}>
        {timerStr}s
      </div>
      <div className="hud-score">
        SCORE {score}
      </div>
      </div>
      {instructions && (
        <div className="hud-instructions">
          {instructions}
        </div>
      )}
    </div>
  );
}
