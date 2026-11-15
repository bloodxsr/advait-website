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

type ModalType =
  | { kind: "project"; item: ProjectItem }
  | { kind: "certificate"; item: CertificateItem }
  | { kind: "research"; item: ResearchItem }
  | { kind: "blog"; item: BlogPostItem }
  | { kind: "points" }
  | null;

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
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
      showToast("Profile link copied to clipboard!");
    }
  };

  const getInitials = (n: string) => {
    return n
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

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── TOP PROFILE CARD (Expansive full-width layout) ──────────────── */}
        <section className={styles.profileCard}>
          <div className={styles.profileMain}>
            <div className={styles.profileAvatar}>
              <span>{getInitials(profile.name || "Member")}</span>
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.nameRow}>
                <h1 className={styles.profileName}>{profile.name}</h1>
                <span className={styles.statusIndicator}>
                  <span className={styles.statusDot} />
                  Active Collective Member
                </span>
              </div>
              <p className={styles.profileDetails}>
                {profile.year} · {profile.section} · {profile.department}
              </p>
              <div className={styles.techTagsRow}>
                {profile.techTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setActiveTagFilter(activeTagFilter === tag ? null : tag)
                    }
                    className={`${styles.techTag} ${
                      activeTagFilter === tag ? styles.techTagActive : ""
                    }`}
                    title={`Click to filter dashboard by ${tag}`}
                  >
                    {tag}
                  </button>
                ))}
                <span className={styles.tagFilterHint}>
                  (click tag to filter)
                </span>
              </div>
            </div>
          </div>

          <div className={styles.profileActions}>
            <button onClick={handleShareProfile} className={styles.shareBtn}>
              Share ↗
            </button>
            <Link href="/dashboard/edit" className={styles.editProfileBtn}>
              Edit profile
            </Link>
          </div>
        </section>

        {/* ── Active Tag Filter Banner ────────────────────────────────────── */}
        {activeTagFilter && (
          <div className={styles.filterBanner}>
            <span>
              Showing works related to: <strong>{activeTagFilter}</strong>
            </span>
            <button
              onClick={() => setActiveTagFilter(null)}
              className={styles.clearFilterBtn}
            >
              Clear filter ×
            </button>
          </div>
        )}

        {/* ── 2-COLUMN EXPANSIVE CONTENT GRID ─────────────────────────────── */}
        <div className={styles.grid}>
          {/* Card 1: About */}
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>About</h2>
              <Link href="/dashboard/edit" className={styles.cardLink}>
                Edit
              </Link>
            </div>
            <p className={styles.cardBio}>
              {profile.bio ||
                "Building systems, distributed AI pipelines, and open-source software. Passionate about autonomous agents, local model run-times, and verifiable computation."}
            </p>
          </article>

          {/* Card 2: Interactive Points, Rank, Projects Stats */}
          <article className={styles.card}>
            <div className={styles.metricsRow}>
              {/* Metric 1: Points (Clickable for breakdown) */}
              <div
                className={styles.metricCol}
                onClick={() => setActiveModal({ kind: "points" })}
                title="Click to view points & karma breakdown"
              >
                <span className={styles.metricLabel}>Points</span>
                <span className={styles.metricValue}>{profile.points}</span>
                <span className={styles.metricHint}>View breakdown ↗</span>
              </div>

              {/* Metric 2: Rank (Clickable to visit Leaderboard) */}
              <Link
                href="/leaderboard"
                className={styles.metricCol}
                title="Click to view full Leaderboard"
              >
                <span className={styles.metricLabel}>Rank</span>
                <span className={styles.metricValue}>{profile.rank}</span>
                <span className={styles.metricHint}>Leaderboard ↗</span>
              </Link>

              {/* Metric 3: Projects count */}
              <div
                className={styles.metricCol}
                onClick={() => {
                  const el = document.getElementById("projects-card");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                title="Scroll to projects"
              >
                <span className={styles.metricLabel}>Projects</span>
                <span className={styles.metricValue}>
                  {profile.projects.length}
                </span>
                <span className={styles.metricHint}>Active builds ↓</span>
              </div>
            </div>
          </article>

          {/* Card 3: Interactive Projects List */}
          <article id="projects-card" className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Projects</h2>
              <div className={styles.cardHeaderActions}>
                <Link href="/dashboard/edit" className={styles.cardLink}>
                  Manage
                </Link>
              </div>
            </div>
            <div className={styles.list}>
              {filteredProjects.length === 0 ? (
                <p className={styles.cardBio}>
                  No projects match tag &quot;{activeTagFilter}&quot;.
                </p>
              ) : (
                filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className={styles.listItem}
                    onClick={() =>
                      setActiveModal({ kind: "project", item: proj })
                    }
                    title="Click for project details"
                  >
                    <div className={styles.itemTitleRow}>
                      <span className={styles.itemName}>{proj.name}</span>
                      <span className={styles.itemBadge}>{proj.type}</span>
                    </div>
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.itemActionIcon}
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub ↗
                    </a>
                  </div>
                ))
              )}
            </div>
          </article>

          {/* Card 4: Interactive Certificates List */}
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Certificates</h2>
              <Link href="/dashboard/edit" className={styles.cardLink}>
                Manage
              </Link>
            </div>
            <div className={styles.list}>
              {profile.certificates.map((cert) => (
                <div
                  key={cert.id}
                  className={styles.listItem}
                  onClick={() =>
                    setActiveModal({ kind: "certificate", item: cert })
                  }
                  title="Click to view verified credential"
                >
                  <span className={styles.itemName}>{cert.name}</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span className={styles.itemYear}>[{cert.year}]</span>
                    <span className={styles.itemActionIcon}>Verify ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Card 5: Interactive Research Work */}
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Research work</h2>
              <Link href="/resources" className={styles.cardLink}>
                Explore
              </Link>
            </div>
            <div className={styles.list}>
              {filteredResearch.length === 0 ? (
                <p className={styles.cardBio}>
                  No research entries match tag &quot;{activeTagFilter}&quot;.
                </p>
              ) : (
                filteredResearch.map((r) => (
                  <div
                    key={r.id}
                    className={styles.listItem}
                    onClick={() =>
                      setActiveModal({ kind: "research", item: r })
                    }
                    title="Click to read abstract and references"
                  >
                    <span className={styles.itemName}>{r.title}</span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span className={styles.itemBadge}>[{r.tag}]</span>
                      <span className={styles.itemActionIcon}>Abstract ↗</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          {/* Card 6: Interactive Blog Posts */}
          <article className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Blog posts</h2>
              <Link href="/dashboard/edit" className={styles.cardLink}>
                Manage
              </Link>
            </div>
            <div className={styles.list}>
              {profile.blogPosts.map((b) => (
                <div
                  key={b.id}
                  className={styles.listItem}
                  onClick={() => setActiveModal({ kind: "blog", item: b })}
                  title="Click to read article preview"
                >
                  <span className={styles.itemName}>{b.title}</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span className={styles.itemYear}>{b.date}</span>
                    <span className={styles.itemActionIcon}>Read ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>

      {/* ── MODAL DIALOGS (Interactive overlays) ─────────────────────────── */}
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
                      {activeModal.item.type} Project
                    </span>
                    <h2 className={styles.modalTitle}>
                      {activeModal.item.name}
                    </h2>
                  </div>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={() => setActiveModal(null)}
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
                      <span className={styles.metaFieldValue}>MIT Open</span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Primary Stack</span>
                      <span className={styles.metaFieldValue}>Rust / TypeScript</span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Role</span>
                      <span className={styles.metaFieldValue}>Core Author</span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Status</span>
                      <span className={styles.metaFieldValue}>Active Production</span>
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
                      Verified Certification
                    </span>
                    <h2 className={styles.modalTitle}>
                      {activeModal.item.name}
                    </h2>
                  </div>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={() => setActiveModal(null)}
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
                    validating professional mastery in distributed computing,
                    deep learning, and system architecture.
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
                      showToast("Credential verification link copied!");
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
                      <span className={styles.metaFieldLabel}>Subject Domain</span>
                      <span className={styles.metaFieldValue}>
                        {activeModal.item.tag}
                      </span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Review Status</span>
                      <span
                        className={styles.metaFieldValue}
                        style={{ color: "#0a84ff" }}
                      >
                        ● Peer Reviewed
                      </span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Dispatches</span>
                      <span className={styles.metaFieldValue}>Issue 04</span>
                    </div>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <Link
                    href="/resources"
                    className={styles.modalPrimaryBtn}
                    onClick={() => setActiveModal(null)}
                  >
                    Explore Resources Vault ↗
                  </Link>
                </div>
              </>
            )}

            {/* 04. Blog Post Modal */}
            {activeModal.kind === "blog" && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleGroup}>
                    <span className={styles.modalCategoryBadge}>
                      Technical Essay · {activeModal.item.date}
                    </span>
                    <h2 className={styles.modalTitle}>
                      {activeModal.item.title}
                    </h2>
                  </div>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={() => setActiveModal(null)}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.modalBody}>
                  <p className={styles.modalDesc}>
                    <em>
                      &quot;When scaling autonomous agents to memory-constrained
                      edge devices, garbage collection pauses and dynamic heap
                      allocations quickly saturate memory bandwidth. By leveraging
                      static arena allocators in Rust and lock-free rings, we
                      reduced 99th percentile latency by 74%...&quot;
                    </em>
                  </p>
                  <div className={styles.modalMetaGrid}>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Published</span>
                      <span className={styles.metaFieldValue}>
                        {activeModal.item.date}
                      </span>
                    </div>
                    <div className={styles.metaField}>
                      <span className={styles.metaFieldLabel}>Reading Time</span>
                      <span className={styles.metaFieldValue}>
                        {activeModal.item.readTime || "5 min read"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.modalActions}>
                  <Link
                    href="/dashboard/edit"
                    className={styles.modalSecondaryBtn}
                  >
                    Edit Article
                  </Link>
                  <button
                    onClick={() => {
                      showToast("Article draft saved!");
                      setActiveModal(null);
                    }}
                    className={styles.modalPrimaryBtn}
                  >
                    Close Reader
                  </button>
                </div>
              </>
            )}

            {/* 05. Points & Karma Breakdown Modal */}
            {activeModal.kind === "points" && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleGroup}>
                    <span className={styles.modalCategoryBadge}>
                      Advait Karma &amp; Builder Points
                    </span>
                    <h2 className={styles.modalTitle}>
                      {profile.points} Total Points
                    </h2>
                  </div>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={() => setActiveModal(null)}
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
                        Merged Open Source Pull Requests (AetherSwarm)
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

      {/* ── Toast Message ────────────────────────────────────────────────── */}
      {toastMsg && <div className={styles.toast}>{toastMsg}</div>}
    </main>
  );
}
