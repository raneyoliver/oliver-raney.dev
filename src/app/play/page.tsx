"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import "./play.css";
import GameCanvas from "./components/GameCanvas";
import CreationRenderer from "./components/CreationRenderer";
import PromptBar from "./components/PromptBar";
import GameHUD from "./components/GameHUD";
import EscMenu from "./components/EscMenu";
import InfoPanel from "./components/InfoPanel";
import TouchControls from "./components/TouchControls";
import { GameEngine, GameState } from "./engine/GameEngine";
import { CollisionRect } from "./engine/CollisionSystem";

function isTouchDevice() {
  return typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
}

export default function PlayPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Game state
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [hearts, setHearts] = useState(3);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [recentHit, setRecentHit] = useState(false);

  // Player position for overlay
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, angle: 0 });

  // Creation streaming
  const [streamingHtml, setStreamingHtml] = useState<string | null>(null);
  const [finalHtml, setFinalHtml] = useState<string | null>(null);
  const [promptStatus, setPromptStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // UI state
  const [showPaused, setShowPaused] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isTouch] = useState(() => typeof window !== "undefined" && isTouchDevice());
  const [showPrompt, setShowPrompt] = useState(true);
  const [instructions, setInstructions] = useState<string | null>(null);
  const [controls, setControls] = useState<{ button: string; action: string }[]>([]);

  // Initialize game engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const engine = new GameEngine(canvas, {
      onTimerChange: setTimer,
      onScoreChange: setScore,
      onHeartsChange: setHearts,
      onStateChange: (s) => {
        setGameState(s);
        if (s === "slowmo") setShowPrompt(true);
      },
      onPlayerMove: (x, y, angle) => setPlayerPos({ x, y, angle }),
      onHit: () => {
        setRecentHit(true);
        setTimeout(() => setRecentHit(false), 400);
      },
      onSlowMo: () => {
        if (document.pointerLockElement) document.exitPointerLock();
        setShowPrompt(true);
      },
    });

    engineRef.current = engine;
    engine.startLoop();

    const handleResize = () => {
      engine.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.destroy();
    };
  }, []);

  // Keyboard input
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (showPaused) {
          handleResume();
        } else if (gameState === "playing" || gameState === "slowmo") {
          engine.pause();
          setShowPaused(true);
          if (document.pointerLockElement) document.exitPointerLock();
        }
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        setShowInfo((prev) => !prev);
        return;
      }

      // Don't pass input to game if typing in prompt OR info panel is open
      if (showPrompt && ["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName || ""))) {
        return;
      }

      engine.keyDown(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (showPrompt && ["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName || ""))) {
        return;
      }
      engine.keyUp(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, showPaused, showPrompt]);

  // Mouse input
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        engine.mouseMove(e.movementX);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Request pointer lock if playing and not locked
      if (
        (gameState === "playing") &&
        !document.pointerLockElement &&
        !showPaused &&
        !showPrompt
      ) {
        containerRef.current?.requestPointerLock();
        return;
      }
      engine.mouseDown(e.button);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      engine.mouseDown(2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [gameState, showPaused, showPrompt]);

  // Handle prompt submission
  const handlePromptSubmit = useCallback(async (prompt: string) => {
    const engine = engineRef.current;
    if (!engine) return;

    setIsLoading(true);
    setPromptStatus("GENERATING CREATION...");
    setStreamingHtml(null);
    setFinalHtml(null);
    setInstructions(null);
    setControls([]);

    // Clear old creation
    engine.clearCreation();

    try {
      const resp = await fetch("/api/play/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!resp.ok) {
        setPromptStatus("ERROR: Failed to generate");
        setIsLoading(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        const parts = buf.split("\n\n");
        buf = parts.pop()!;

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          let ev;
          try { ev = JSON.parse(part.slice(6)); } catch { continue; }

          if (ev.type === "widget_delta") {
            setStreamingHtml(ev.html);
            setPromptStatus("BUILDING...");
            if (ev.instructions) setInstructions(ev.instructions);
          } else if (ev.type === "widget_final") {
            setFinalHtml(ev.html);
            setStreamingHtml(null);
            setPromptStatus(null);
            if (ev.instructions) setInstructions(ev.instructions);
            if (ev.controls) setControls(ev.controls);
            setShowPrompt(false);
            setIsLoading(false);

            // Start the game / resume from slowmo
            setTimeout(() => {
              engine.startCreation();
              // Request pointer lock for mouse rotation
              if (!isTouch) {
                containerRef.current?.requestPointerLock();
              }
            }, 500);
          } else if (ev.type === "error") {
            setPromptStatus(`ERROR: ${ev.error}`);
            setIsLoading(false);
          } else if (ev.type === "done") {
            if (isLoading) {
              setPromptStatus(null);
              setIsLoading(false);
            }
          }
        }
      }
    } catch (err) {
      setPromptStatus(`ERROR: ${err instanceof Error ? err.message : "Network error"}`);
      setIsLoading(false);
    }
  }, [isTouch, isLoading]);

  const handleHullComputed = useCallback((hull: CollisionRect[]) => {
    engineRef.current?.setCreationHull(hull);
  }, []);

  const handleResume = useCallback(() => {
    setShowPaused(false);
    engineRef.current?.resume();
    if (!isTouch && gameState === "playing") {
      containerRef.current?.requestPointerLock();
    }
  }, [isTouch, gameState]);

  const handleRestart = useCallback(() => {
    engineRef.current?.reset();
    setFinalHtml(null);
    setStreamingHtml(null);
    setInstructions(null);
    setControls([]);
    setShowPrompt(true);
    setPromptStatus(null);
    setScore(0);
    setTimer(30);
    setHearts(3);
    setGameState("waiting");
  }, []);

  // Touch controls handlers
  const handleTouchMove = useCallback((dx: number, dy: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    if (dy < -0.3) engine.keyDown("w");
    else engine.keyUp("w");
    if (dy > 0.3) engine.keyDown("s");
    else engine.keyUp("s");
    if (dx < -0.3) engine.keyDown("a");
    else engine.keyUp("a");
    if (dx > 0.3) engine.keyDown("d");
    else engine.keyUp("d");
  }, []);

  const handleTouchRotate = useCallback((delta: number) => {
    engineRef.current?.mouseMove(delta);
  }, []);

  const handleTouchFire = useCallback(() => {
    engineRef.current?.mouseDown(0);
  }, []);

  const showCursor = showPaused || showPrompt || gameState === "gameover" || gameState === "waiting";

  return (
    <div
      ref={containerRef}
      className={`play-container${showCursor ? " show-cursor" : ""}`}
    >
      <GameCanvas ref={canvasRef} />

      <CreationRenderer
        playerX={playerPos.x}
        playerY={playerPos.y}
        playerAngle={playerPos.angle}
        streamingHtml={streamingHtml}
        finalHtml={finalHtml}
        invincible={recentHit}
        onHullComputed={handleHullComputed}
      />

      {gameState !== "waiting" && (
        <GameHUD
          hearts={hearts}
          maxHearts={3}
          timer={timer}
          score={score}
          recentHit={recentHit}
        />
      )}

      {gameState === "slowmo" && <div className="slowmo-indicator" />}

      <PromptBar
        visible={showPrompt}
        loading={isLoading}
        status={promptStatus}
        onSubmit={handlePromptSubmit}
      />

      <InfoPanel
        visible={showInfo}
        instructions={instructions}
        controls={controls}
        widgetHtml={finalHtml}
      />

      <EscMenu
        visible={showPaused}
        onResume={handleResume}
      />

      {gameState === "gameover" && (
        <div className="gameover-overlay">
          <div className="gameover-title">GAME OVER</div>
          <div className="gameover-score">SCORE: {score}</div>
          <button className="gameover-btn" onClick={handleRestart}>
            PLAY AGAIN
          </button>
        </div>
      )}

      <TouchControls
        visible={isTouch && gameState === "playing"}
        onMove={handleTouchMove}
        onRotate={handleTouchRotate}
        onFire={handleTouchFire}
      />
    </div>
  );
}
