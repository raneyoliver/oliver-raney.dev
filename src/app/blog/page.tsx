"use client";

import Link from "next/link";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tag: string;
}

const POSTS: BlogPost[] = [
  {
    slug: "getting-started-with-threejs",
    title: "GETTING STARTED WITH THREE.JS",
    date: "2026-03-01",
    excerpt: "A beginner-friendly guide to creating 3D web experiences with Three.js and React Three Fiber.",
    tag: "TUTORIAL",
  },
  {
    slug: "retro-web-design",
    title: "WHY RETRO WEB DESIGN HITS DIFFERENT",
    date: "2026-02-15",
    excerpt: "Exploring the charm of retro aesthetics in modern web development and why nostalgia works.",
    tag: "DESIGN",
  },
  {
    slug: "typescript-tips",
    title: "TYPESCRIPT TIPS FOR BETTER DX",
    date: "2026-01-20",
    excerpt: "Advanced TypeScript patterns that will make your developer experience smoother.",
    tag: "DEV",
  },
];

export default function BlogPage() {
  return (
    <PageWrapper title="BLOG" color="#FF6B6B">
      <FloatingPixels />

      <div style={{ maxWidth: 750, margin: "0 auto" }}>
        <div
          className="font-pixel"
          style={{
            fontSize: 8,
            color: "#FF6B6B88",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          {">"} tail -f blog.log
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: "none" }}
            >
              <article
                style={{
                  background: "#000811",
                  border: "1px solid #FF6B6B22",
                  padding: "1.25rem",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h3
                    className="font-pixel"
                    style={{
                      fontSize: "clamp(7px, 1.3vw, 11px)",
                      color: "#FF6B6B",
                      textShadow: "0 0 4px #FF6B6B",
                      margin: 0,
                    }}
                  >
                    {post.title}
                  </h3>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <span
                      className="font-pixel"
                      style={{
                        fontSize: 6,
                        color: "#FF6B6B",
                        border: "1px solid #FF6B6B44",
                        padding: "0.15rem 0.4rem",
                        background: "#FF6B6B11",
                      }}
                    >
                      {post.tag}
                    </span>
                    <span
                      className="font-pixel"
                      style={{ fontSize: 6, color: "#ffffff44" }}
                    >
                      {post.date}
                    </span>
                  </div>
                </div>
                <p
                  className="font-terminal"
                  style={{
                    fontSize: "clamp(14px, 2vw, 18px)",
                    color: "#edededaa",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {post.excerpt}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
