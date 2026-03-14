"use client";

import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tag: string;
}

const POSTS: BlogPost[] = [];

interface BlogContentProps {
  color: string;
}

export function BlogContent({ color }: BlogContentProps) {
  return (
    <div style={{ maxWidth: 750, margin: "0 auto" }}>
      <div
        className="font-pixel"
        style={{
          fontSize: 8,
          color: `${color}88`,
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        {">"} tail -f blog.log
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {POSTS.length === 0 ? (
          <div
            style={{
              background: "#000811",
              border: `1px solid ${color}22`,
              padding: "3rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>📝</div>
            <p
              className="font-pixel"
              style={{
                fontSize: 10,
                color: `${color}cc`,
                textShadow: `0 0 6px ${color}`,
                marginBottom: "0.5rem",
              }}
            >
              NO POSTS YET
            </p>
            <p
              className="font-terminal"
              style={{ fontSize: 18, color: "#ffffff66" }}
            >
              Check back soon!
            </p>
          </div>
        ) : (
          POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: "none" }}
          >
            <article
              style={{
                background: "#000811",
                border: `1px solid ${color}22`,
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
                    color,
                    textShadow: `0 0 4px ${color}`,
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
                      color,
                      border: `1px solid ${color}44`,
                      padding: "0.15rem 0.4rem",
                      background: `${color}11`,
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
        )))
        }
      </div>
    </div>
  );
}
