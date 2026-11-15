"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./hof.module.css";

const entries = [
  {
    id: 1,
    title: "Designing technology with clarity and care",
    excerpt:
      "A meditation on the relationship between thoughtful design and lasting technical work. How the best systems are built with patience, legibility, and care for the people who will use them.",
    author: "Advait Research Cell",
    date: "Oct 2026",
    issue: "Issue 04",
    tags: ["Design", "Research"],
    type: "Essay",
    readTime: "8 min",
  },
  {
    id: 2,
    title: "Notes on building in public",
    excerpt:
      "What it means to share your work before it is finished. A field report from members who shipped their tools, experiments, and half-formed ideas to the collective for feedback.",
    author: "Community Archive",
    date: "Sep 2026",
    issue: "Issue 03",
    tags: ["Community", "Open Source"],
    type: "Field Report",
    readTime: "5 min",
  },
  {
    id: 3,
    title: "Small systems, lasting impact",
    excerpt:
      "On the quiet power of focused, well-scoped software. This essay traces the lineage of small but enduring tools and what made them persist where larger efforts failed.",
    author: "Foundation Architecture",
    date: "Aug 2026",
    issue: "Issue 02",
    tags: ["Systems", "Architecture"],
    type: "Essay",
    readTime: "11 min",
  },
  {
    id: 4,
    title: "Latent space exploration at the edge",
    excerpt:
      "An experimental project running generative models on constrained hardware. The write-up covers everything from quantisation strategies to real-time output on a Raspberry Pi cluster.",
    author: "Generative Latents Lab",
    date: "Jul 2026",
    issue: "Issue 01",
    tags: ["AI", "Research", "Systems"],
    type: "Project",
    readTime: "14 min",
  },
  {
    id: 5,
    title: "Open protocols for a closed world",
    excerpt:
      "Why federated and open-protocol systems matter more than ever. A look at the architecture of open systems and the tradeoffs that come with building for interoperability.",
    author: "Autonomous Systems Group",
    date: "Jun 2026",
    issue: "Issue 00",
    tags: ["Architecture", "Open Source", "Community"],
    type: "Research Note",
    readTime: "9 min",
  },
  {
    id: 6,
    title: "ZeroVerif: proof-carrying verification at compile time",
    excerpt:
      "A technical deep-dive into zero-knowledge proof systems embedded in the compilation pipeline. Built by members during the Q2 research sprint.",
    author: "ZeroVerif Team",
    date: "May 2026",
    issue: "Special",
    tags: ["AI", "Systems", "Research"],
    type: "Project",
    readTime: "18 min",
  },
];

const ALL_TAGS = ["All", "AI", "Systems", "Research", "Design", "Architecture", "Community", "Open Source"];

export default function HallOfFlames() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchesSearch =
        search.trim() === "" ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        e.author.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesTag = activeTag === "All" || e.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [search, activeTag]);

  return (
    <main className={styles.page}>
      {/* Page Header */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Archival research / Selected work</p>
          <h1 className={styles.title}>Hall of Flames</h1>
          <p className={styles.subtitle}>
            A curated archive of experiments, essays, and projects that have
            moved the collective forward.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={styles.controls}>
        <div className={styles.controlsInner}>
          <div className={styles.searchWrap}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={searchInputRef}
              className={styles.searchInput}
              type="text"
              placeholder="Search entries, authors, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search ? (
              <button
                className={styles.clearBtn}
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            ) : (
              <span className={styles.searchHint} title="Press / to search">/</span>
            )}
          </div>

          <div className={styles.tagRow}>
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                className={`${styles.tagPill} ${activeTag === tag ? styles.tagPillActive : ""}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsBar}>
        <div className={styles.resultsInner}>
          <span className={styles.resultsCount}>
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
            {activeTag !== "All" && ` in ${activeTag}`}
            {search && ` matching "${search}"`}
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <section className={styles.grid}>
        <div className={styles.gridInner}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>◎</span>
              <p>No entries match your search.</p>
              <button
                className={styles.resetBtn}
                onClick={() => { setSearch(""); setActiveTag("All"); }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            filtered.map((entry) => (
              <article key={entry.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardType}>{entry.type}</span>
                    <span className={styles.cardDot} aria-hidden="true" />
                    <span className={styles.cardIssue}>{entry.issue}</span>
                  </div>
                  <span className={styles.cardReadTime}>{entry.readTime}</span>
                </div>

                <h2 className={styles.cardTitle}>{entry.title}</h2>
                <p className={styles.cardExcerpt}>{entry.excerpt}</p>

                <div className={styles.cardTags}>
                  {entry.tags.map((tag) => (
                    <button
                      key={tag}
                      className={`${styles.cardTag} ${activeTag === tag ? styles.cardTagActive : ""}`}
                      onClick={() => setActiveTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.cardAuthorBlock}>
                    <span className={styles.cardAuthor}>{entry.author}</span>
                    <span className={styles.cardDate}>{entry.date}</span>
                  </div>
                  <Link href="/" className={styles.cardReadBtn}>
                    Read →
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
