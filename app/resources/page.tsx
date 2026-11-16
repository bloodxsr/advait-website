"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./resources.module.css";

interface ResourceItem {
  id: string;
  num: string;
  title: string;
  desc: string;
  recommender: string;
  topic: string;
  url: string;
}

interface SubmissionItem {
  id: string;
  title: string;
  topic: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

const TOPICS = [
  "All",
  "Systems",
  "Architecture",
  "AI",
  "Research",
  "Design",
  "Open Source",
];

export default function ResourcesPage() {
  const [activeTopic, setActiveTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [submissionsStatus, setSubmissionsStatus] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [resourcesList, setResourcesList] = useState<ResourceItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newTopic, setNewTopic] = useState("Systems");
  const [newDesc, setNewDesc] = useState("");

  const loadResources = async () => {
    try {
      const res = await fetch("/api/resources");
      if (res.ok) {
        const data = await res.json();
        const items = (data.resources || []).map((r: any, idx: number) => ({
          id: r.id,
          num: String(idx + 1).padStart(2, "0"),
          title: r.title,
          desc: r.description || "Advait curated educational resource.",
          recommender: r.submitterName || "Advait Collective",
          topic: r.category || "Systems",
          url: r.link,
        }));
        setResourcesList(items);
      }
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  // Hotkey "/" for fast search
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

  // Sync user submissions from localStorage cache
  useEffect(() => {
    try {
      const saved = localStorage.getItem("advait_user_submissions");
      if (saved) {
        setSubmissions(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleRecommendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          link: newUrl.trim(),
          category: newTopic,
          description: newDesc.trim() || undefined,
          tags: [newTopic],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newSub: SubmissionItem = {
          id: data.resource?.id || `sub-${Date.now()}`,
          title: newTitle.trim(),
          topic: newTopic,
          date: "JUST NOW",
          status: "Pending",
        };

        const updated = [newSub, ...submissions];
        setSubmissions(updated);
        try {
          localStorage.setItem("advait_user_submissions", JSON.stringify(updated));
        } catch {}

        setNewTitle("");
        setNewUrl("");
        setNewDesc("");
        setIsModalOpen(false);
        if (isAdmin) {
          alert("Resource published directly to Advait library!");
          await loadResources();
        } else {
          alert("Resource proposal submitted successfully! It has been dispatched to the Admin Approval Queue for review.");
        }
      } else {
        const err = await res.json();
        if (res.status === 401) {
          alert("Please sign in first to submit resources and earn Karma points!");
        } else {
          alert(err.error || "Failed to submit resource proposal.");
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error submitting proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredResources = useMemo(() => {
    return resourcesList.filter((r) => {
      const matchesTopic = activeTopic === "All" || r.topic === activeTopic;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        r.recommender.toLowerCase().includes(q);
      return matchesTopic && matchesSearch;
    });
  }, [activeTopic, search]);

  const filteredSubmissions = useMemo(() => {
    if (submissionsStatus === "All") return submissions;
    return submissions.filter((s) => s.status === submissionsStatus);
  }, [submissions, submissionsStatus]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── 00. Monumental Swiss Header ─────────────────────────────────────── */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerIndex}>
              <span>[00]</span>
              <span>CURATED VAULT / OPEN SCHOLARSHIP</span>
            </div>
            <div className={styles.headerMeta}>
              <span>8 CORE TEXTS</span>
              <span>·</span>
              <span>PEER APPROVED</span>
              <span>·</span>
              <span>DIR / 2026</span>
            </div>
          </div>

          <div className={styles.titleRow}>
            <div className={styles.titleWrap}>
              <h1 className={styles.title}>RESEARCH VAULT</h1>
              <span className={styles.registered}>®</span>
            </div>
            <span className={styles.versionTag}>/V.01</span>
            <span className={styles.yearTag}>(2026)</span>
          </div>

          <div className={styles.headerSummaryRow}>
            <p className={styles.headerSummary}>
              <span className={styles.monoIndex}>{`{1}`}</span>
              An open technical syllabus curated by the Advait collective. Spanning
              distributed systems engineering, low-level compilers, cryptographic zero-knowledge
              foundations, neural radiance fields, and software design craft.
            </p>
            <div className={styles.statsRoster}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{resourcesList.length}</span>
                <span className={styles.statLabel}>Core Syllabi</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{submissions.length}</span>
                <span className={styles.statLabel}>Submissions</span>
              </div>
              <Link
                href="/publish"
                className={styles.headerRecommendBtn}
                style={{ textDecoration: "none" }}
              >
                {isAdmin ? "+ Add Resource (Creator Studio)" : "+ Propose Resource ↗"}
              </Link>
            </div>
          </div>
        </header>

        {/* ── 01. Search & Topic Filter ───────────────────────────────────────── */}
        <section className={styles.controlsSection}>
          <div className={styles.controlsRow}>
            {/* Search Input */}
            <div className={styles.searchWrap}>
              <span className={styles.searchPrompt}>[SEARCH] ›</span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search syllabi, topic, recommender (Press '/' to focus)..."
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

            {/* Topic Filter Pills */}
            <div className={styles.topicFilters} role="tablist">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  role="tab"
                  aria-selected={activeTopic === topic}
                  onClick={() => setActiveTopic(topic)}
                  className={`${styles.filterPill} ${
                    activeTopic === topic ? styles.filterPillActive : ""
                  }`}
                >
                  [{topic.toUpperCase()}]
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── 02. Curated Syllabi Grid ────────────────────────────────────────── */}
        <section className={styles.resourcesSection} aria-label="Curated Syllabi">
          {filteredResources.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyPrompt}>[LIBRARY EMPTY]</span>
              <p className={styles.emptyText}>
                {search
                  ? `No educational resources match "${search}".`
                  : "No community resources approved yet. Click '+ Recommend Resource' to submit the first text!"}
              </p>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveTopic("All");
                  }}
                  className={styles.resetBtn}
                >
                  Reset Filter
                </button>
              )}
            </div>
          ) : (
            <div className={styles.resourcesGrid}>
              {filteredResources.map((item) => (
                <article key={item.id} className={styles.resourceCard}>
                  {/* Top Meta */}
                  <div className={styles.cardHeader}>
                    <div className={styles.headerBadges}>
                      <span className={styles.cardNum}>[{item.num}]</span>
                      <span className={styles.topicBadge}>[{item.topic}]</span>
                    </div>
                    <span className={styles.recommenderTag}>
                      Rec. by {item.recommender}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className={styles.cardBody}>
                    <h2 className={styles.resourceTitle}>{item.title}</h2>
                    <p className={styles.resourceDesc}>{item.desc}</p>
                  </div>

                  {/* Footer Action */}
                  <div className={styles.cardFooter}>
                    <span className={styles.licenseHint}>[VERIFIED OPEN ACCESS]</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.accessBtn}
                    >
                      <span>Access Syllabus</span>
                      <span>↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── 03. Community Submissions Docket ────────────────────────────────── */}
        <section className={styles.submissionsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIndex}>
              <span>[02]</span>
              <span>COMMUNITY RECOMMENDATIONS DOCKET</span>
            </div>
            <div className={styles.statusFilters}>
              {(["All", "Pending", "Approved", "Rejected"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubmissionsStatus(s)}
                  className={`${styles.statusFilterBtn} ${
                    submissionsStatus === s ? styles.statusFilterActive : ""
                  }`}
                >
                  [{s.toUpperCase()}]
                </button>
              ))}
            </div>
          </div>

          <div className={styles.submissionsTable}>
            <div className={styles.subTableHeader}>
              <span>RECOMMENDED RESOURCE</span>
              <span>DOMAIN TOPIC</span>
              <span>SUBMISSION DATE</span>
              <span>AUDIT STATUS</span>
            </div>

            <div className={styles.subTableBody}>
              {filteredSubmissions.map((sub) => (
                <div key={sub.id} className={styles.subRow}>
                  <span className={styles.subTitle}>{sub.title}</span>
                  <span className={styles.subTopic}>[{sub.topic}]</span>
                  <span className={styles.subDate}>{sub.date}</span>
                  <span
                    className={`${styles.statusBadge} ${
                      sub.status === "Approved"
                        ? styles.statusApproved
                        : sub.status === "Rejected"
                        ? styles.statusRejected
                        : styles.statusPending
                    }`}
                  >
                    [{sub.status.toUpperCase()}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── Propose Resource Modal ─────────────────────────────────────────── */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalIndex}>
                <span>[PROPOSE]</span>
                <span>EDUCATIONAL DISPATCH</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={styles.closeModalBtn}
              >
                [×]
              </button>
            </div>

            <h3 className={styles.modalTitle}>Recommend a Technical Text</h3>
            <p className={styles.modalSubtitle}>
              Propose high-leverage papers, interactive textbooks, or lecture courses for review.
            </p>

            <form onSubmit={handleRecommendSubmit} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="res-title">
                  RESOURCE TITLE
                </label>
                <input
                  id="res-title"
                  type="text"
                  placeholder="e.g. Distributed Systems 6.824"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="res-url">
                  PUBLIC URL
                </label>
                <input
                  id="res-url"
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="res-topic">
                  DOMAIN TOPIC
                </label>
                <select
                  id="res-topic"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className={styles.select}
                >
                  {TOPICS.filter((t) => t !== "All").map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="res-desc">
                  REASON FOR INCLUSION (OPTIONAL)
                </label>
                <textarea
                  id="res-desc"
                  rows={2}
                  placeholder="Why is this text essential for collective members?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitModalBtn}>
                  Submit to Peer Review Docket →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
