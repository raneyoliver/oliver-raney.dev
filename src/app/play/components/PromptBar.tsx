"use client";

import { useRef, useEffect, FormEvent, useState } from "react";

interface PromptBarProps {
  visible: boolean;
  loading: boolean;
  status: string | null;
  onSubmit: (prompt: string) => void;
}

export default function PromptBar({ visible, loading, status, onSubmit }: PromptBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (visible && inputRef.current) {
      // Small delay to let pointer lock release
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [visible]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setValue("");
  };

  if (!visible) return null;

  return (
    <div className="prompt-overlay">
      <div className="prompt-label">
        {status ? "" : "DESCRIBE YOUR CREATION"}
      </div>
      {status ? (
        <div className="prompt-status">{status}</div>
      ) : (
        <form className="prompt-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="prompt-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="a powerful spaceship with lazers..."
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />
          <button className="prompt-submit" type="submit" disabled={loading || !value.trim()}>
            CREATE
          </button>
        </form>
      )}
    </div>
  );
}
