"use client";

import { useState, useMemo } from "react";
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

const PROJECTS_DATA: Project[] = [
  // ── 01. Open Source Projects (Community Based)
  {
    id: "1",
    num: "01",
    name: "AetherSwarm Engine",
    category: "opensource",
    categoryLabel: "Open source community project",
    division: "RED",
    desc: "Autonomous multi-agent orchestration for distributed AI models. Lightweight, fault-tolerant consensus engine designed for local edge nodes.",
    lang: "Rust",
    stars: "2.4k",
    version: "v0.4.2",
    author: "Advait Core Collective",
    authorType: "Community Team",
    link: "https://github.com",
    tags: ["Distributed Systems", "Multi-Agent", "Edge AI", "WASM"],
  },
  {
    id: "2",
    num: "02",
    name: "Advait-HOB-SDK",
    category: "opensource",
    categoryLabel: "Open source community project",
    division: "RED",
    desc: "Collective client SDK, CLI utilities, and high-performance RPC tooling for decentralized peer state synchronization and telemetry.",
    lang: "Go",
    stars: "1.2k",
    version: "v1.1.0",
    author: "Foundation Working Group",
    authorType: "Community Team",
    link: "https://github.com",
    tags: ["SDK", "CLI", "RPC", "Networking"],
  },

  // ── 02. Individual Projects
  {
    id: "3",
    num: "03",
    name: "LatentMesh Visualizer",
    category: "individual",
    categoryLabel: "Individual builder project",
    division: "RED",
    desc: "Real-time neural radiance field and 3D Gaussian splatting visualizer running client-side with zero latency in WebGL and WebGPU compute shaders.",
    lang: "TypeScript",
    stars: "890",
    version: "v1.2.0",
    author: "Lyra Chen (@lyrachen)",
    authorType: "Individual Dev",
    link: "https://github.com",
    tags: ["WebGL", "WebGPU", "3D Graphics", "Neural Fields"],
  },
  {
    id: "4",
    num: "04",
    name: "SpectralFlow-TTS",
    category: "individual",
    categoryLabel: "Individual builder project",
    division: "RED",
    desc: "Zero-shot streaming neural text-to-speech engine with microsecond latency, custom vocoder passes, and expressive prosody control.",
    lang: "Python",
    stars: "1.7k",
    version: "v0.8.4",
    author: "Devin Reyes (@devinreyes)",
    authorType: "Individual Dev",
    link: "https://github.com",
    tags: ["Audio AI", "PyTorch", "Streaming", "DSP"],
  },

  // ── 03. Group Projects
  {
    id: "5",
    num: "05",
    name: "ZeroVerif ZK-ML",
    category: "group",
    categoryLabel: "Group initiative",
    division: "RED",
    desc: "Zero-knowledge proof verification pipeline for privacy-preserving neural network inferences on untrusted cloud hardware and edge nodes.",
    lang: "Python",
    stars: "1.1k",
    version: "v0.9.1",
    author: "Crypto & ML Sprint Team (4 members)",
    authorType: "Group Team",
    link: "https://github.com",
    tags: ["ZK-Snarks", "Privacy", "PyTorch", "ONNX"],
  },
  {
    id: "6",
    num: "06",
    name: "GraphSynth Compiler",
    category: "group",
    categoryLabel: "Group initiative",
    division: "RED",
    desc: "Heterogeneous graph compiler targeting custom edge tensor cores and local NPU architectures with automated kernel fusion heuristics.",
    lang: "C++",
    stars: "950",
    version: "v0.5.0",
    author: "Compiler SIG Group (3 members)",
    authorType: "Group Team",
    link: "https://github.com",
    tags: ["Compilers", "LLVM", "Edge Hardware", "IR"],
  },
  {
    id: "7",
    num: "07",
    name: "Procedural Terrain Voxel Engine",
    category: "group",
    categoryLabel: "Group initiative",
    division: "GameVeda",
    desc: "Unreal Engine 5 custom HLSL shader pass, procedural volumetric collision meshes, and multithreaded voxel octree generator.",
    lang: "C++",
    stars: "840",
    version: "v0.3.1",
    author: "GameVeda Division Team",
    authorType: "Group Team",
    link: "https://github.com",
    tags: ["Unreal Engine", "Voxel", "HLSL", "Physics"],
  },
  {
    id: "8",
    num: "08",
    name: "Advait Kinetic Stencil System",
    category: "group",
    categoryLabel: "Group initiative",
    division: "Creatives",
    desc: "Brutalist typographic identity generator, dynamic SVG stencil glyph geometries, and liquid color fill shader engine.",
    lang: "TypeScript",
    stars: "620",
    version: "v1.0.0",
    author: "Creatives & Social Division",
    authorType: "Group Team",
    link: "https://github.com",
    tags: ["Design Systems", "Typography", "SVG", "Brutalism"],
  },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((p) => {
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
  }, [activeCategory, search]);

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
                <span className={styles.statNum}>{PROJECTS_DATA.length}</span>
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
                className={`${styles.catPill} ${
                  activeCategory === "all" ? styles.catPillActive : ""
                }`}
              >
                [ALL]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "opensource"}
                onClick={() => setActiveCategory("opensource")}
                className={`${styles.catPill} ${
                  activeCategory === "opensource" ? styles.catPillActive : ""
                }`}
              >
                [OPEN SOURCE]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "individual"}
                onClick={() => setActiveCategory("individual")}
                className={`${styles.catPill} ${
                  activeCategory === "individual" ? styles.catPillActive : ""
                }`}
              >
                [INDIVIDUAL]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === "group"}
                onClick={() => setActiveCategory("group")}
                className={`${styles.catPill} ${
                  activeCategory === "group" ? styles.catPillActive : ""
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
                    <span className={styles.starsCount}>★ {p.stars}</span>
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
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className={styles.primarySubmitBtn}
              >
                <span>+ Propose an Artifact</span>
                <span>↗</span>
              </a>
              <Link href="/team" className={styles.secondaryStewardBtn}>
                Contact Division Leads →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
