"use client";

import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";

const BLOG_CONTENT: Record<string, { title: string; date: string; body: string[] }> = {
  "getting-started-with-threejs": {
    title: "GETTING STARTED WITH THREE.JS",
    date: "2026-03-01",
    body: [
      "Three.js is a powerful JavaScript library that makes creating 3D web experiences accessible. Combined with React Three Fiber, you get a declarative, React-friendly way to build 3D scenes.",
      "The key concepts you need to understand are: scenes, cameras, meshes, materials, and lights. A scene is the container for all your 3D objects. A camera defines the viewpoint. Meshes are the visible objects, made up of geometry (shape) and material (appearance).",
      "React Three Fiber wraps all of this in JSX. Instead of imperatively creating objects, you declare them as components. This makes it natural to use React patterns like state, effects, and composition.",
      "Start with a simple scene: a rotating box with a point light. From there, you can add complexity — shadows, textures, post-processing effects, and interactivity. The drei library provides dozens of useful helpers to speed up development.",
    ],
  },
  "retro-web-design": {
    title: "WHY RETRO WEB DESIGN HITS DIFFERENT",
    date: "2026-02-15",
    body: [
      "There's something deeply satisfying about retro aesthetics in web design. The neon colors, pixel fonts, scanline effects, and CRT glow create an atmosphere that modern flat design often lacks — personality.",
      "Retro design works because it triggers nostalgia while feeling fresh in a landscape dominated by minimalism. It's intentionally maximal in the right ways: bold colors, visible texture, and unapologetic style.",
      "The technical challenge is part of the appeal. Recreating CRT effects with CSS, building pixel-perfect animations, and achieving that authentic glow requires creative problem-solving that pushes beyond standard UI patterns.",
      "If you're building a portfolio, retro design makes you memorable. Visitors have seen thousands of clean, minimal portfolios. An arcade-themed experience? That sticks.",
    ],
  },
  "typescript-tips": {
    title: "TYPESCRIPT TIPS FOR BETTER DX",
    date: "2026-01-20",
    body: [
      "TypeScript isn't just about catching type errors — it's about creating a better developer experience. Here are patterns that make a real difference in day-to-day coding.",
      "Use discriminated unions instead of optional properties when an object can be in different states. This lets TypeScript narrow types automatically in switch statements and if-else chains.",
      "The 'satisfies' operator lets you validate that a value matches a type while keeping its narrow inferred type. Use it for configuration objects where you want both type safety and literal types.",
      "Template literal types can model string patterns. Combined with mapped types, you can create strongly-typed APIs that feel magical to use — autocomplete for string patterns like route paths or CSS values.",
    ],
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = BLOG_CONTENT[slug];

  if (!post) {
    return (
      <PageWrapper title="404" color="#FF6B6B">
        <div
          style={{
            textAlign: "center",
            padding: "4rem 0",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: "1rem" }}>💀</div>
          <p
            className="font-pixel"
            style={{
              fontSize: 12,
              color: "#FF6B6B",
              textShadow: "0 0 8px #FF6B6B",
            }}
          >
            POST NOT FOUND
          </p>
          <p
            className="font-terminal"
            style={{ fontSize: 18, color: "#ffffff55", marginTop: "0.5rem" }}
          >
            Error 404: The requested blog post does not exist.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="BLOG" color="#FF6B6B">
      <FloatingPixels />

      <article style={{ maxWidth: 700, margin: "0 auto" }}>
        <header style={{ marginBottom: "2rem" }}>
          <h1
            className="font-pixel"
            style={{
              fontSize: "clamp(9px, 1.8vw, 14px)",
              color: "#FF6B6B",
              textShadow: "0 0 8px #FF6B6B",
              lineHeight: 2,
              marginBottom: "0.5rem",
            }}
          >
            {post.title}
          </h1>
          <p
            className="font-pixel"
            style={{ fontSize: 7, color: "#ffffff44" }}
          >
            {post.date}
          </p>
        </header>

        <div
          style={{
            background: "#000811",
            border: "1px solid #FF6B6B22",
            padding: "1.5rem",
          }}
        >
          {post.body.map((paragraph, i) => (
            <p
              key={i}
              className="font-terminal"
              style={{
                fontSize: "clamp(16px, 2.5vw, 22px)",
                color: "#edededcc",
                lineHeight: 1.8,
                marginBottom: i < post.body.length - 1 ? "1.25rem" : 0,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </PageWrapper>
  );
}
