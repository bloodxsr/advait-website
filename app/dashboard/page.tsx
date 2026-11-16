"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  UserProfile,
  DEFAULT_PROFILE,
  loadProfile,
  ProjectItem,
  CertificateItem,
  ResearchItem,
  BlogPostItem,
} from "@/lib/profile";
import styles from "./dashboard.module.css";

type DashboardTab = "overview" | "artifacts" | "research" | "credentials" | "karma";

type ModalType =
  | { kind: "project"; item: ProjectItem }
  | { kind: "certificate"; item: CertificateItem }
  | { kind: "research"; item: ResearchItem }
  | { kind: "blog"; item: BlogPostItem }
  | { kind: "points" }
  | null;

interface WorkstreamEvaluation {
  id: string;
  repo: string;
  prNum: number;
  title: string;
  status: "MERGED" | "EVALUATING" | "PASS";
  ciTime: string;
  pointsDelta: number;
}

const SAMPLE_EVALUATIONS: WorkstreamEvaluation[] = [];

interface KarmaLedgerEntry {
  id: string;
  date: string;
  activity: string;
  source: string;
  division: string;
  points: number;
}

const SAMPLE_KARMA_LEDGER: KarmaLedgerEntry[] = [];

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchMe() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          const p = data.profile;
          if (p && isMounted) {
            setProfile((prev) => ({
              ...prev,
              name: p.name || prev.name,
              email: p.email || prev.email,
              headline: p.headline || prev.headline,
              year: p.year || prev.year,
              section: p.section || prev.section,
              department: p.department || prev.department,
              bio: p.bio || prev.bio,
              techTags: p.techStack && p.techStack.length > 0 ? p.techStack : prev.techTags,
              github: p.github || prev.github,
              linkedin: p.linkedin || prev.linkedin,
              portfolio: p.portfolio || prev.portfolio,
              points: p.totalPoints ?? prev.points,
              rank: p.role === "admin" ? "Lead Architect" : p.totalPoints > 100 ? "Core Builder" : "Active Contributor",
            }));
          }
        } else {
          const loaded = loadProfile();
          if (isMounted) setProfile(loaded);
        }
      } catch {
        const loaded = loadProfile();
        if (isMounted) setProfile(loaded);
      }
    }
    fetchMe();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  };

  const handleShareProfile = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Operator dossier link copied to clipboard");
    }
  };

  const getInitials = (n: string) => {
    return (n || "Member")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Filter projects by active tag if selected
  const filteredProjects = useMemo(() => {
    if (!activeTagFilter) return profile.projects;
    const filterLower = activeTagFilter.toLowerCase();
    return profile.projects.filter(
      (p) =>
        p.name.toLowerCase().includes(filterLower) ||
        (p.desc && p.desc.toLowerCase().includes(filterLower)) ||
        p.type.toLowerCase().includes(filterLower)
    );
  }, [profile.projects, activeTagFilter]);

  // Filter research by active tag if selected
  const filteredResearch = useMemo(() => {
    if (!activeTagFilter) return profile.research;
    const filterLower = activeTagFilter.toLowerCase();
    return profile.research.filter(
      (r) =>
        r.title.toLowerCase().includes(filterLower) ||
        r.tag.toLowerCase().includes(filterLower)
    );
  }, [profile.research, activeTagFilter]);

  // Derived rank tier status
  const currentTier = useMemo(() => {
    const pts = profile.points || 0;
    if (pts >= 1000) return { name: "TIER 05 · FOUNDING ARCHITECT", nextPts: 1000, max: true };
    if (pts >= 700) return { name: "TIER 04 · PROTOCOL STEWARD", nextPts: 1000, max: false };
    if (pts >= 400) return { name: "TIER 03 · KERNEL SPECIALIST", nextPts: 700, max: false };
    if (pts >= 200) return { name: "TIER 02 · CORE CONTRIBUTOR", nextPts: 400, max: false };
    return { name: "TIER 01 · PROBATIONARY BUILDER", nextPts: 200, max: false };
  }, [profile.points]);

  const tierProgressPercent = useMemo(() => {
    const pts = profile.points || 0;
    if (pts >= 700) return Math.min(100, Math.round(((pts - 700) / 300) * 100));
    if (pts >= 400) return Math.min(100, Math.round(((pts - 400) / 300) * 100));
    if (pts >= 200) return Math.min(100, Math.round(((pts - 200) / 200) * 100));
    return Math.min(100, Math.round((pts / 200) * 100));
  }, [profile.points]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── Swiss Architectural Masthead ─────────────────────────────────── */}
        <header className={styles.masthead}>
          <div className={styles.mastheadLeft}>
            <div className={styles.systemBadge}>
              <span className={styles.livePulse} />
              <span>COLLECTIVE OPERATOR TELEMETRY // ADV-NET</span>
            </div>
            <h1 className={styles.mastheadTitle}>
              MEMBER_DOSSIER<span className={styles.dimSlash}>/</span>
              <span className={styles.amberTag}>2026</span>
            </h1>
          </div>
          <div className={styles.mastheadRight}>
            <div className={styles.telemetryTag}>
              <span className={styles.telemetryKey}>PROTOCOL:</span>
              <span className={styles.telemetryVal}>V.01-STABLE</span>
            </div>
            <div className={styles.telemetryTag}>
              <span className={styles.telemetryKey}>OPERATOR ID:</span>
              <span className={styles.telemetryVal}>ADV-8842-X</span>
            </div>
            <div className={styles.telemetryTag}>
              <span className={styles.telemetryKey}>SECURITY:</span>
              <span className={styles.telemetryVal}>ED25519-SIG</span>
            </div>
          </div>
        </header>

        {/* ── Hero Member Command Card ────────────────────────────────────── */}
        <section className={styles.operatorHeroCard}>
          <div className={styles.operatorMainRow}>
            {/* Avatar & Operator Identity */}
            <div className={styles.avatarBlock}>
              <div className={styles.avatarCircle}>
                <span className={styles.initials}>{getInitials(profile.name)}</span>
              </div>
              <div className={styles.activeBeacon}>
                <span className={styles.beaconDot} />
                <span className={styles.beaconText}>ACTIVE</span>
              </div>
            </div>

            {/* Operator Information */}
            <div className={styles.operatorInfo}>
              <div className={styles.operatorNameRow}>
                <h2 className={styles.operatorName}>{profile.name}</h2>
                <span className={styles.registeredSign}>®</span>
                <span className={styles.divisionPill}>
                  [RED] RESEARCH &amp; ENGINEERING
                </span>
              </div>

              <p className={styles.operatorHeadline}>
                {profile.headline || "Systems & AI Researcher · Member at Advait Collective"}
              </p>

              <div className={styles.academicMetaRow}>
                <span className={styles.metaItem}>
                  <strong className={styles.metaLabel}>ACADEMIC:</strong> {profile.year} · {profile.section}
                </span>
                <span className={styles.metaDivider}>|</span>
                <span className={styles.metaItem}>
                  <strong className={styles.metaLabel}>DEPT:</strong> {profile.department}
                </span>
                <span className={styles.metaDivider}>|</span>
                <span className={styles.metaItem}>
                  <strong className={styles.metaLabel}>COMMUNITY:</strong> Advait Engineering Unit
                </span>
              </div>

              {/* Interactive Tech Stacks */}
              <div className={styles.techStackRow}>
                <span className={styles.techStackLabel}>DISCIPLINE TAGS:</span>
                <div className={styles.tagsGroup}>
                  {profile.techTags.map((tag) => {
                    const isActive = activeTagFilter === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() =>
                          setActiveTagFilter(isActive ? null : tag)
                        }
                        className={`${styles.tagButton} ${
                          isActive ? styles.tagButtonActive : ""
                        }`}
                        title={`Filter works by ${tag}`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                  {activeTagFilter && (
                    <button
                      onClick={() => setActiveTagFilter(null)}
                      className={styles.resetFilterButton}
                    >
                      CLEAR FILTER ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Action Desk Buttons */}
            <div className={styles.actionDesk}>
              <button onClick={handleShareProfile} className={styles.shareActionBtn}>
                Share Dossier ↗
              </button>
              <Link href="/dashboard/edit" className={styles.editActionBtn}>
                Edit Profile ↗
              </Link>
              <Link href="/hall-of-builders" className={styles.submitDispatchBtn}>
                Submit PR Dispatch ↗
              </Link>
            </div>
          </div>
        </section>

        {/* ── Real-time Telemetry HUD Grid ────────────────────────────────── */}
        <section className={styles.hudGrid} aria-label="Operator Telemetry HUD">
          {/* HUD Item 1: Advait Karma Points */}
          <div
            className={styles.hudCard}
            onClick={() => setActiveModal({ kind: "points" })}
            title="Inspect points audit and verification breakdown"
          >
            <div className={styles.hudTop}>
              <span className={styles.hudIndex}>[METRIC 01]</span>
              <span className={styles.hudStatusTag}>ACTIVE EVALUATION</span>
            </div>
            <div className={styles.hudMain}>
              <span className={styles.hudValue}>{profile.points}</span>
              <span className={styles.hudUnit}>PTS</span>
            </div>
            <div className={styles.hudLabelRow}>
              <span className={styles.hudLabel}>ADVAIT KARMA ACCRUAL</span>
              <span className={styles.hudInspect}>View Ledger ↗</span>
            </div>
            {/* Progress bar towards next tier */}
            <div className={styles.tierProgressBarWrap}>
              <div
                className={styles.tierProgressBarFill}
                style={{ width: `${tierProgressPercent}%` }}
              />
            </div>
            <div className={styles.tierProgressMeta}>
              <span>{currentTier.name}</span>
              {!currentTier.max && (
                <span>{currentTier.nextPts - profile.points} pts to advance</span>
              )}
            </div>
          </div>

          {/* HUD Item 2: Collective Rank */}
          <Link
            href="/leaderboard"
            className={styles.hudCard}
            title="Open collective leaderboard"
          >
            <div className={styles.hudTop}>
              <span className={styles.hudIndex}>[METRIC 02]</span>
              <span className={styles.hudStatusTag}>STANDING</span>
            </div>
            <div className={styles.hudMain}>
              <span className={styles.hudValue}>{profile.rank || "#12"}</span>
              <span className={styles.hudUnit}>/ 148</span>
            </div>
            <div className={styles.hudLabelRow}>
              <span className={styles.hudLabel}>COLLECTIVE BENCHMARK</span>
              <span className={styles.hudInspect}>Leaderboard ↗</span>
            </div>
            <p className={styles.hudMicroDesc}>
              Top 8% Contributor across all five active divisions.
            </p>
          </Link>

          {/* HUD Item 3: Verified Artifacts */}
          <div
            className={styles.hudCard}
            onClick={() => setActiveTab("artifacts")}
            title="Switch to Artifacts & PRs tab"
          >
            <div className={styles.hudTop}>
              <span className={styles.hudIndex}>[METRIC 03]</span>
              <span className={styles.hudStatusTag}>BUILDS</span>
            </div>
            <div className={styles.hudMain}>
              <span className={styles.hudValue}>
                {profile.projects.length + profile.research.length}
              </span>
              <span className={styles.hudUnit}>ARTIFACTS</span>
            </div>
            <div className={styles.hudLabelRow}>
              <span className={styles.hudLabel}>DEPLOYED ARCHITECTURES</span>
              <span className={styles.hudInspect}>View Builds ↓</span>
            </div>
            <p className={styles.hudMicroDesc}>
              {profile.projects.length} Repositories · {profile.research.length} Manuscripts.
            </p>
          </div>

          {/* HUD Item 4: Verified Credentials */}
          <div
            className={styles.hudCard}
            onClick={() => setActiveTab("credentials")}
            title="Switch to Credentials tab"
          >
            <div className={styles.hudTop}>
              <span className={styles.hudIndex}>[METRIC 04]</span>
              <span className={styles.hudStatusTag}>VERIFIED</span>
            </div>
            <div className={styles.hudMain}>
              <span className={styles.hudValue}>{profile.certificates.length}</span>
              <span className={styles.hudUnit}>CREDENTIALS</span>
            </div>
            <div className={styles.hudLabelRow}>
              <span className={styles.hudLabel}>ON-CHAIN AUDITED</span>
              <span className={styles.hudInspect}>Inspect ↗</span>
            </div>
            <p className={styles.hudMicroDesc}>
              Cryptographically signed proof certificates.
            </p>
          </div>
        </section>

        {/* ── Swiss Architectural Navigation Bar ──────────────────────────── */}
        <nav className={styles.tabBar} aria-label="Dashboard views">
          <button
            onClick={() => setActiveTab("overview")}
            className={`${styles.tabBtn} ${
              activeTab === "overview" ? styles.tabBtnActive : ""
            }`}
          >
            <span className={styles.tabNum}>[01]</span>
            <span className={styles.tabTitle}>OVERVIEW &amp; WORKSTREAMS</span>
          </button>

          <button
            onClick={() => setActiveTab("artifacts")}
            className={`${styles.tabBtn} ${
              activeTab === "artifacts" ? styles.tabBtnActive : ""
            }`}
          >
            <span className={styles.tabNum}>[02]</span>
            <span className={styles.tabTitle}>
              ARTIFACTS &amp; REPOSITORIES ({filteredProjects.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab("research")}
            className={`${styles.tabBtn} ${
              activeTab === "research" ? styles.tabBtnActive : ""
            }`}
          >
            <span className={styles.tabNum}>[03]</span>
            <span className={styles.tabTitle}>
              RESEARCH DISPATCHES ({filteredResearch.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab("credentials")}
            className={`${styles.tabBtn} ${
              activeTab === "credentials" ? styles.tabBtnActive : ""
            }`}
          >
            <span className={styles.tabNum}>[04]</span>
            <span className={styles.tabTitle}>
              VERIFIED CREDENTIALS ({profile.certificates.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab("karma")}
            className={`${styles.tabBtn} ${
              activeTab === "karma" ? styles.tabBtnActive : ""
            }`}
          >
            <span className={styles.tabNum}>[05]</span>
            <span className={styles.tabTitle}>KARMA AUDIT STREAM</span>
          </button>
        </nav>

        {/* ── TAB CONTENT: [01] OVERVIEW ──────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className={styles.overviewGrid}>
            {/* Left Column: Dossier Biography & Networks */}
            <div className={styles.overviewColLeft}>
              {/* Card 1: Member Biography */}
              <article className={styles.dossierPanel}>
                <div className={styles.panelHeader}>
                  <div className={styles.panelTitleRow}>
                    <span className={styles.panelIndex}>[BIO]</span>
                    <h3 className={styles.panelTitle}>OPERATOR BIOGRAPHY</h3>
                  </div>
                  <Link href="/dashboard/edit" className={styles.panelEditLink}>
                    Edit ↗
                  </Link>
                </div>
                <p className={styles.bioBody}>
                  {profile.bio ||
                    "Building systems, distributed AI pipelines, and open-source software. Passionate about autonomous agents, local model run-times, and verifiable computation."}
                </p>
                <div className={styles.bioMetaFooter}>
                  <div className={styles.bioMetaEntry}>
                    <span className={styles.bioMetaLabel}>ROLE:</span>
                    <span className={styles.bioMetaValue}>Core Systems Fellow</span>
                  </div>
                  <div className={styles.bioMetaEntry}>
                    <span className={styles.bioMetaLabel}>SECURITY CLEARANCE:</span>
                    <span className={styles.bioMetaValue}>TIER 03 · KERNEL</span>
                  </div>
                </div>
              </article>

              {/* Card 2: Connected Networks & Verification */}
              <article className={styles.dossierPanel}>
                <div className={styles.panelHeader}>
                  <div className={styles.panelTitleRow}>
                    <span className={styles.panelIndex}>[NET]</span>
                    <h3 className={styles.panelTitle}>CONNECTED REPOSITORIES &amp; PROFILES</h3>
                  </div>
                  <Link href="/dashboard/edit" className={styles.panelEditLink}>
                    Manage ↗
                  </Link>
                </div>
                <div className={styles.networkList}>
                  <a
                    href={profile.github || "https://github.com"}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.networkItem}
                  >
                    <div className={styles.networkIdentity}>
                      <span className={styles.networkName}>GitHub Identity</span>
                      <span className={styles.networkHandle}>
                        {profile.github ? profile.github.replace("https://github.com/", "@") : "@operator"}
                      </span>
                    </div>
                    <span className={styles.networkArrow}>↗</span>
                  </a>

                  <a
                    href={profile.linkedin || "https://linkedin.com"}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.networkItem}
                  >
                    <div className={styles.networkIdentity}>
                      <span className={styles.networkName}>Professional Dossier</span>
                      <span className={styles.networkHandle}>LinkedIn Verified</span>
                    </div>
                    <span className={styles.networkArrow}>↗</span>
                  </a>

                  <a
                    href={profile.portfolio || "https://advait.collective"}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.networkItem}
                  >
                    <div className={styles.networkIdentity}>
                      <span className={styles.networkName}>Public Web Node</span>
                      <span className={styles.networkHandle}>
                        {profile.portfolio ? profile.portfolio.replace("https://", "") : "advait.collective"}
                      </span>
                    </div>
                    <span className={styles.networkArrow}>↗</span>
                  </a>
                </div>
              </article>

              {/* Card 3: Quick Launch Actions */}
              <article className={styles.fastActionBanner}>
                <div className={styles.fastActionText}>
                  <h4 className={styles.fastActionTitle}>CONTRIBUTE TO THE COLLECTIVE</h4>
                  <p className={styles.fastActionDesc}>
                    Submit a pull request to any active Advait repository to earn karma and climb the Hall of Builders leaderboard.
                  </p>
                </div>
                <div className={styles.fastActionButtons}>
                  <Link href="/hall-of-builders" className={styles.fastActionPrimary}>
                    Explore Hall of Builders ↗
                  </Link>
                  <Link href="/hall-of-flames" className={styles.fastActionSecondary}>
                    Publish Manuscript ↗
                  </Link>
                </div>
              </article>
            </div>

            {/* Right Column: Active Workstreams & CI/CD Telemetry */}
            <div className={styles.overviewColRight}>
              {/* Panel: Active PR Workstreams & Evaluation */}
              <article className={styles.dossierPanel}>
                <div className={styles.panelHeader}>
                  <div className={styles.panelTitleRow}>
                    <span className={styles.panelIndex}>[CI/CD]</span>
                    <h3 className={styles.panelTitle}>CONTINUOUS PR EVALUATIONS</h3>
                  </div>
                  <Link href="/hall-of-builders" className={styles.panelEditLink}>
                    View All ↗
                  </Link>
                </div>

                <div className={styles.evaluationList}>
                  {SAMPLE_EVALUATIONS.length === 0 ? (
                    <div style={{ padding: "24px 0", color: "#71717a", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                      No pull requests evaluated yet. As you contribute to collective repositories, evaluations will sync here.
                    </div>
                  ) : (
                    SAMPLE_EVALUATIONS.map((evalItem) => (
                      <div key={evalItem.id} className={styles.evaluationRow}>
                        <div className={styles.evalTop}>
                          <div className={styles.evalRepoRow}>
                            <span className={styles.repoName}>{evalItem.repo}</span>
                            <span className={styles.prBadge}>PR #{evalItem.prNum}</span>
                          </div>
                          <span
                            className={`${styles.evalStatusBadge} ${
                              evalItem.status === "MERGED"
                                ? styles.statusMerged
                                : evalItem.status === "PASS"
                                ? styles.statusPass
                                : styles.statusEvaluating
                            }`}
                          >
                            {evalItem.status === "MERGED" && "● MERGED"}
                            {evalItem.status === "PASS" && "● PASS · AST VERIFIED"}
                            {evalItem.status === "EVALUATING" && "○ EVALUATING"}
                          </span>
                        </div>
                        <p className={styles.evalTitle}>{evalItem.title}</p>
                        <div className={styles.evalFooter}>
                          <span className={styles.evalTime}>{evalItem.ciTime}</span>
                          <span className={styles.evalPoints}>+{evalItem.pointsDelta} PTS ACCRUED</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </article>

              {/* Panel: Recent Karma Telemetry stream */}
              <article className={styles.dossierPanel}>
                <div className={styles.panelHeader}>
                  <div className={styles.panelTitleRow}>
                    <span className={styles.panelIndex}>[LOG]</span>
                    <h3 className={styles.panelTitle}>RECENT POINT ACCRUAL STREAM</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("karma")}
                    className={styles.panelEditLink}
                  >
                    Full Ledger ↗
                  </button>
                </div>

                <div className={styles.ledgerMiniList}>
                  {SAMPLE_KARMA_LEDGER.length === 0 ? (
                    <div style={{ padding: "24px 0", color: "#71717a", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                      No recent point accruals. Awarded points will appear here.
                    </div>
                  ) : (
                    SAMPLE_KARMA_LEDGER.slice(0, 3).map((entry) => (
                      <div key={entry.id} className={styles.ledgerMiniRow}>
                        <div className={styles.ledgerMiniLeft}>
                          <span className={styles.ledgerDate}>{entry.date}</span>
                          <span className={styles.ledgerActivity}>{entry.activity}</span>
                          <span className={styles.ledgerSource}>{entry.source}</span>
                        </div>
                        <span className={styles.ledgerPointsBadge}>+{entry.points} PTS</span>
                      </div>
                    ))
                  )}
                </div>
              </article>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: [02] ARTIFACTS & REPOSITORIES ───────────────────── */}
        {activeTab === "artifacts" && (
          <section className={styles.tabSection} aria-label="Artifacts and repositories">
            <div className={styles.tabSectionHeader}>
              <div>
                <h3 className={styles.tabSectionTitle}>
                  COLLECTIVE REPOSITORY ARTIFACTS
                </h3>
                <p className={styles.tabSectionDesc}>
                  Open architectures, distributed engines, and tools authored or maintained by this operator.
                </p>
              </div>
              <Link href="/dashboard/edit" className={styles.sectionCtaBtn}>
                + Add / Manage Project
              </Link>
            </div>

            {filteredProjects.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyPrompt}>NO ARTIFACTS FOUND</p>
                <p className={styles.emptyText}>
                  No active builds match tag &quot;{activeTagFilter}&quot;.
                </p>
                <button
                  onClick={() => setActiveTagFilter(null)}
                  className={styles.emptyActionBtn}
                >
                  Clear Tag Filter
                </button>
              </div>
            ) : (
              <div className={styles.artifactGrid}>
                {filteredProjects.map((proj) => (
                  <article
                    key={proj.id}
                    className={styles.artifactCard}
                    onClick={() => setActiveModal({ kind: "project", item: proj })}
                    title="Click for full artifact telemetry"
                  >
                    <div className={styles.artifactCardHeader}>
                      <span className={styles.artifactTypeBadge}>{proj.type}</span>
                      <span className={styles.artifactInspectPrompt}>Inspect ↗</span>
                    </div>

                    <h4 className={styles.artifactTitle}>{proj.name}</h4>
                    <p className={styles.artifactDesc}>
                      {proj.desc || "High-performance distributed systems architecture built for low latency and verifiable execution."}
                    </p>

                    <div className={styles.artifactCardFooter}>
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.repoLinkBtn}
                        onClick={(e) => e.stopPropagation()}
                      >
                        GitHub Repository ↗
                      </a>
                      <span className={styles.verifiedBuildBadge}>
                        ● VERIFIED BUILD
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── TAB CONTENT: [03] RESEARCH DISPATCHES ────────────────────────── */}
        {activeTab === "research" && (
          <section className={styles.tabSection} aria-label="Research and dispatches">
            <div className={styles.tabSectionHeader}>
              <div>
                <h3 className={styles.tabSectionTitle}>
                  RESEARCH VAULT MANUSCRIPTS
                </h3>
                <p className={styles.tabSectionDesc}>
                  Peer-reviewed technical notes, systems benchmarks, and theoretical dispatches.
                </p>
              </div>
              <Link href="/hall-of-flames" className={styles.sectionCtaBtn}>
                Submit Manuscript ↗
              </Link>
            </div>

            {filteredResearch.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyPrompt}>NO RESEARCH FOUND</p>
                <p className={styles.emptyText}>
                  No manuscripts match tag &quot;{activeTagFilter}&quot;.
                </p>
                <button
                  onClick={() => setActiveTagFilter(null)}
                  className={styles.emptyActionBtn}
                >
                  Clear Tag Filter
                </button>
              </div>
            ) : (
              <div className={styles.researchGrid}>
                {filteredResearch.map((item) => (
                  <article
                    key={item.id}
                    className={styles.researchCard}
                    onClick={() => setActiveModal({ kind: "research", item })}
                    title="Click to read abstract and citations"
                  >
                    <div className={styles.researchCardHeader}>
                      <span className={styles.researchDomainTag}>[{item.tag}]</span>
                      <span className={styles.peerReviewStatus}>● PEER REVIEWED</span>
                    </div>

                    <h4 className={styles.researchTitle}>{item.title}</h4>
                    <p className={styles.researchSnippet}>
                      Explores intermediate AST quantization, zero-knowledge verification proofs, and deterministic latency bounds on distributed collective clusters.
                    </p>

                    <div className={styles.researchCardFooter}>
                      <span className={styles.authorTag}>Author: {profile.name}</span>
                      <span className={styles.readAbstractBtn}>Read Abstract ↗</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── TAB CONTENT: [04] VERIFIED CREDENTIALS ───────────────────────── */}
        {activeTab === "credentials" && (
          <section className={styles.tabSection} aria-label="Verified credentials">
            <div className={styles.tabSectionHeader}>
              <div>
                <h3 className={styles.tabSectionTitle}>
                  ACCREDITED CREDENTIALS &amp; CITATIONS
                </h3>
                <p className={styles.tabSectionDesc}>
                  Cryptographically signed certificates, competitive hackathon recognitions, and domain verifications.
                </p>
              </div>
              <Link href="/dashboard/edit" className={styles.sectionCtaBtn}>
                + Add Credential
              </Link>
            </div>

            <div className={styles.credentialGrid}>
              {profile.certificates.map((cert) => (
                <article
                  key={cert.id}
                  className={styles.credentialCard}
                  onClick={() => setActiveModal({ kind: "certificate", item: cert })}
                  title="Click to inspect cryptographic signature"
                >
                  <div className={styles.credentialCardHeader}>
                    <span className={styles.credentialYear}>YEAR {cert.year}</span>
                    <span className={styles.certValidBadge}>● VALID &amp; AUTHENTIC</span>
                  </div>

                  <h4 className={styles.credentialName}>{cert.name}</h4>
                  <p className={styles.credentialIssuer}>
                    Issued by: <strong>{cert.issuer || "Accredited Body / Advait Collective"}</strong>
                  </p>

                  <div className={styles.credentialCardFooter}>
                    <span className={styles.ledgerHashTag}>HASH: 0x8a91…b4f2</span>
                    <span className={styles.verifyActionPrompt}>Verify Record ↗</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── TAB CONTENT: [05] KARMA AUDIT STREAM ────────────────────────── */}
        {activeTab === "karma" && (
          <section className={styles.tabSection} aria-label="Karma audit ledger">
            <div className={styles.tabSectionHeader}>
              <div>
                <h3 className={styles.tabSectionTitle}>
                  KARMA AUDIT LEDGER // TELEMETRY
                </h3>
                <p className={styles.tabSectionDesc}>
                  Full transaction history of points awarded through pull request diffs, benchmark evaluations, and hackathon milestones.
                </p>
              </div>
              <div className={styles.karmaTotalPill}>
                <span>TOTAL ACCRUAL:</span>
                <strong>{profile.points} PTS</strong>
              </div>
            </div>

            <div className={styles.ledgerTableWrap}>
              <table className={styles.ledgerTable}>
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>CONTRIBUTION ACTIVITY</th>
                    <th>TARGET REPOSITORY / INITIATIVE</th>
                    <th>DIVISION</th>
                    <th style={{ textAlign: "right" }}>KARMA DELTA</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_KARMA_LEDGER.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "36px 16px", color: "#71717a", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                        No karma transactions recorded yet. Points awarded by administrators or approved pull requests will appear here.
                      </td>
                    </tr>
                  ) : (
                    SAMPLE_KARMA_LEDGER.map((entry) => (
                      <tr key={entry.id} className={styles.ledgerRow}>
                        <td className={styles.monoCell}>{entry.date}</td>
                        <td className={styles.activityCell}>{entry.activity}</td>
                        <td className={styles.monoCell}>{entry.source}</td>
                        <td>
                          <span className={styles.divBadge}>{entry.division}</span>
                        </td>
                        <td className={styles.pointsDeltaCell}>+{entry.points} PTS</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.karmaRulesCard}>
              <h4 className={styles.karmaRulesTitle}>
                HOW ADVAIT KARMA IS EVALUATED
              </h4>
              <p className={styles.karmaRulesDesc}>
                Points are governed by automated GitHub Actions CI/CD workflows and division chairs. Merged PRs award +40 to +120 points based on AST complexity and test coverage. Hackathons award up to +180 points. Published research notes in the Hall of Flames award +100 points.
              </p>
              <div className={styles.rulesActionRow}>
                <Link href="/hall-of-builders" className={styles.rulesActionBtn}>
                  Read Full Points Criteria ↗
                </Link>
                <Link href="/leaderboard" className={styles.rulesActionSecondary}>
                  View Collective Leaderboard ↗
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ── INTERACTIVE MODALS ────────────────────────────────────────────── */}
      {activeModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveModal(null)}
        >
          <div
            className={styles.modalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 01. Project Details Modal */}
            {activeModal.kind === "project" && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleGroup}>
                    <span className={styles.modalCategoryBadge}>
                      {activeModal.item.type} Repository Artifact
                    </span>
                    <h2 className={styles.modalTitle}>
                      {activeModal.item.name}
                    </h2>
                  </div>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={() => setActiveModal(null)}
                    aria-label="Close dialog"
                  >
                    ×
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <p className={styles.modalDesc}>
                    {activeModal.item.desc ||
                      "Autonomous multi-agent execution framework with lightweight peer consensus, fault-tolerant RPC synchronization, and low-latency client bindings."}
                  </p>
                  <div className={styles.modalMetaGrid}>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>License</span>
                      <span className={styles.metaFieldValue}>MIT Open Architecture</span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Core Stack</span>
                      <span className={styles.metaFieldValue}>Rust / TypeScript</span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Role</span>
                      <span className={styles.metaFieldValue}>Primary Contributor</span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>CI/CD Status</span>
                      <span className={styles.metaFieldValue} style={{ color: "#30d158" }}>
                        ● Passing All Benchmarks
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <Link
                    href="/dashboard/edit"
                    className={styles.modalSecondaryBtn}
                  >
                    Edit in Profile
                  </Link>
                  <a
                    href={activeModal.item.link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.modalPrimaryBtn}
                  >
                    Open on GitHub ↗
                  </a>
                </div>
              </>
            )}

            {/* 02. Certificate Credential Modal */}
            {activeModal.kind === "certificate" && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleGroup}>
                    <span className={styles.modalCategoryBadge}>
                      Verified Credential Record
                    </span>
                    <h2 className={styles.modalTitle}>
                      {activeModal.item.name}
                    </h2>
                  </div>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={() => setActiveModal(null)}
                    aria-label="Close dialog"
                  >
                    ×
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <p className={styles.modalDesc}>
                    Official verification record issued by{" "}
                    <strong>
                      {activeModal.item.issuer || "Accredited Body"}
                    </strong>{" "}
                    validating mastery in distributed computing, machine learning, and system architecture.
                  </p>
                  <div className={styles.modalMetaGrid}>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Credential ID</span>
                      <span className={styles.metaFieldValue}>
                        ADV-2026-CERT-8841
                      </span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Year Issued</span>
                      <span className={styles.metaFieldValue}>
                        {activeModal.item.year}
                      </span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Verification</span>
                      <span
                        className={styles.metaFieldValue}
                        style={{ color: "#30d158" }}
                      >
                        ● Valid &amp; Authentic
                      </span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Ledger Hash</span>
                      <span className={styles.metaFieldValue}>0x8a91…b4f2</span>
                    </div>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <button
                    onClick={() => {
                      showToast("Credential verification link copied to clipboard");
                      setActiveModal(null);
                    }}
                    className={styles.modalPrimaryBtn}
                  >
                    Copy Verification Link ↗
                  </button>
                </div>
              </>
            )}

            {/* 03. Research Paper Modal */}
            {activeModal.kind === "research" && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleGroup}>
                    <span className={styles.modalCategoryBadge}>
                      Research Dispatch · {activeModal.item.tag}
                    </span>
                    <h2 className={styles.modalTitle}>
                      {activeModal.item.title}
                    </h2>
                  </div>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={() => setActiveModal(null)}
                    aria-label="Close dialog"
                  >
                    ×
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <p className={styles.modalDesc}>
                    <strong>Abstract:</strong> This research paper introduces
                    zero-latency edge inference techniques using quantized
                    intermediate representations and verifiable computation.
                    Peer-reviewed and published in the Advait Research Vault.
                  </p>
                  <div className={styles.modalMetaGrid}>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Lead Author</span>
                      <span className={styles.metaFieldValue}>
                        {profile.name}
                      </span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Domain</span>
                      <span className={styles.metaFieldValue}>
                        {activeModal.item.tag}
                      </span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Review Status</span>
                      <span
                        className={styles.metaFieldValue}
                        style={{ color: "#38bdf8" }}
                      >
                        ● Peer Reviewed
                      </span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Vault Volume</span>
                      <span className={styles.metaFieldValue}>Volume 04</span>
                    </div>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <Link
                    href="/hall-of-flames"
                    className={styles.modalPrimaryBtn}
                    onClick={() => setActiveModal(null)}
                  >
                    View in Hall of Flames ↗
                  </Link>
                </div>
              </>
            )}

            {/* 04. Karma Breakdown Modal */}
            {activeModal.kind === "points" && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleGroup}>
                    <span className={styles.modalCategoryBadge}>
                      Advait Karma Accrual Ledger
                    </span>
                    <h2 className={styles.modalTitle}>
                      {profile.points} Total Karma Points
                    </h2>
                  </div>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={() => setActiveModal(null)}
                    aria-label="Close dialog"
                  >
                    ×
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <p className={styles.modalDesc}>
                    Points are awarded through merged pull requests to open
                    source initiatives, published research dispatches, and
                    hackathon sprint contributions.
                  </p>
                  <div className={styles.breakdownList}>
                    <div className={styles.breakdownRow}>
                      <span className={styles.breakdownSource}>
                        Merged Open Source Pull Requests (AetherSwarm Kernel)
                      </span>
                      <span className={styles.breakdownPoints}>+180 pts</span>
                    </div>
                    <div className={styles.breakdownRow}>
                      <span className={styles.breakdownSource}>
                        Advait Hackathon 1st Place (AI Systems Track)
                      </span>
                      <span className={styles.breakdownPoints}>+140 pts</span>
                    </div>
                    <div className={styles.breakdownRow}>
                      <span className={styles.breakdownSource}>
                        Research Paper Dispatches &amp; Peer Reviews
                      </span>
                      <span className={styles.breakdownPoints}>+100 pts</span>
                    </div>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <Link
                    href="/leaderboard"
                    className={styles.modalPrimaryBtn}
                    onClick={() => setActiveModal(null)}
                  >
                    View on Leaderboard ↗
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Toast Notification ────────────────────────────────────────────── */}
      {toastMsg && <div className={styles.toast}>{toastMsg}</div>}
    </main>
  );
}
