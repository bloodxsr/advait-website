"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./leaderboard.module.css";

const builders = [
  {
    rank: "01",
    name: "Devin Reyes",
    handle: "@devinreyes",
    role: "Core Architect",
    focus: "Foundation Architecture",
    recentPr: "Added distributed node consensus in AetherSwarm engine",
    repo: "aetherswarm.rs",
    lang: "Rust",
    points: "3,840 pts",
    prsCount: 38,
    badge: "Top Builder",
  },
  {
    rank: "02",
    name: "Lyra Chen",
    handle: "@lyrachen",
    role: "Graphics Researcher",
    focus: "Generative Latents",
    recentPr: "Optimized Gaussian splatting shader pipeline for WebGPU",
    repo: "latentmesh-webgl",
    lang: "TypeScript",
    points: "3,120 pts",
    prsCount: 29,
    badge: "Top Builder",
  },
  {
    rank: "03",
    name: "Siddharth Rao",
    handle: "@siddharth",
    role: "Systems Engineer",
    focus: "Autonomous Systems",
    recentPr: "ZK-SNARK proof verifier circuit integration for ONNX models",
    repo: "zeroverif-zkml",
    lang: "Python",
    points: "2,790 pts",
    prsCount: 24,
    badge: "Top Builder",
  },
  {
    rank: "04",
    name: "Mira Chen",
    handle: "@mirachen",
    role: "Vision Specialist",
    focus: "Computer Vision",
    recentPr: "Edge model quantisation and tensorRT export benchmarks",
    repo: "edge-vision",
    lang: "C++",
    points: "2,480 pts",
    prsCount: 19,
    badge: "Contributor",
  },
  {
    rank: "05",
    name: "Aria Takahashi",
    handle: "@ariat",
    role: "Distributed Dev",
    focus: "Systems Research",
    recentPr: "Multi-agent shared memory protocol RFC specification",
    repo: "swarm-protocol",
    lang: "Rust",
    points: "2,210 pts",
    prsCount: 16,
    badge: "Contributor",
  },
  {
    rank: "12",
    name: "Bivash Kumar",
    handle: "@bivash",
    role: "Systems Architect",
    focus: "Edge AI & Tools",
    recentPr: "Zero-latency edge runtime compilation benchmarks",
    repo: "advait-runtime",
    lang: "Rust",
    points: "1,420 pts",
    prsCount: 12,
    badge: "Rising",
  },
];

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "month" | "prs">("all");

  const filteredBuilders = useMemo(() => {
    return builders.filter((b) => {
      const query = search.toLowerCase().trim();
      if (!query) return true;
      return (
        b.name.toLowerCase().includes(query) ||
        b.handle.toLowerCase().includes(query) ||
        b.focus.toLowerCase().includes(query) ||
        b.lang.toLowerCase().includes(query) ||
        b.recentPr.toLowerCase().includes(query)
      );
    });
  }, [search]);

  return (
    <main className={styles.page}>
      {/* ── Page Hero Header ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>DEV MERITOCRACY · OPEN REPOSITORIES</span>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.subtitle}>
            Most recent open source contributions, by devs.
          </p>
          <div className={styles.heroActions}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={styles.contributeBtn}
            >
              Submit open source contribution ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Featured Leaderboard Card (Matching user sketch) ──────────────── */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredCard}>
          <div className={styles.cardTop}>
            <div className={styles.cardHeaderInfo}>
              <h2 className={styles.cardHeading}>Leaderboard</h2>
              <p className={styles.cardLead}>
                Most recent open source contributions, by devs
              </p>
            </div>
            <div className={styles.tabsRow}>
              <button
                onClick={() => setActiveTab("all")}
                className={`${styles.tabBtn} ${
                  activeTab === "all" ? styles.tabActive : ""
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setActiveTab("month")}
                className={`${styles.tabBtn} ${
                  activeTab === "month" ? styles.tabActive : ""
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setActiveTab("prs")}
                className={`${styles.tabBtn} ${
                  activeTab === "prs" ? styles.tabActive : ""
                }`}
              >
                Open Source PRs
              </button>
            </div>
          </div>

          {/* Search bar inside the Leaderboard card */}
          <div className={styles.searchBar}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by dev name, handle, tech stack, or recent PR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className={styles.clearBtn}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Builders Ranked List */}
          <div className={styles.buildersList}>
            {filteredBuilders.length === 0 ? (
              <div className={styles.empty}>
                <p>No developers matched your search.</p>
                <button
                  onClick={() => setSearch("")}
                  className={styles.resetBtn}
                >
                  Reset search
                </button>
              </div>
            ) : (
              filteredBuilders.map((builder) => (
                <article key={builder.name} className={styles.builderRow}>
                  {/* Rank number badge */}
                  <div className={styles.rankCol}>
                    <span className={styles.rankNum}>#{builder.rank}</span>
                  </div>

                  {/* Dev info */}
                  <div className={styles.devCol}>
                    <div className={styles.devNameRow}>
                      <span className={styles.devName}>{builder.name}</span>
                      <span className={styles.devHandle}>{builder.handle}</span>
                      <span className={styles.devBadge}>{builder.badge}</span>
                    </div>

                    {/* Most recent open source contribution */}
                    <div className={styles.recentPrRow}>
                      <span className={styles.gitIcon}>↳</span>
                      <span className={styles.prDesc}>{builder.recentPr}</span>
                      <span className={styles.repoTag}>
                        {builder.repo} · {builder.lang}
                      </span>
                    </div>
                  </div>

                  {/* Points & Stats */}
                  <div className={styles.statsCol}>
                    <span className={styles.pointsText}>{builder.points}</span>
                    <span className={styles.prsCountText}>
                      {builder.prsCount} PRs merged
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Bottom Card Footer Action */}
          <div className={styles.cardFooter}>
            <span className={styles.footerNote}>
              Rankings refresh daily based on verified GitHub commits and peer reviews.
            </span>
            <span className={styles.rankingPill}>● Live Rankings</span>
          </div>
        </div>
      </section>
    </main>
  );
}
