"use client";

import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { FloatingPixels } from "@/components/ui/FloatingPixels";

const BLOG_CONTENT: Record<string, { title: string; date: string; body: string[] }> = {};

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
