"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import styles from "./resources.module.css";

interface ResourceItem {
  id: string;
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

const DEFAULT_RESOURCES: ResourceItem[] = [
  {
    id: "1",
    title: "The Missing Semester of Your CS Education",
    desc: "Crucial practical computing tools, shell automation, and systems debugging rarely taught in university courses.",
    recommender: "Aditya",
    topic: "Systems",
    url: "https://missing.csail.mit.edu/",
  },
  {
    id: "2",
    title: "Designing Data-Intensive Applications",
    desc: "The definitive guide to distributed architectures, consensus algorithms, replication, and data storage fundamentals.",
    recommender: "Devin Reyes",
    topic: "Architecture",
    url: "https://dataintensive.net/",
  },
  {
    id: "3",
    title: "Stanford CS231n: Deep Learning for Computer Vision",
    desc: "Comprehensive neural network foundations, backpropagation calculus, and deep generative vision pipelines.",
    recommender: "Lyra Chen",
    topic: "AI",
    url: "https://cs231n.stanford.edu/",
  },
  {
    id: "4",
    title: "Crafting Interpreters & Compiler Engineering",
    desc: "A hands-on journey through scanning, parsing, bytecode VMs, and garbage collection mechanisms.",
    recommender: "Mira Chen",
    topic: "Research",
    url: "https://craftinginterpreters.com/",
  },
  {
    id: "5",
    title: "Zero-Knowledge Proofs: MOOC & Cryptographic Foundations",
    desc: "Modern zk-SNARK constructions, arithmetic circuits, and cryptographic verifier protocols.",
    recommender: "Siddharth Rao",
    topic: "Research",
    url: "https://zk-learning.org/",
  },
  {
    id: "6",
    title: "Operating Systems: Three Easy Pieces (OSTEP)",
    desc: "Virtualization, concurrency, and persistence in operating systems with clean, readable prose and runnable code.",
    recommender: "Bivash Kumar",
    topic: "Systems",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
  },
  {
    id: "7",
    title: "Refactoring UI & Systems Design",
    desc: "Practical UI/UX design heuristics for developers building polished developer tools and software interfaces.",
    recommender: "Isha Verma",
    topic: "Design",
    url: "https://www.refactoringui.com/",
  },
  {
    id: "8",
    title: "The Architecture of Open Source Applications (AOSA)",
    desc: "In-depth case studies on real-world open source systems, from git to LLVM and nginx.",
    recommender: "Ananya Sharma",
    topic: "Open Source",
    url: "https://aosabook.org/",
  },
];

const DEFAULT_SUBMISSIONS: SubmissionItem[] = [
  {
    id: "sub-1",
    title: "MIT 6.824: Distributed Systems Engineering",
    topic: "Systems",
    date: "Nov 12, 2026",
    status: "Pending",
  },
  {
    id: "sub-2",
    title: "Rust for Systems Programmers (Trifecta Labs)",
    topic: "Systems",
    date: "Oct 29, 2026",
    status: "Approved",
  },
  {
    id: "sub-3",
    title: "WebGPU Explainer & WGSL Fundamentals",
    topic: "AI",
    date: "Oct 15, 2026",
    status: "Approved",
  },
];

const TOPICS = [
  "All",
  "AI",
  "Systems",
  "Research",
  "Design",
  "Architecture",
  "Community",
  "Open Source",
];

export default function ResourcesPage() {
  const [activeTopic, setActiveTopic] = useState("All");
  const [search, setSearch] = useState("");
  const [submissionsStatus, setSubmissionsStatus] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(DEFAULT_SUBMISSIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newTopic, setNewTopic] = useState("Systems");
  const [newDesc, setNewDesc] = useState("");

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

  // Sync submissions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("advait_user_submissions");
      if (saved) {
        setSubmissions(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleRecommendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSub: SubmissionItem = {
      id: `sub-${Date.now()}`,
      title: newTitle.trim(),
      topic: newTopic,
      date: "Just now",
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
  };

  const filteredResources = useMemo(() => {
    return DEFAULT_RESOURCES.filter((r) => {
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
        {/* ── Page Header (matching wireframe) ─────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <span className={styles.eyebrow}>Curated Vault · Open Scholarship</span>
            <h1 className={styles.title}>Educational Resources</h1>
            <p className={styles.subtitle}>
              Recommended by members, approved by admins.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.recommendBtn}
          >
            Recommend a resource
          </button>
        </section>

        {/* ── Controls Section (Search Bar + Topic Filter Pills) ──────────── */}
        <section className={styles.controlsSection}>
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
              type="text"
              className={styles.searchInput}
              placeholder="Search entries, authors, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search ? (
              <button
                className={styles.clearSearchBtn}
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            ) : (
              <span className={styles.searchHint} title="Press / to search">
                /
              </span>
            )}
          </div>

          <div className={styles.filterRow}>
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={`${styles.filterPill} ${
                  activeTopic === topic ? styles.filterPillActive : ""
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          <div className={styles.resultsMeta}>
            <span>
              {filteredResources.length}{" "}
              {filteredResources.length === 1 ? "resource" : "resources"} found
              {activeTopic !== "All" && ` in ${activeTopic}`}
              {search && ` for "${search}"`}
            </span>
          </div>
        </section>

        {/* ── Main Resources Grid (Expansive 2-Column Layout) ─────────────── */}
        <div className={styles.resourceCard}>
          <div className={styles.resourceList}>
            {filteredResources.length === 0 ? (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>No matching resources found</h3>
                <p className={styles.emptyDesc}>
                  No resources match &quot;{search}&quot;
                  {activeTopic !== "All" ? ` under ${activeTopic}` : ""}. Try
                  clearing your search or topic filter.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveTopic("All");
                  }}
                  className={styles.resetBtn}
                >
                  Clear search &amp; filters
                </button>
              </div>
            ) : (
              filteredResources.map((res) => (
                <article key={res.id} className={styles.resourceRow}>
                  <div className={styles.resourceInfo}>
                    <h2 className={styles.resourceTitle}>{res.title}</h2>
                    <p className={styles.resourceMeta}>
                      {res.desc} · Recommended by{" "}
                      <span className={styles.resourceRecommender}>
                        {res.recommender}
                      </span>
                    </p>
                  </div>
                  <div className={styles.resourceActions}>
                    <span className={styles.topicBadge}>{res.topic}</span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.openLink}
                    >
                      Open ↗
                    </a>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {/* ── Your Submissions Section Card (matching wireframe) ────────────── */}
        <div className={styles.submissionsCard}>
          <div className={styles.submissionsHeader}>
            <div className={styles.submissionsHeadingGroup}>
              <h3 className={styles.submissionsTitle}>Your submissions</h3>
              <p className={styles.submissionsNotice}>
                New resources appear here as Pending until an admin approves them.
              </p>
            </div>

            <div className={styles.statusFilterGroup}>
              {(["All", "Pending", "Approved", "Rejected"] as const).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setSubmissionsStatus(st)}
                    className={`${styles.statusPill} ${
                      submissionsStatus === st ? styles.statusPillActive : ""
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          <div className={styles.submissionsList}>
            {filteredSubmissions.length === 0 ? (
              <p className={styles.emptyNotice}>
                No submissions found for the selected filter.
              </p>
            ) : (
              filteredSubmissions.map((sub) => (
                <div key={sub.id} className={styles.submissionRow}>
                  <div>
                    <span className={styles.submissionTitle}>{sub.title}</span>
                    <div className={styles.submissionMeta}>
                      {sub.topic} · Submitted {sub.date}
                    </div>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${
                      sub.status === "Pending"
                        ? styles.statusPending
                        : sub.status === "Approved"
                        ? styles.statusApproved
                        : styles.statusRejected
                    }`}
                  >
                    <span className={styles.statusDot} />
                    {sub.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Modal Dialog: Recommend a Resource ────────────────────────────── */}
      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.modalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Recommend a resource</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleRecommendSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Engineering"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Resource URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Topic</label>
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="Systems">Systems</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Compilers">Compilers</option>
                  <option value="Security">Security</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Short Description</label>
                <textarea
                  placeholder="Why do you recommend this resource?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Submit for review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
