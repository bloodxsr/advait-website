"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import styles from "./slug.module.css";

interface PostDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  bodyMd: string;
  coverImageUrl: string | null;
  readTime: string | null;
  status: string;
  createdAt: string;
  subtopicName: string | null;
  subtopicSlug: string | null;
  authorId: string | null;
  authorName: string | null;
  authorAvatar: string | null;
  authorHeadline: string | null;
}

export default function BlogPostReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setPost(data.post);
        } else if (res.status === 404) {
          if (isMounted) setNotFound(true);
        }
      } catch {
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPost();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setToastMsg("Essay link copied to clipboard");
      setTimeout(() => setToastMsg(null), 2500);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "100px 0", color: "#a1a1aa", fontFamily: "var(--font-mono)" }}>
            <span>Retrieving manuscript dispatch [{slug}]...</span>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "#a1a1aa" }}>[ESSAY ARCHIVE]</span>
            <h1 style={{ fontSize: "24px", fontWeight: 800 }}>Essay Dispatch Not Found</h1>
            <p style={{ color: "#71717a", fontSize: "14px", maxWidth: "480px", lineHeight: 1.6 }}>
              The requested Hall of Flames dispatch may have been moved, archived, or is awaiting peer review.
            </p>
            <Link href="/hall-of-flames" className={styles.backBtn} style={{ marginTop: "12px", border: "1px solid #27272a", padding: "8px 16px", borderRadius: "6px" }}>
              ← Return to Hall of Flames Archive
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "October 2026";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── 01. Top Navigation Bar ───────────────────────────────────────── */}
        <nav className={styles.topNav}>
          <Link href="/hall-of-flames" className={styles.backBtn}>
            <span>←</span>
            <span>Archive / Hall of Flames</span>
          </Link>

          <button type="button" onClick={handleCopyLink} className={styles.shareBtn}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>[LINK]</span>
            <span>Copy Link</span>
          </button>
        </nav>

        {/* ── 02. Masthead ────────────────────────────────────────────────── */}
        <header className={styles.articleHeader}>
          <div className={styles.metaRow}>
            <span className={styles.categoryTag}>
              [{post.subtopicName ? post.subtopicName.toUpperCase() : "RESEARCH"}]
            </span>
            <span>·</span>
            <span className={styles.readTimeTag}>{post.readTime || "5 min read"}</span>
            <span>·</span>
            <span style={{ color: "#71717a" }}>{dateStr}</span>
          </div>

          <h1 className={styles.title}>{post.title}</h1>

          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}

          {/* ── 03. Author Byline ─────────────────────────────────────────── */}
          <div className={styles.authorByline}>
            <div className={styles.avatarCircle}>
              {post.authorAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.authorAvatar} alt={post.authorName || "Author"} className={styles.avatarImg} />
              ) : (
                (post.authorName || "AC")
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
              )}
            </div>

            <div className={styles.authorCol}>
              <span className={styles.authorName}>{post.authorName || "Advait Technical Contributor"}</span>
              <span className={styles.authorHeadline}>{post.authorHeadline || "Advait Research Cell"}</span>
            </div>
          </div>
        </header>

        {/* ── 04. Hero Cover Image (if attached) ───────────────────────────── */}
        {post.coverImageUrl && (
          <div className={styles.coverContainer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImageUrl} alt={post.title} className={styles.coverImage} />
          </div>
        )}

        {/* ── 05. Markdown Body ────────────────────────────────────────────── */}
        <article className={styles.bodyContent}>
          <ReactMarkdown>{post.bodyMd}</ReactMarkdown>
        </article>

        {/* ── 06. Footer ───────────────────────────────────────────────────── */}
        <footer className={styles.articleFooter}>
          <div className={styles.stampBadge}>
            <span className={styles.stampPulse} />
            <span>Advait Collective Peer-Reviewed Technical Dispatch // Verified Registry</span>
          </div>

          <Link href="/hall-of-flames" className={styles.backBtn}>
            Explore More Technical Essays →
          </Link>
        </footer>

        {toastMsg && <div className={styles.toast}>{toastMsg}</div>}
      </div>
    </main>
  );
}
