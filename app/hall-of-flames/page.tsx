"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./hof.module.css";
import { uploadWithSignedUrl } from "@/lib/client-upload";

interface FlameEntry {
  id: number;
  slug: string;
  num: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  issue: string;
  tags: string[];
  type: string;
  readTime: string;
  coverImageUrl?: string | null;
}

const ALL_TAGS = ["All", "AI", "Systems", "Research", "Design", "Architecture", "Community", "Open Source"];

export default function HallOfFlames() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [entries, setEntries] = useState<FlameEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Admin and Submission states
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBodyImg, setUploadingBodyImg] = useState(false);

  const [subtopics, setSubtopics] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    excerpt: "",
    bodyMd: "",
    coverImageUrl: "",
    readTime: "5 min read",
    subtopicId: "",
  });

  // Verify Admin Session
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.role === "admin") {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/subtopics")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.subtopics?.length > 0) {
          setSubtopics(data.subtopics);
          setNewBlog((prev) => ({ ...prev, subtopicId: data.subtopics[0].id }));
        }
      })
      .catch(() => {});
  }, []);

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        const items: FlameEntry[] = (data.posts || []).map((p: any, idx: number) => {
          const dateStr = p.createdAt
            ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()
            : "OCT 2026";

          const tagList = [
            p.subtopicName || "Research",
            "Systems",
          ].filter(Boolean);

          return {
            id: idx + 1,
            slug: p.slug,
            num: String(idx + 1).padStart(2, "0"),
            title: p.title,
            excerpt: p.excerpt || "Curated essay from Advait technical contributors.",
            author: p.authorName || "Advait Research Cell",
            date: dateStr,
            issue: `ISSUE 0${idx + 1}`,
            tags: tagList,
            type: "Essay",
            readTime: p.readTime || "7 MIN",
            coverImageUrl: p.coverImageUrl,
          };
        });

        setEntries(items);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Upload Cover Image Handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadWithSignedUrl(file, "post-cover");
      setNewBlog((prev) => ({ ...prev, coverImageUrl: url }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Network error uploading image");
    } finally {
      setUploadingCover(false);
    }
  };

  // Upload & Insert Image inside Markdown body
  const handleBodyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBodyImg(true);
    try {
      const url = await uploadWithSignedUrl(file, "post-cover");
      const altText = file.name.replace(/\.[^/.]+$/, "");
      setNewBlog((prev) => ({
        ...prev,
        bodyMd: prev.bodyMd + `\n\n![${altText}](${url})\n\n`,
      }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Network error uploading image");
    } finally {
      setUploadingBodyImg(false);
    }
  };

  const handleSubmitManuscript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title.trim() || !newBlog.bodyMd.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newBlog.title.trim(),
          excerpt: newBlog.excerpt.trim() || undefined,
          bodyMd: newBlog.bodyMd.trim(),
          coverImageUrl: newBlog.coverImageUrl.trim() || undefined,
          readTime: newBlog.readTime.trim() || "5 min read",
          subtopicId: newBlog.subtopicId || undefined,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewBlog({
          title: "",
          excerpt: "",
          bodyMd: "",
          coverImageUrl: "",
          readTime: "5 min read",
          subtopicId: subtopics[0]?.id || "",
        });

        if (isAdmin) {
          alert("Essay published directly to Hall of Flames!");
          await loadPosts();
        } else {
          alert(
            "Manuscript submitted successfully! It has been dispatched to the Admin Central Approval Queue. Upon approval, it will appear in the Hall of Flames and award +25 Karma points."
          );
        }
      } else {
        const err = await res.json();
        if (res.status === 401) {
          alert("Please sign in first to submit technical essays and earn Karma points!");
        } else {
          alert(err.error || "Failed to submit manuscript.");
        }
      }
    } catch {
      alert("Network error submitting manuscript.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const matchesTag = activeTag === "All" || item.tags.includes(activeTag);
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    });
  }, [entries, search, activeTag]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── 00. Monumental Swiss Header ─────────────────────────────────────── */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerIndex}>
              <span>[00]</span>
              <span>SELECTED WORK &amp; ESSAYS / ARCHIVE</span>
            </div>
            <div className={styles.headerMeta}>
              <span>CURATED ESSAYS</span>
              <span>·</span>
              <span>TECHNICAL REVIEWS</span>
              <span>·</span>
              <span>DIR / 2026</span>
            </div>
          </div>

          <div className={styles.titleRow}>
            <div className={styles.titleWrap}>
              <h1 className={styles.title}>Hall of Flames</h1>
              <span className={styles.titleSuffix}>/ ESSAYS</span>
            </div>

            <div className={styles.headerCta}>
              <Link
                href="/publish"
                className={styles.primaryDispatchBtn}
                style={{ textDecoration: "none" }}
              >
                <span>{isAdmin ? "+ Write & Publish Essay (Studio)" : "+ Submit Technical Essay"}</span>
                <span>↗</span>
              </Link>
            </div>
          </div>

          <div className={styles.headerSummaryRow}>
            <p className={styles.summaryParagraph}>
              The official editorial archive of the Advait Collective. In-depth technical
              reviews, distributed system RFCs, WebGPU shader breakdowns, and essays on
              computational aesthetics authored by collective builders.
            </p>
            <div className={styles.statsRoster}>
              <div className={styles.statCell}>
                <span className={styles.statLabel}>PUBLISHED DISPATCHES</span>
                <span className={styles.statValue}>{entries.length}</span>
              </div>
              <div className={styles.statCell}>
                <span className={styles.statLabel}>PEER-REVIEW STATUS</span>
                <span className={styles.statValue}>ACTIVE</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── 01. Filter & Search Controls ────────────────────────────────────── */}
        <section className={styles.controlsSection}>
          <div className={styles.controlsRow}>
            <div className={styles.searchWrap}>
              <span className={styles.searchPrompt}>[SEARCH] ›</span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search essays by title, author, keyword... (Press / to focus)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className={styles.clearSearchBtn}
                >
                  [CLEAR ×]
                </button>
              )}
            </div>

            <div className={styles.tagFilters}>
              {ALL_TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTag(t)}
                  className={`${styles.filterPill} ${
                    activeTag === t ? styles.filterPillActive : ""
                  }`}
                >
                  [{t.toUpperCase()}]
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── 02. Curated Entries Grid ────────────────────────────────────────── */}
        <section className={styles.entriesSection}>
          {loading ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Loading peer-reviewed dispatches from registry...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyPrompt}>[NO ESSAYS FOUND]</span>
              <p className={styles.emptyText}>
                {search
                  ? `No technical essays match your search "${search}".`
                  : "No essays currently published in this section. Submit a manuscript below to inaugurate the docket."}
              </p>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTag("All");
                    setSearch("");
                  }}
                  className={styles.resetBtn}
                >
                  Reset Filter
                </button>
              )}
            </div>
          ) : (
            <div className={styles.entriesGrid}>
              {filteredEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/hall-of-flames/${entry.slug}`}
                  style={{ textDecoration: "none", color: "inherit", display: "flex" }}
                >
                  <article className={styles.entryCard} style={{ width: "100%", cursor: "pointer" }}>
                    {/* Top Meta */}
                    <div className={styles.cardHeader}>
                      <div className={styles.headerBadges}>
                        <span className={styles.entryNum}>[{entry.num}]</span>
                        <span className={styles.issueBadge}>{entry.issue}</span>
                        <span className={styles.typeBadge}>[{entry.type}]</span>
                      </div>
                      <div className={styles.dateMeta}>
                        <span>{entry.date}</span>
                        <span>·</span>
                        <span>{entry.readTime}</span>
                      </div>
                    </div>

                    {/* Cover Thumbnail if attached */}
                    {entry.coverImageUrl && (
                      <div style={{ width: "100%", height: "140px", overflow: "hidden", borderRadius: "4px", border: "1px solid #27272a" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={entry.coverImageUrl}
                          alt={entry.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}

                    {/* Title & Excerpt */}
                    <div className={styles.cardBody}>
                      <h2 className={styles.entryTitle}>{entry.title}</h2>
                      <p className={styles.entryExcerpt}>{entry.excerpt}</p>
                    </div>

                    {/* Tags */}
                    <div className={styles.tagRow}>
                      {entry.tags.map((t) => (
                        <span key={t} className={styles.entryTag}>
                          [{t}]
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className={styles.cardFooter}>
                      <span className={styles.authorName}>By {entry.author}</span>
                      <span className={styles.readLink}>
                        <span>Read full essay</span>
                        <span>→</span>
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── 03. Editorial Dispatch Notice ───────────────────────────────────── */}
        <section className={styles.editorialSection}>
          <div className={styles.editorialCard}>
            <div className={styles.editorialLeft}>
              <div className={styles.editorialIndex}>
                <span>[03]</span>
                <span>EDITORIAL SUBMISSION DESK</span>
              </div>
              <h3 className={styles.editorialTitle}>
                Publish a peer-reviewed research note or technical essay.
              </h3>
              <p className={styles.editorialDesc}>
                The Advait Hall of Flames accepts technical manuscripts, distributed systems
                benchmarks, and essays exploring computation aesthetics. Submissions are
                reviewed by division chairs and bound into semester print editions.
              </p>
            </div>

            <div className={styles.editorialActions}>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={styles.primaryDispatchBtn}
              >
                <span>{isAdmin ? "+ Write & Publish Essay (Admin)" : "Submit Manuscript (Markdown)"}</span>
                <span>↗</span>
              </button>
              <Link href="/projects" className={styles.secondaryExploreBtn}>
                Explore Active Repositories →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 04. Editorial Manuscript Modal ──────────────────────────────────── */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h3 className={styles.modalTitle}>
                    {isAdmin ? "Direct Publish Essay (Admin)" : "Submit Technical Essay (Markdown)"}
                  </h3>
                  {isAdmin && <span className={styles.adminDirectBadge}>Admin Direct</span>}
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.modalCloseBtn}
                >
                  [CLOSE]
                </button>
              </div>

              <p style={{ color: "#a1a1aa", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                {isAdmin
                  ? "As an Admin Architect, your essay will be published directly to the Hall of Flames without entering the approval queue."
                  : "Submit technical essays, benchmarks, or research memos in Markdown. Submissions enter the Admin Approval Queue and award +25 Karma points once approved."}
              </p>

              <form onSubmit={handleSubmitManuscript} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Essay Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Latent Diffusion at the Edge: Microkernel Benchmarks"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Category / Subtopic</label>
                    <select
                      value={newBlog.subtopicId}
                      onChange={(e) => setNewBlog({ ...newBlog, subtopicId: e.target.value })}
                      className={styles.modalSelect}
                    >
                      {subtopics.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Estimated Read Time</label>
                    <input
                      type="text"
                      placeholder="e.g., 6 min read"
                      value={newBlog.readTime}
                      onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })}
                      className={styles.modalInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Excerpt / Abstract</label>
                  <input
                    type="text"
                    placeholder="Brief 1-2 sentence overview of core findings..."
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                {/* Cover Image Upload / Attachment */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Cover Image (Optional)</label>
                  <div className={styles.uploadRow}>
                    <input
                      type="url"
                      placeholder="Paste image URL or click browse to upload..."
                      value={newBlog.coverImageUrl}
                      onChange={(e) => setNewBlog({ ...newBlog, coverImageUrl: e.target.value })}
                      className={styles.modalInput}
                      style={{ flex: 1 }}
                    />
                    <label className={styles.uploadBtn}>
                      <span>{uploadingCover ? "Uploading..." : "Upload Cover Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        style={{ display: "none" }}
                        disabled={uploadingCover}
                      />
                    </label>
                  </div>
                  {newBlog.coverImageUrl && (
                    <div style={{ marginTop: "6px", width: "100%", height: "130px", borderRadius: "6px", overflow: "hidden", border: "1px solid #27272a" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={newBlog.coverImageUrl}
                        alt="Cover preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>

                {/* Markdown Body with Image Inserter */}
                <div className={styles.formGroup}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <label className={styles.formLabel}>Markdown Body *</label>
                    <label className={styles.insertImgBtn}>
                      <span>{uploadingBodyImg ? "Uploading Image..." : "+ Insert Image into Post"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBodyImageUpload}
                        style={{ display: "none" }}
                        disabled={uploadingBodyImg}
                      />
                    </label>
                  </div>
                  <textarea
                    rows={8}
                    required
                    placeholder="Write your technical dispatch in Markdown (# Headers, **bold**, `code`, etc.). Use the button above to attach images inside your text..."
                    value={newBlog.bodyMd}
                    onChange={(e) => setNewBlog({ ...newBlog, bodyMd: e.target.value })}
                    className={styles.modalTextarea}
                    style={{ fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.6 }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploadingCover || uploadingBodyImg}
                  className={styles.modalSubmitBtn}
                >
                  {submitting
                    ? "Publishing..."
                    : isAdmin
                    ? "Publish Essay Immediately"
                    : "Submit Manuscript for Editorial Review →"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
