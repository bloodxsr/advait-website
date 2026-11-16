"use client";

import { useState, useMemo, useEffect } from "react";
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

interface CriteriaRule {
  id: string;
  category: string;
  scope: string;
  standard: string;
  points: string;
  divisions: string[];
  multiplier?: string;
  type: "engineering" | "research" | "community";
}

interface TierThreshold {
  tier: string;
  pts: string;
  privileges: string;
  badge: string;
  count: string;
}

const CRITERIA_RULES: CriteriaRule[] = [
  {
    id: "ARCH-01",
    category: "Core Engine & Systems Architecture",
    scope: "Autonomous swarm engines, consensus protocols, WebGPU/HLSL compute shaders, or low-latency WASM compiler runtimes.",
    standard: "Verified AST pass, sub-millisecond latency benchmark diff, >=90% test coverage, and 2 Division Lead approvals.",
    points: "+150 – 300 pts",
    divisions: ["RED", "GameVeda"],
    multiplier: "1.5× for zero-dependency kernels",
    type: "engineering",
  },
  {
    id: "FEAT-02",
    category: "Feature Module & API Integration",
    scope: "New distributed services, client SDK integrations, shader pass implementations, or procedural generation modules.",
    standard: "Full typed interface contract, unit + integration suites passing, comprehensive RFC documentation.",
    points: "+80 – 150 pts",
    divisions: ["RED", "OPS", "GameVeda", "Creatives"],
    type: "engineering",
  },
  {
    id: "PERF-03",
    category: "Kernel Latency & Memory Optimization",
    scope: "Hot-path optimizations, memory leak remediations, WebAssembly bundle tree-shaking, and GPU compute pass tuning.",
    standard: "Flamegraph or benchmark differential attached in PR demonstrating >=15% latency or memory reduction.",
    points: "+60 – 120 pts",
    divisions: ["RED", "GameVeda"],
    multiplier: "1.25× if verifiable flamegraph provided",
    type: "engineering",
  },
  {
    id: "BUG-04",
    category: "Security & Vulnerability Remediation",
    scope: "Critical vulnerability patching, concurrent race condition resolution, or formal fuzz test suite generation.",
    standard: "Reproducible failing unit test case included and resolved; vulnerability disclosure protocol followed.",
    points: "+40 – 80 pts",
    divisions: ["ALL DIVISIONS"],
    type: "engineering",
  },
  {
    id: "RES-05",
    category: "Deep Technical Research Dossier",
    scope: "Authored whitepaper, algorithmic proofs, cryptographic verification schemas, or Research Vault syllabi.",
    standard: "Peer-reviewed by RED Research Council; published in Research Vault or Hall of Flames selected archive.",
    points: "+100 – 200 pts",
    divisions: ["RED", "Creatives"],
    multiplier: "2.0× for novel mathematical proof",
    type: "research",
  },
  {
    id: "SALON-06",
    category: "Salon & Technical Workshop Leadership",
    scope: "Hosting an Architecture Salon, conducting live distributed systems code teardown, or hackathon mentorship.",
    standard: "EVED session telemetry logged, recorded talk archived in Vault, positive attendee score >=4.6.",
    points: "+75 – 120 pts",
    divisions: ["EVED", "RED"],
    type: "community",
  },
  {
    id: "OPS-07",
    category: "Treasury, CI/CD & Ops Infrastructure",
    scope: "Automated developer grant distribution smart contracts, self-hosted GitHub Runner farms, or container pipelines.",
    standard: "Deployed to production cluster with zero uptime regressions; security audited and reproducible.",
    points: "+50 – 100 pts",
    divisions: ["OPS"],
    type: "community",
  },
  {
    id: "REV-08",
    category: "Peer Code Review & Technical Audit",
    scope: "In-depth line-by-line review on open collective PRs, identifying subtle edge cases or architectural bottlenecks.",
    standard: "Meaningful constructive review with suggested diffs, benchmark verifications, or security analysis (capped at 5/week).",
    points: "+20 – 40 pts",
    divisions: ["ALL DIVISIONS"],
    type: "community",
  },
];

const TIER_THRESHOLDS: TierThreshold[] = [
  {
    tier: "TOP ARCHITECT / RESEARCHER",
    pts: "3,000+ PTS",
    privileges: "Grant allocation voting rights, advisory council seat, priority cluster compute access.",
    badge: "TIER 01",
    count: "Top 2% Builders",
  },
  {
    tier: "CORE BUILDER",
    pts: "2,000 – 2,999 PTS",
    privileges: "Direct repository commit rights, RFC authorship privilege, hardware & compute grants.",
    badge: "TIER 02",
    count: "Top 8% Builders",
  },
  {
    tier: "DIVISION LEAD",
    pts: "1,500 – 1,999 PTS",
    privileges: "Review sign-off authority for division repositories, salon curation lead.",
    badge: "TIER 03",
    count: "Division Officers",
  },
  {
    tier: "ACTIVE CONTRIBUTOR",
    pts: "500 – 1,499 PTS",
    privileges: "Verified builder dossier in Hall of Builders, early access to internal alpha releases.",
    badge: "TIER 04",
    count: "Core Community",
  },
  {
    tier: "INITIATE BUILDER",
    pts: "100 – 499 PTS",
    privileges: "First merged pull request badge, collective Discord/Matrix engineering channel access.",
    badge: "TIER 05",
    count: "New Entrants",
  },
];

// Real builders loaded dynamically from /api/leaderboard
const BUILDERS: Builder[] = [];

export default function HallOfBuildersPage() {
  const [buildersList, setBuildersList] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "cycle" | "prs">("all");
  const [criteriaFilter, setCriteriaFilter] = useState<
    "all" | "engineering" | "research" | "community"
  >("all");

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        if (data.leaderboard && data.leaderboard.length > 0) {
          const mapped: Builder[] = data.leaderboard.map((item: any) => ({
            rank: item.rank.replace("#", ""),
            name: item.name,
            handle: `@${item.email.split("@")[0]}`,
            role: item.headline || (item.role === "admin" ? "Lead Architect" : "Systems Engineer"),
            division: item.divisionSlug || "RED",
            recentPr: item.bio || "Active engineering contributions and architectural development",
            repo: "advait-collective",
            lang: item.techStack?.[0] || "TypeScript",
            points: `${item.totalPoints.toLocaleString()} pts`,
            prsCount: item.projectCount || 0,
            badge: item.role === "admin" ? "TOP ARCHITECT" : (item.totalPoints > 100 ? "CORE BUILDER" : "ACTIVE CONTRIBUTOR"),
          }));
          setBuildersList(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch live leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const filteredBuilders = useMemo(() => {
    return buildersList.filter((b) => {
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
  }, [buildersList, search]);

  const filteredCriteria = useMemo(() => {
    if (criteriaFilter === "all") return CRITERIA_RULES;
    return CRITERIA_RULES.filter((c) => c.type === criteriaFilter);
  }, [criteriaFilter]);

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
            <div className={styles.summaryLeftCol}>
              <p className={styles.headerSummary}>
                <span className={styles.monoIndex}>{`{1}`}</span>
                Developer meritocracy and verified open-source contributions. Karma points
                are awarded for merged pull requests, low-latency kernel optimizations,
                shader development, and verifiable peer reviews across the Advait collective.
              </p>
              <div className={styles.headerJumpWrap}>
                <a href="#criteria" className={styles.jumpCriteriaLink}>
                  [03] VIEW EVALUATION CRITERIA &amp; POINT DISTRIBUTION TABLE ↓
                </a>
              </div>
            </div>
            <div className={styles.statsRoster}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{buildersList.reduce((acc: number, b) => acc + (b.prsCount || 0), 0)}</span>
                <span className={styles.statLabel}>Merged PRs</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{buildersList.length}</span>
                <span className={styles.statLabel}>Builders</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>100%</span>
                <span className={styles.statLabel}>Verifiable</span>
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
                className={`${styles.tabBtn} ${activeTab === "all" ? styles.tabBtnActive : ""
                  }`}
              >
                [ALL TIME]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "cycle"}
                onClick={() => setActiveTab("cycle")}
                className={`${styles.tabBtn} ${activeTab === "cycle" ? styles.tabBtnActive : ""
                  }`}
              >
                [2026 CYCLE]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "prs"}
                onClick={() => setActiveTab("prs")}
                className={`${styles.tabBtn} ${activeTab === "prs" ? styles.tabBtnActive : ""
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

        {/* ── 03. Evaluation Criteria & Point Distribution Table ──────────────── */}
        <section
          className={styles.criteriaSection}
          id="criteria"
          aria-label="Criteria and Point Distribution"
        >
          <div className={styles.criteriaHeaderBlock}>
            <div className={styles.criteriaHeaderTop}>
              <div className={styles.criteriaIndex}>
                <span>[03]</span>
                <span>CRITERIA &amp; POINT DISTRIBUTION SPECIFICATION</span>
              </div>
              <span className={styles.criteriaDocId}>DOC-REF / EVAL-2026-V1</span>
            </div>

            <div className={styles.criteriaTitleRow}>
              <h2 className={styles.criteriaTitle}>HOW KARMA IS AWARDED</h2>
              <p className={styles.criteriaSubtitle}>
                Contributions are verified through cryptographic GitHub commits, automated AST analysis,
                and peer reviews. Below is the standardized point distribution table and recognition tier
                matrix across all divisions.
              </p>
            </div>

            {/* Criteria Category Filter Tabs */}
            <div className={styles.criteriaFilterTabs} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={criteriaFilter === "all"}
                onClick={() => setCriteriaFilter("all")}
                className={`${styles.filterPill} ${
                  criteriaFilter === "all" ? styles.filterPillActive : ""
                }`}
              >
                [ALL CRITERIA]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={criteriaFilter === "engineering"}
                onClick={() => setCriteriaFilter("engineering")}
                className={`${styles.filterPill} ${
                  criteriaFilter === "engineering" ? styles.filterPillActive : ""
                }`}
              >
                [SYSTEMS &amp; ENGINEERING]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={criteriaFilter === "research"}
                onClick={() => setCriteriaFilter("research")}
                className={`${styles.filterPill} ${
                  criteriaFilter === "research" ? styles.filterPillActive : ""
                }`}
              >
                [RESEARCH &amp; PAPERS]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={criteriaFilter === "community"}
                onClick={() => setCriteriaFilter("community")}
                className={`${styles.filterPill} ${
                  criteriaFilter === "community" ? styles.filterPillActive : ""
                }`}
              >
                [OPS, SALONS &amp; AUDITS]
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className={styles.tableWrap}>
            <table className={styles.criteriaTable}>
              <thead>
                <tr className={styles.critTheadRow}>
                  <th className={styles.thCode}>CODE</th>
                  <th className={styles.thType}>CONTRIBUTION CATEGORY &amp; SCOPE</th>
                  <th className={styles.thStandard}>VERIFICATION CRITERIA &amp; BENCHMARKS</th>
                  <th className={styles.thDiv}>DIVISIONS</th>
                  <th className={styles.thPts}>KARMA WEIGHT</th>
                </tr>
              </thead>
              <tbody>
                {filteredCriteria.map((c) => (
                  <tr key={c.id} className={styles.critTableRow}>
                    <td className={styles.tdCode}>
                      <span className={styles.codeBadge}>[{c.id}]</span>
                    </td>
                    <td className={styles.tdType}>
                      <span className={styles.critCategoryTitle}>{c.category}</span>
                      <p className={styles.critScopeText}>{c.scope}</p>
                    </td>
                    <td className={styles.tdStandard}>
                      <span className={styles.standardText}>{c.standard}</span>
                      {c.multiplier && (
                        <span className={styles.multiplierPill}>
                          {c.multiplier}
                        </span>
                      )}
                    </td>
                    <td className={styles.tdDiv}>
                      <div className={styles.divBadgeList}>
                        {c.divisions.map((d) => (
                          <span key={d} className={styles.divTag}>
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={styles.tdPts}>
                      <span className={styles.pointsPill}>{c.points}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tier Thresholds & Rank Hierarchy Cards */}
          <div className={styles.tiersContainer}>
            <div className={styles.tiersHeader}>
              <div className={styles.tiersIndexRow}>
                <span className={styles.tiersIndex}>[03.1]</span>
                <span className={styles.tiersIndexLabel}>RANK HIERARCHY MATRIX</span>
              </div>
              <h3 className={styles.tiersHeading}>RECOGNITION TIERS &amp; BUILDER PRIVILEGES</h3>
            </div>
            <div className={styles.tiersGrid}>
              {TIER_THRESHOLDS.map((t) => (
                <div key={t.badge} className={styles.tierCard}>
                  <div className={styles.tierTop}>
                    <span className={styles.tierBadgeTag}>[{t.badge}]</span>
                    <span className={styles.tierPtsVal}>{t.pts}</span>
                  </div>
                  <h4 className={styles.tierTitle}>{t.tier}</h4>
                  <p className={styles.tierPrivileges}>{t.privileges}</p>
                  <div className={styles.tierFooter}>
                    <span className={styles.tierCountTag}>SCOPE: {t.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 04. Verification Workflow & Submit PR Dispatch ──────────────────── */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoLeft}>
              <div className={styles.infoIndex}>
                <span>[04]</span>
                <span>SUBMITTING ARTIFACTS FOR EVALUATION</span>
              </div>
              <h3 className={styles.infoHeading}>
                Automated continuous evaluation via CI/CD.
              </h3>
              <p className={styles.infoDesc}>
                Open a PR on any active Advait collective repository. Our automated
                GitHub Actions bot analyzes AST diffs, test coverage, and benchmark
                flamegraphs. Once merged by 2 division leads, karma points are immediately
                credited to your handle in the Hall of Builders.
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
