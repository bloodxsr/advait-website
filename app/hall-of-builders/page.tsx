"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./builders.module.css";

interface Builder {
  rank: string;
  name: string;
  handle: string;
  role: string;
  division: string;
  recentPr: string;
  repo: string;
  lang: string;
  points: string;
  prsCount: number;
  badge: string;
}

const BUILDERS: Builder[] = [
  {
    rank: "01",
    name: "Devin Reyes",
    handle: "@devinreyes",
    role: "Core Systems Architect",
    division: "RED",
    recentPr: "Added distributed node consensus in AetherSwarm Engine",
    repo: "aetherswarm.rs",
    lang: "Rust",
    points: "3,840 pts",
    prsCount: 38,
    badge: "TOP ARCHITECT",
  },
  {
    rank: "02",
    name: "Lyra Chen",
    handle: "@lyrachen",
    role: "Graphics & Latents Researcher",
    division: "RED",
    recentPr: "Optimized Gaussian splatting shader pipeline for WebGPU",
    repo: "latentmesh-webgpu",
    lang: "TypeScript",
    points: "3,120 pts",
    prsCount: 29,
    badge: "TOP RESEARCHER",
  },
  {
    rank: "03",
    name: "Siddharth Rao",
    handle: "@siddharth",
    role: "ZK Systems Engineer",
    division: "RED",
    recentPr: "ZK-SNARK proof verifier circuit integration for ONNX models",
    repo: "zeroverif-zkml",
    lang: "Python",
    points: "2,790 pts",
    prsCount: 24,
    badge: "CORE BUILDER",
  },
  {
    rank: "04",
    name: "Mira Chen",
    handle: "@mirachen",
    role: "Edge Vision Specialist",
    division: "RED",
    recentPr: "Edge model quantization and TensorRT export benchmarks",
    repo: "edge-vision-quant",
    lang: "C++",
    points: "2,480 pts",
    prsCount: 19,
    badge: "CONTRIBUTOR",
  },
  {
    rank: "05",
    name: "Aria Takahashi",
    handle: "@ariat",
    role: "Distributed Protocol Dev",
    division: "RED",
    recentPr: "Multi-agent shared memory protocol RFC specification",
    repo: "swarm-protocol",
    lang: "Rust",
    points: "2,210 pts",
    prsCount: 16,
    badge: "CONTRIBUTOR",
  },
  {
    rank: "06",
    name: "Ananya Sharma",
    handle: "@ananya",
    role: "Ecosystem Stewardship",
    division: "OPS",
    recentPr: "Automated developer grant distribution smart contract ledger",
    repo: "advait-grants",
    lang: "Solidity",
    points: "1,980 pts",
    prsCount: 15,
    badge: "DIVISION LEAD",
  },
  {
    rank: "07",
    name: "Vikramaditya Bose",
    handle: "@vikramb",
    role: "Game Engine Architect",
    division: "GameVeda",
    recentPr: "Custom HLSL volumetric cloud pass & procedural voxel collision",
    repo: "gameveda-core",
    lang: "C++",
    points: "1,870 pts",
    prsCount: 14,
    badge: "DIVISION LEAD",
  },
  {
    rank: "08",
    name: "Isha Verma",
    handle: "@isha",
    role: "Visual Systems Lead",
    division: "Creatives",
    recentPr: "Kinetic SVG brutalist stencil generator & typography scale",
    repo: "advait-stencil-sys",
    lang: "TypeScript",
    points: "1,740 pts",
    prsCount: 13,
    badge: "DIVISION LEAD",
  },
  {
    rank: "09",
    name: "Rohan Mehta",
    handle: "@rohanm",
    role: "Events & Operations",
    division: "EVED",
    recentPr: "Architecture Salon livestream telemetry & consensus voter",
    repo: "eved-telemetry",
    lang: "Go",
    points: "1,620 pts",
    prsCount: 12,
    badge: "DIVISION LEAD",
  },
  {
    rank: "10",
    name: "Bivash Kumar",
    handle: "@bivash",
    role: "Systems Architect",
    division: "RED",
    recentPr: "Zero-latency edge runtime compilation benchmarks & WASM runner",
    repo: "advait-runtime",
    lang: "Rust",
    points: "1,550 pts",
    prsCount: 12,
    badge: "RISING BUILDER",
  },
];

export default function HallOfBuildersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "cycle" | "prs">("all");

  const filteredBuilders = useMemo(() => {
    return BUILDERS.filter((b) => {
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.handle.toLowerCase().includes(q) ||
        b.role.toLowerCase().includes(q) ||
        b.division.toLowerCase().includes(q) ||
        b.lang.toLowerCase().includes(q) ||
        b.repo.toLowerCase().includes(q) ||
        b.recentPr.toLowerCase().includes(q)
      );
    });
  }, [search]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── 00. Monumental Swiss Header ─────────────────────────────────────── */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerIndex}>
              <span>[00]</span>
              <span>MERITOCRACY / LEADERBOARD</span>
            </div>
            <div className={styles.headerMeta}>
              <span>VERIFIED GITHUB ARTIFACTS</span>
              <span>·</span>
              <span>CONTINUOUS EVALUATION</span>
              <span>·</span>
              <span>DIR / 2026</span>
            </div>
          </div>

          <div className={styles.titleRow}>
            <div className={styles.titleWrap}>
              <h1 className={styles.title}>HALL OF BUILDERS</h1>
              <span className={styles.registered}>®</span>
            </div>
            <span className={styles.versionTag}>/V.01</span>
            <span className={styles.yearTag}>(2026)</span>
          </div>

          <div className={styles.headerSummaryRow}>
            <p className={styles.headerSummary}>
              <span className={styles.monoIndex}>{`{1}`}</span>
              Developer meritocracy and verified open-source contributions. Karma points
              are awarded for merged pull requests, low-latency kernel optimizations,
              shader development, and verifiable peer reviews across the Advait collective.
            </p>
            <div className={styles.statsRoster}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>120+</span>
                <span className={styles.statLabel}>Merged PRs</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>48</span>
                <span className={styles.statLabel}>Builders</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>24</span>
                <span className={styles.statLabel}>Verified Repos</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── 01. Search & Filter Controls ────────────────────────────────────── */}
        <section className={styles.controlsSection}>
          <div className={styles.controlsRow}>
            {/* Search Input */}
            <div className={styles.searchWrap}>
              <span className={styles.searchPrompt}>[SEARCH] ›</span>
              <input
                type="text"
                placeholder="Filter by builder name, handle, stack, division, or recent commit..."
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

            {/* Filter Tabs */}
            <div className={styles.tabsRow} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                className={`${styles.tabBtn} ${
                  activeTab === "all" ? styles.tabBtnActive : ""
                }`}
              >
                [ALL TIME]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "cycle"}
                onClick={() => setActiveTab("cycle")}
                className={`${styles.tabBtn} ${
                  activeTab === "cycle" ? styles.tabBtnActive : ""
                }`}
              >
                [2026 CYCLE]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "prs"}
                onClick={() => setActiveTab("prs")}
                className={`${styles.tabBtn} ${
                  activeTab === "prs" ? styles.tabBtnActive : ""
                }`}
              >
                [MERGED PRS]
              </button>
            </div>
          </div>
        </section>

        {/* ── 02. Builders Roster (Swiss Brutalist Leaderboard) ────────────────── */}
        <section className={styles.rosterSection} aria-label="Builders Leaderboard">
          {/* Table Header Bar */}
          <div className={styles.tableHeader}>
            <span className={styles.thRank}>RANK</span>
            <span className={styles.thBuilder}>BUILDER DOSSIER</span>
            <span className={styles.thPr}>LATEST VERIFIED ARTIFACT / RECENT PR</span>
            <span className={styles.thMetrics}>KARMA &amp; CONTRIBUTIONS</span>
          </div>

          {/* Roster Rows */}
          <div className={styles.rosterList}>
            {filteredBuilders.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyPrompt}>[NO RESULTS FOUND]</span>
                <p className={styles.emptyText}>
                  No builders match your query &quot;{search}&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className={styles.resetBtn}
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              filteredBuilders.map((b) => (
                <article key={b.handle} className={styles.builderRow}>
                  {/* Rank Column */}
                  <div className={styles.rankCol}>
                    <span className={styles.rankBadge}>#{b.rank}</span>
                    {parseInt(b.rank, 10) <= 3 && (
                      <span className={styles.podiumBadge}>TOP</span>
                    )}
                  </div>

                  {/* Builder Identity Column */}
                  <div className={styles.builderCol}>
                    <div className={styles.nameRow}>
                      <span className={styles.builderName}>{b.name}</span>
                      <span className={styles.handleTag}>{b.handle}</span>
                      <span className={styles.divPill}>[{b.division}]</span>
                    </div>
                    <span className={styles.roleSubtext}>{b.role}</span>
                  </div>

                  {/* Recent PR / Deliverable Column */}
                  <div className={styles.prCol}>
                    <div className={styles.prDescRow}>
                      <span className={styles.arrowIcon}>↳</span>
                      <span className={styles.prDescText}>{b.recentPr}</span>
                    </div>
                    <div className={styles.repoMeta}>
                      <span className={styles.repoBadge}>{b.repo}</span>
                      <span className={styles.langBadge}>{b.lang}</span>
                    </div>
                  </div>

                  {/* Points & Stats Column */}
                  <div className={styles.metricsCol}>
                    <span className={styles.pointsNumber}>{b.points}</span>
                    <span className={styles.prsNumber}>
                      {b.prsCount} PRs Merged
                    </span>
                    <span className={styles.builderBadge}>[{b.badge}]</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* ── 03. Verification Criteria & Submit Dispatch ─────────────────────── */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoLeft}>
              <div className={styles.infoIndex}>
                <span>[03]</span>
                <span>HOW KARMA POINTS ARE CALCULATED</span>
              </div>
              <h3 className={styles.infoHeading}>
                Cryptographically audited contributions.
              </h3>
              <p className={styles.infoDesc}>
                Every PR merged into official Advait repositories triggers an automated
                evaluation workflow. Karma is weighted by code complexity (AST node count,
                WASM/WebGPU kernel benchmarks, documentation depth), test coverage,
                and peer reviews from division leads.
              </p>
            </div>

            <div className={styles.infoRight}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={styles.submitPrBtn}
              >
                <span>Submit PR Dispatch</span>
                <span>↗</span>
              </a>
              <Link href="/projects" className={styles.exploreProjectsBtn}>
                Explore Active Repositories →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
