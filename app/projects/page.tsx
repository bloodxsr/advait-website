"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import styles from "./projects.module.css";

type ProjectCategory = "all" | "opensource" | "individual" | "group";

interface Project {
  id: string;
  num: string;
  name: string;
  category: "opensource" | "individual" | "group";
  categoryLabel: string;
  division: string;
  desc: string;
  lang: string;
  stars: string;
  version: string;
  author: string;
  authorType: "Community Team" | "Individual Dev" | "Group Team";
  link: string;
  tags: string[];
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [search, setSearch] = useState("");
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Submission modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [divisions, setDivisions] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    type: "open_source" as "open_source" | "individual" | "group",
    link: "",
    divisionId: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.role === "admin") {
          setIsAdmin(true);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    fetch("/api/divisions")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.divisions?.length > 0) {
          setDivisions(data.divisions);
          setNewProject((prev) => ({ ...prev, divisionId: data.divisions[0].id }));
        }
      })
      .catch(() => { });
  }, []);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim() || !newProject.link.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProject.name.trim(),
          description: newProject.description.trim() || undefined,
          type: newProject.type,
          link: newProject.link.trim(),
          divisionId: newProject.divisionId || undefined,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewProject({
          name: "",
          description: "",
          type: "open_source",
          link: "",
          divisionId: divisions[0]?.id || "",
        });
        if (isAdmin) {
          alert("Project published directly to public registry!");
          // Reload projects
          window.location.reload();
        } else {
          alert(
            "Project submitted successfully! It has been dispatched to the Admin Central Approval Queue for review."
          );
        }
      } else {
        const err = await res.json();
        if (res.status === 401) {
          alert("Please sign in first to submit projects and earn Karma points!");
        } else {
          alert(err.error || "Failed to submit project.");
        }
      }
    } catch {
      alert("Network error submitting project.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          const items = (data.projects || []).map((p: any, idx: number) => {
            const cat =
              p.type === "open_source"
                ? "opensource"
                : p.type === "individual"
                  ? "individual"
                  : "group";

            const catLabel =
              cat === "opensource"
                ? "Open source community project"
                : cat === "individual"
                  ? "Individual builder project"
                  : "Group initiative";

            const authorType =
              cat === "opensource"
                ? "Community Team"
                : cat === "individual"
                  ? "Individual Dev"
                  : "Group Team";

            const tags = [
              p.divisionSlug || p.divisionName || "RED",
              p.subtopicName || "Systems",
            ].filter(Boolean);

            return {
              id: p.id,
              num: String(idx + 1).padStart(2, "0"),
              name: p.name,
              category: cat as "opensource" | "individual" | "group",
              categoryLabel: catLabel,
              division: p.divisionSlug || "RED",
              desc: p.description || "Advait open-source architecture project.",
              lang: p.divisionSlug === "GameVeda" ? "C++" : p.divisionSlug === "Creatives" ? "TypeScript" : "Rust",
              stars: "1.2k",
              version: "v1.0.0",
              author: p.leadName || "Advait Core",
              authorType: authorType as any,
              link: p.link || "https://github.com/advait-collective",
              tags,
            };
          });

          if (isMounted) {
            setProjectsList(items);
          }
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsList.filter((p) => {
      const matchesCategory =
        activeCategory === "all" || p.category === activeCategory;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.lang.toLowerCase().includes(q) ||
        p.division.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [projectsList, activeCategory, search]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── 00. Monumental Swiss Header ─────────────────────────────────────── */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerIndex}>
              <span>[00]</span>
              <span>ARTIFACT REGISTRY / ECOSYSTEM</span>
            </div>
            <div className={styles.headerMeta}>
              <span>8 ARTIFACTS</span>
              <span>·</span>
              <span>OPEN SOURCE &amp; VERIFIED</span>
              <span>·</span>
              <span>DIR / 2026</span>
            </div>
          </div>

          <div className={styles.titleRow}>
            <div className={styles.titleWrap}>
              <h1 className={styles.title}>PROJECTS</h1>
              <span className={styles.registered}>®</span>
            </div>
            <span className={styles.versionTag}>/V.01</span>
            <span className={styles.yearTag}>(2026)</span>
          </div>

          <div className={styles.headerSummaryRow}>
            <p className={styles.headerSummary}>
              <span className={styles.monoIndex}>{`{1}`}</span>
              Explore open-source repositories, individual research prototypes, and group
              initiatives built by the Advait collective. All artifacts prioritize
              longevity, zero cloud dependency, modular architecture, and craft over trend.
            </p>
            <div className={styles.statsRoster}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{projectsList.length}</span>
                <span className={styles.statLabel}>Total Artifacts</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>8.9k</span>
                <span className={styles.statLabel}>GitHub Stars</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>100%</span>
                <span className={styles.statLabel}>Open Access</span>
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
                type="text"
                placeholder="Filter by name, language, division, tag, or author..."
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

            {/* Category Filter Pills */}
            <div className={styles.categoryPills} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "all"}
                onClick={() => setActiveCategory("all")}
                className={`${styles.catPill} ${activeCategory === "all" ? styles.catPillActive : ""
                  }`}
              >
                [ALL]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "opensource"}
                onClick={() => setActiveCategory("opensource")}
                className={`${styles.catPill} ${activeCategory === "opensource" ? styles.catPillActive : ""
                  }`}
              >
                [OPEN SOURCE]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "individual"}
                onClick={() => setActiveCategory("individual")}
                className={`${styles.catPill} ${activeCategory === "individual" ? styles.catPillActive : ""
                  }`}
              >
                [INDIVIDUAL]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "group"}
                onClick={() => setActiveCategory("group")}
                className={`${styles.catPill} ${activeCategory === "group" ? styles.catPillActive : ""
                  }`}
              >
                [GROUP INITIATIVES]
              </button>
            </div>
          </div>
        </section>

        {/* ── 02. Projects Grid ───────────────────────────────────────────────── */}
        <section className={styles.gridSection} aria-label="Projects Registry">
          {filteredProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyPrompt}>[NO ARTIFACTS FOUND]</span>
              <p className={styles.emptyText}>
                No projects match your filter query &quot;{search}&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSearch("");
                }}
                className={styles.resetBtn}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.projectsGrid}>
              {filteredProjects.map((p) => (
                <article key={p.id} className={styles.projectCard}>
                  {/* Card Top Row */}
                  <div className={styles.cardTopRow}>
                    <div className={styles.indexGroup}>
                      <span className={styles.projectNum}>[{p.num}]</span>
                      <span className={styles.divBadge}>[{p.division}]</span>
                      <span className={styles.catBadge}>{p.categoryLabel}</span>
                    </div>
                    <span className={styles.starsCount}>{p.stars} stars</span>
                  </div>

                  {/* Name and Version */}
                  <div className={styles.titleBlock}>
                    <div className={styles.nameRow}>
                      <h2 className={styles.projectName}>{p.name}</h2>
                      <span className={styles.versionBadge}>{p.version}</span>
                    </div>
                    <p className={styles.projectDesc}>{p.desc}</p>
                  </div>

                  {/* Tags */}
                  <div className={styles.tagsRow}>
                    {p.tags.map((t) => (
                      <span key={t} className={styles.tagPill}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className={styles.cardFooter}>
                    <div className={styles.authorMeta}>
                      <span className={styles.langPill}>{p.lang}</span>
                      <span className={styles.metaDot}>·</span>
                      <span className={styles.authorText}>{p.author}</span>
                    </div>

                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.repoLink}
                    >
                      <span>Repository</span>
                      <span>↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── 03. Submit Project Card ─────────────────────────────────────────── */}
        <section className={styles.submitSection}>
          <div className={styles.submitCard}>
            <div className={styles.submitLeft}>
              <div className={styles.submitIndex}>
                <span>[03]</span>
                <span>SUBMISSIONS &amp; PROPOSALS</span>
              </div>
              <h3 className={styles.submitTitle}>
                Have you shipped an open tool, engine, or research artifact?
              </h3>
              <p className={styles.submitDesc}>
                We invite builders from our collective and the broader open-source ecosystem
                to submit their projects for peer review, micro-grants, and inclusion in the
                official Advait registry.
              </p>
            </div>

            <div className={styles.submitActions}>
              <Link
                href="/publish"
                className={styles.primarySubmitBtn}
                style={{ textDecoration: "none" }}
              >
                <span>{isAdmin ? "+ Publish Project (Creator Studio)" : "+ Propose an Artifact"}</span>
                <span>↗</span>
              </Link>
              <Link href="/team" className={styles.secondaryStewardBtn}>
                Contact Division Leads →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 04. Submit Project Proposal Modal ───────────────────────────────── */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  {isAdmin ? "Direct Publish Project (Admin)" : "Submit Project Proposal"}
                </h3>
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
                  ? "As an Admin Architect, projects you publish will appear immediately in the public Advait registry without approval."
                  : "Propose an open-source tool, engine, or research artifact. Submissions enter the central approval queue and award +15 Karma points upon publication."}
              </p>

              <form onSubmit={handleSubmitProposal} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., AetherSwarm Consensus Engine"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Repository or Deployment URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/your-username/repo"
                    value={newProject.link}
                    onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Type</label>
                    <select
                      value={newProject.type}
                      onChange={(e) => setNewProject({ ...newProject, type: e.target.value as any })}
                      className={styles.modalSelect}
                    >
                      <option value="open_source">Open Source</option>
                      <option value="individual">Individual</option>
                      <option value="group">Group Project</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Division</label>
                    <select
                      value={newProject.divisionId}
                      onChange={(e) => setNewProject({ ...newProject, divisionId: e.target.value })}
                      className={styles.modalSelect}
                    >
                      {divisions.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.slug} ({d.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Architecture highlights, benchmark numbers, or problem statement..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className={styles.modalTextarea}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={styles.modalSubmitBtn}
                >
                  {submitting ? "Submitting Proposal..." : "Submit Project for Peer Review →"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
