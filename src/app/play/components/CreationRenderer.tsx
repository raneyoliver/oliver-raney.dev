"use client";

import { useRef, useEffect, useCallback } from "react";
import morphdom from "morphdom";
import { computeHullFromDOM, CollisionRect } from "../engine/CollisionSystem";

interface CreationRendererProps {
  playerX: number;
  playerY: number;
  playerAngle: number;
  streamingHtml: string | null;
  finalHtml: string | null;
  invincible: boolean;
  onHullComputed: (hull: CollisionRect[]) => void;
}

function runScripts(container: HTMLElement) {
  container.querySelectorAll("script").forEach((old) => {
    const s = document.createElement("script");
    if (old.src) {
      s.src = old.src;
    } else {
      s.textContent = old.textContent;
    }
    old.parentNode!.replaceChild(s, old);
  });
}

export default function CreationRenderer({
  playerX, playerY, playerAngle,
  streamingHtml, finalHtml, invincible, onHullComputed,
}: CreationRendererProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const renderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHtmlRef = useRef<string | null>(null);
  const finalizedRef = useRef(false);

  const renderWidget = useCallback((html: string) => {
    if (!rootRef.current) return;
    const next = document.createElement("div");
    next.innerHTML = html;
    morphdom(rootRef.current, next, {
      childrenOnly: true,
      onBeforeElUpdated(from, to) {
        if (from.isEqualNode(to)) return false;
        return true;
      },
      onNodeAdded(node) {
        if (
          node.nodeType === 1 &&
          (node as Element).tagName !== "STYLE" &&
          (node as Element).tagName !== "SCRIPT"
        ) {
          (node as HTMLElement).style.animation = "_fadeIn 0.3s ease both";
        }
        return node;
      },
    });
  }, []);

  const scheduleRender = useCallback(
    (html: string) => {
      pendingHtmlRef.current = html;
      if (renderTimerRef.current) return;
      renderTimerRef.current = setTimeout(() => {
        renderTimerRef.current = null;
        if (pendingHtmlRef.current) renderWidget(pendingHtmlRef.current);
      }, 120);
    },
    [renderWidget]
  );

  // Handle streaming HTML (widget_delta)
  useEffect(() => {
    if (streamingHtml && !finalizedRef.current) {
      scheduleRender(streamingHtml);
    }
  }, [streamingHtml, scheduleRender]);

  // Handle final HTML (widget_final)
  useEffect(() => {
    if (finalHtml && rootRef.current) {
      finalizedRef.current = true;
      if (renderTimerRef.current) {
        clearTimeout(renderTimerRef.current);
        renderTimerRef.current = null;
      }
      renderWidget(finalHtml);
      // Run scripts after DOM is painted
      requestAnimationFrame(() => {
        if (rootRef.current) {
          runScripts(rootRef.current);
          // Compute collision hull after scripts may modify DOM
          requestAnimationFrame(() => {
            if (rootRef.current) {
              const hull = computeHullFromDOM(rootRef.current);
              onHullComputed(hull);
            }
          });
        }
      });
    }
  }, [finalHtml, renderWidget, onHullComputed]);

  // Reset finalized flag when streamingHtml changes from null
  useEffect(() => {
    if (!streamingHtml && !finalHtml) {
      finalizedRef.current = false;
      if (rootRef.current) rootRef.current.innerHTML = "";
    }
  }, [streamingHtml, finalHtml]);

  const visible = !!(streamingHtml || finalHtml);

  return (
    <div
      ref={rootRef}
      className={`creation-container${invincible ? " invincible" : ""}${
        !finalHtml && streamingHtml ? " creation-building" : ""
      }`}
      style={{
        display: visible ? "block" : "none",
        transform: `translate(${playerX}px, ${playerY}px) translate(-50%, -50%) rotate(${playerAngle}rad)`,
        willChange: "transform",
      }}
    />
  );
}
