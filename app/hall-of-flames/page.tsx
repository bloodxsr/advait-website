"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./hof.module.css";

interface FlameEntry {
  id: number;
  num: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  issue: string;
  tags: string[];
  type: string;
  readTime: string;
}

const ENTRIES: FlameEntry[] = [
  {
    id: 1,
    num: "01",
    title: "Designing technology with clarity and care",
    excerpt:
      "A meditation on the relationship between thoughtful design and lasting technical work. How the best systems are built with patience, legibility, and care for the people who will use them.",
    author: "Advait Research Cell",
    date: "OCT 2026",
    issue: "ISSUE 04",
    tags: ["Design", "Research"],
    type: "Essay",
    readTime: "8 MIN",
  },
  {
    id: 2,
    num: "02",
    title: "Notes on building in public",
    excerpt:
      "What it means to share your work before it is finished. A field report from members who shipped their tools, experiments, and half-formed ideas to the collective for feedback.",
    author: "Community Archive",
    date: "SEP 2026",
    issue: "ISSUE 03",
    tags: ["Community", "Open Source"],
    type: "Field Report",
    readTime: "5 MIN",
  },
  {
    id: 3,
    num: "03",
    title: "Small systems, lasting impact",
    excerpt:
      "On the quiet power of focused, well-scoped software. This essay traces the lineage of small but enduring tools and what made them persist where larger efforts failed.",
    author: "Foundation Architecture",
    date: "AUG 2026",
    issue: "ISSUE 02",
    tags: ["Systems", "Architecture"],
    type: "Essay",
    readTime: "11 MIN",
  },
  {
    id: 4,
    num: "04",
    title: "Latent space exploration at the edge",
    excerpt:
      "An experimental project running generative models on constrained hardware. The write-up covers everything from quantization strategies to real-time output on a Raspberry Pi cluster.",
    author: "Generative Latents Lab",
    date: "JUL 2026",
    issue: "ISSUE 01",
    tags: ["AI", "Research", "Systems"],
    type: "Project",
    readTime: "14 MIN",
  },
  {
    id: 5,
    num: "05",
    title: "Open protocols for a closed world",
    excerpt:
      "Why federated and open-protocol systems matter more than ever. A look at the architecture of open systems and the tradeoffs that come with building for interoperability.",
    author: "Autonomous Systems Group",
    date: "JUN 2026",
    issue: "ISSUE 00",
    tags: ["Architecture", "Open Source", "Community"],
    type: "Research Note",
    readTime: "9 MIN",
  },
  {
    id: 6,
    num: "06",
    title: "ZeroVerif: proof-carrying verification at compile time",
    excerpt:
      "A technical deep-dive into zero-knowledge proof systems embedded in the compilation pipeline. Built by members during the Q2 research sprint.",
    author: "ZeroVerif Team",
    date: "MAY 2026",
    issue: "SPECIAL",
    tags: ["AI", "Systems", "Research"],
    type: "Project",
    readTime: "18 MIN",
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

  const filteredEntries = useMemo(() => {
    return ENTRIES.filter((item) => {
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
  }, [search, activeTag]);

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
              <h1 className={styles.title}>HALL OF FLAMES</h1>
              <span className={styles.registered}>®</span>
            </div>
            <span className={styles.versionTag}>/V.01</span>
            <span className={styles.yearTag}>(2026)</span>
          </div>

          <div className={styles.headerSummaryRow}>
            <p className={styles.headerSummary}>
              <span className={styles.monoIndex}>{`{1}`}</span>
              A curated archive of technical writings, architectural retrospectives,
              and breakthrough research notes authored by members of the Advait collective.
              Selected for intellectual craft, clarity, and enduring relevance over trend.
            </p>
            <div className={styles.statsRoster}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>06</span>
                <span className={styles.statLabel}>Archived Works</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>04</span>
                <span className={styles.statLabel}>Print Issues</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>100%</span>
                <span className={styles.statLabel}>Peer Reviewed</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── 01. Filter & Search Controls ────────────────────────────────────── */}
        <section className={styles.controlsSection}>
          <div className={styles.controlsRow}>
            {/* Search Input */}
            <div className={styles.searchWrap}>
              <span className={styles.searchPrompt}>[SEARCH] ›</span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search essays, author, systems (Press '/' to focus)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className={styles.clearSearchBtn}
                  aria-label="Clear filter"
                >
                  [CLEAR ×]
                </button>
              )}
            </div>

            {/* Tag Pills */}
            <div className={styles.tagFilters} role="tablist">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  role="tab"
                  aria-selected={activeTag === tag}
                  onClick={() => setActiveTag(tag)}
                  className={`${styles.filterPill} ${
                    activeTag === tag ? styles.filterPillActive : ""
                  }`}
                >
                  [{tag.toUpperCase()}]
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── 02. Curated Essays Grid ─────────────────────────────────────────── */}
        <section className={styles.entriesSection} aria-label="Curated Essays">
          {filteredEntries.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyPrompt}>[NO DISPATCHES FOUND]</span>
              <p className={styles.emptyText}>
                No articles match &quot;{search}&quot; under &quot;{activeTag}&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveTag("All");
                }}
                className={styles.resetBtn}
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className={styles.entriesGrid}>
              {filteredEntries.map((entry) => (
                <article key={entry.id} className={styles.entryCard}>
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
                      <span>Read essay</span>
                      <span>→</span>
                    </span>
                  </div>
                </article>
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
                anonymously reviewed by division chairs and bound into semester print editions.
              </p>
            </div>

            <div className={styles.editorialActions}>
              <a
                href="mailto:research@advait.collective"
                className={styles.primaryDispatchBtn}
              >
                <span>Submit Manuscript</span>
                <span>↗</span>
              </a>
              <Link href="/projects" className={styles.secondaryExploreBtn}>
                Explore Active Repositories →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
