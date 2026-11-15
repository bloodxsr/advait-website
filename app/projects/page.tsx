"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./projects.module.css";

type ProjectCategory = "all" | "opensource" | "individual" | "group";

interface Project {
  id: string;
  name: string;
  category: "opensource" | "individual" | "group";
  categoryLabel: string;
  desc: string;
  lang: string;
  langColor: string;
  stars: string;
  version: string;
  author: string;
  authorType: "Community Team" | "Individual Dev" | "Group Team";
  link: string;
  tags: string[];
}

const projectsData: Project[] = [
  // ── 01. Open Source Projects (Community Based)
  {
    id: "1",
    name: "AetherSwarm Engine",
    category: "opensource",
    categoryLabel: "Open source projects (community based)",
    desc: "Autonomous multi-agent orchestration for distributed AI models. Lightweight, fault-tolerant, and designed for edge nodes.",
    lang: "Rust",
    langColor: "#dea584",
    stars: "2.4k",
    version: "v0.4.2",
    author: "Advait Core Collective",
    authorType: "Community Team",
    link: "https://github.com",
    tags: ["Distributed Systems", "Multi-Agent", "Edge AI"],
  },
  {
    id: "2",
    name: "Advait-HOB-SDK",
    category: "opensource",
    categoryLabel: "Open source projects (community based)",
    desc: "Collective client SDK, CLI utilities, and RPC tooling for decentralized peer state synchronization.",
    lang: "Go",
    langColor: "#00add8",
    stars: "1.2k",
    version: "v1.1.0",
    author: "Foundation Working Group",
    authorType: "Community Team",
    link: "https://github.com",
    tags: ["SDK", "CLI", "RPC"],
  },

  // ── 02. Individual Projects
  {
    id: "3",
    name: "LatentMesh Visualizer",
    category: "individual",
    categoryLabel: "Individual projects",
    desc: "Real-time neural radiance field and 3D Gaussian splatting visualizer running client-side with zero latency in WebGL/WebGPU.",
    lang: "TypeScript",
    langColor: "#3178c6",
    stars: "890",
    version: "v1.2.0",
    author: "Lyra Chen (@lyrachen)",
    authorType: "Individual Dev",
    link: "https://github.com",
    tags: ["WebGL", "3D Graphics", "Neural Fields"],
  },
  {
    id: "4",
    name: "SpectralFlow-TTS",
    category: "individual",
    categoryLabel: "Individual projects",
    desc: "Zero-shot streaming neural text-to-speech engine with microsecond latency and expressive prosody control.",
    lang: "Python",
    langColor: "#3572a5",
    stars: "1.7k",
    version: "v0.8.4",
    author: "Devin Reyes (@devinreyes)",
    authorType: "Individual Dev",
    link: "https://github.com",
    tags: ["Audio AI", "PyTorch", "Streaming"],
  },

  // ── 03. Group Projects
  {
    id: "5",
    name: "ZeroVerif ZK-ML",
    category: "group",
    categoryLabel: "Group projects",
    desc: "Zero-knowledge proof verification pipeline for privacy-preserving neural network inferences on untrusted cloud hardware.",
    lang: "Python",
    langColor: "#3572a5",
    stars: "1.1k",
    version: "v0.9.1",
    author: "Crypto & ML Sprint Team (4 members)",
    authorType: "Group Team",
    link: "https://github.com",
    tags: ["ZK-Snarks", "Privacy", "PyTorch"],
  },
  {
    id: "6",
    name: "GraphSynth Compiler",
    category: "group",
    categoryLabel: "Group projects",
    desc: "Heterogeneous graph compiler targeting custom edge tensor cores and local NPU architectures with automatic fusion.",
    lang: "C++",
    langColor: "#f34b7d",
    stars: "950",
    version: "v0.5.0",
    author: "Compiler SIG Group (3 members)",
    authorType: "Group Team",
    link: "https://github.com",
    tags: ["Compilers", "LLVM", "Edge Hardware"],
  },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(() => {
    return projectsData.filter((p) => {
      const matchesCategory =
        activeCategory === "all" || p.category === activeCategory;
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query) ||
        p.lang.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className={styles.page}>
      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>ARTIFACT REGISTRY · ECOSYSTEM BUILDS</span>
          <h1 className={styles.title}>Our projects</h1>
          <p className={styles.subtitle}>
            Explore open source repositories, individual tools, and group initiatives built by the Advait collective.
          </p>
          <div className={styles.heroActions}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={styles.submitBtn}
            >
              + Submit a project ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Category Filter Pills (Exact 3 Sections from user sketch) ──────── */}
      <section className={styles.controlsSection}>
        <div className={styles.controlsInner}>
          <div className={styles.categoryPills}>
            <button
              onClick={() => setActiveCategory("all")}
              className={`${styles.catPill} ${
                activeCategory === "all" ? styles.catPillActive : ""
              }`}
            >
              All Projects ({projectsData.length})
            </button>
            <button
              onClick={() => setActiveCategory("opensource")}
              className={`${styles.catPill} ${
                activeCategory === "opensource" ? styles.catPillActive : ""
              }`}
            >
              Open source projects (community based)
            </button>
            <button
              onClick={() => setActiveCategory("individual")}
              className={`${styles.catPill} ${
                activeCategory === "individual" ? styles.catPillActive : ""
              }`}
            >
              Individual projects
            </button>
            <button
              onClick={() => setActiveCategory("group")}
              className={`${styles.catPill} ${
                activeCategory === "group" ? styles.catPillActive : ""
              }`}
            >
              Group projects
            </button>
          </div>

          {/* Search bar */}
          <div className={styles.searchWrap}>
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
              placeholder="Search by name, tag, or language..."
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
        </div>
      </section>

      {/* ── Projects Grid ──────────────────────────────────────────────────── */}
      <section className={styles.gridSection}>
        <div className={styles.gridInner}>
          {filteredProjects.length === 0 ? (
            <div className={styles.empty}>
              <p>No projects match your filter.</p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearch("");
                }}
                className={styles.resetBtn}
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredProjects.map((p) => (
              <article key={p.id} className={styles.projectCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardBadgeRow}>
                    <span
                      className={`${styles.badge} ${
                        p.category === "opensource"
                          ? styles.badgeOpenSource
                          : p.category === "individual"
                          ? styles.badgeIndividual
                          : styles.badgeGroup
                      }`}
                    >
                      {p.categoryLabel}
                    </span>
                    <span className={styles.version}>{p.version}</span>
                  </div>
                  <span className={styles.stars}>★ {p.stars}</span>
                </div>

                <h2 className={styles.projectName}>{p.name}</h2>
                <p className={styles.projectDesc}>{p.desc}</p>

                <div className={styles.tagsRow}>
                  {p.tags.map((t) => (
                    <span key={t} className={styles.tagPill}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.metaLeft}>
                    <span
                      className={styles.langDot}
                      style={{ background: p.langColor }}
                    />
                    <span className={styles.langName}>{p.lang}</span>
                    <span className={styles.dotSep}>·</span>
                    <span className={styles.authorText}>{p.author}</span>
                  </div>

                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.viewLink}
                  >
                    View project ↗
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
