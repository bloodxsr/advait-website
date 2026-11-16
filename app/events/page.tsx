"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./events.module.css";

type EventFilter = "all" | "upcoming" | "past" | "news" | "socials";

interface EventItem {
  id: string;
  num: string;
  type: "event" | "news";
  typeLabel: string;
  division: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  desc: string;
  status: "upcoming" | "past" | "news";
  actionText: string;
}

interface SocialChannel {
  id: string;
  num: string;
  name: string;
  handle: string;
  desc: string;
  badge: string;
  url: string;
  metric: string;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: "soc-ig",
    num: "01",
    name: "Instagram",
    handle: "@advait.collective",
    desc: "Visual design essays, generative stencil breakdowns, salon backstage recaps, and collective culture dispatches.",
    badge: "VISUAL & CULTURE",
    url: "https://instagram.com",
    metric: "1.8K Followers",
  },
  {
    id: "soc-gh",
    num: "02",
    name: "GitHub Organization",
    handle: "github.com/advait-collective",
    desc: "Open source engineering artifacts: AetherSwarm, LatentMesh WebGPU, ZKML proof verifiers, and client SDKs.",
    badge: "CODE & REPOSITORIES",
    url: "https://github.com",
    metric: "48 Repositories · 120+ PRs",
  },
  {
    id: "soc-dc",
    num: "03",
    name: "Discord Stage & Lounge",
    handle: "discord.gg/advait",
    desc: "Real-time builder rooms for RED, OPS, EVED, Creatives, and GameVeda. Live stage broadcasts for all technical salons.",
    badge: "REAL-TIME COMMUNITY",
    url: "https://discord.com",
    metric: "3,200+ Members Active",
  },
  {
    id: "soc-x",
    num: "04",
    name: "X / Twitter",
    handle: "@advait_collective",
    desc: "Low-latency engineering threads, benchmark differentials, research paper dispatches, and salon reminders.",
    badge: "SYSTEMS DISPATCHES",
    url: "https://x.com",
    metric: "Daily Announcements",
  },
  {
    id: "soc-yt",
    num: "05",
    name: "YouTube Channel",
    handle: "youtube.com/@advait",
    desc: "Full-length 4K lecture archives, architecture teardown recordings, WebGPU shader workshops, and builder demos.",
    badge: "VIDEO ARCHIVE",
    url: "https://youtube.com",
    metric: "Salon Video Vault",
  },
  {
    id: "soc-news",
    num: "06",
    name: "Research Newsletter",
    handle: "hello@advait.collective",
    desc: "Curated fortnightly digest covering state-of-the-art open models, collective grant allocations, and peer review logs.",
    badge: "EDITORIAL DIGEST",
    url: "mailto:hello@advait.collective",
    metric: "Fortnightly Docket",
  },
];

const NEXT_FEATURED_SALON = {
  num: "00",
  title: "AetherSwarm Distributed Architecture Salon",
  division: "RED / EVED",
  date: "OCT 28, 2026",
  time: "6:00 PM – 8:30 PM IST",
  venue: "Main Campus Auditorium & Discord Live Stage",
  desc: "A hands-on technical workshop dissecting multi-agent node consensus, WebGPU compute shaders, and low-latency RPC streaming protocols with core collective maintainers and division stewards.",
  link: "#rsvp",
};

const EVENTS_DATA: EventItem[] = [
  {
    id: "e-1",
    num: "01",
    type: "event",
    typeLabel: "TECHNICAL SALON",
    division: "RED",
    title: "Open Systems & Generative Latents Workshop",
    date: "NOV 04, 2026",
    time: "5:00 PM IST",
    venue: "Lab 4 & Discord Stream",
    desc: "Building local inference visualizers with 3D Gaussian splatting running client-side with zero cloud dependencies and custom WebGL shaders.",
    status: "upcoming",
    actionText: "RSVP for session ↗",
  },
  {
    id: "e-2",
    num: "02",
    type: "event",
    typeLabel: "RESEARCH SALON",
    division: "RED",
    title: "Zero-Knowledge Proofs in Compilation Pipelines",
    date: "NOV 18, 2026",
    time: "6:30 PM IST",
    venue: "Discord Live Stage",
    desc: "Deep-dive into ZK-SNARK verifier circuits, proof-carrying intermediate representations, and confidential ONNX neural network execution.",
    status: "upcoming",
    actionText: "RSVP for session ↗",
  },
  {
    id: "e-3",
    num: "03",
    type: "news",
    typeLabel: "COLLECTIVE DISPATCH",
    division: "OPS",
    title: "Advait Autumn Research Sprint Kickoff & Grants",
    date: "OCT 20, 2026",
    desc: "Announcing $5,000 in micro-grants for student open-source infrastructure projects, edge AI accelerators, and verifiable compute artifacts.",
    status: "news",
    actionText: "Read announcement ↗",
  },
  {
    id: "e-4",
    num: "04",
    type: "event",
    typeLabel: "ANNUAL REVIEW",
    division: "EVED",
    title: "End-of-Year Collective Review & Project Showcase",
    date: "DEC 19, 2026",
    time: "4:00 PM IST",
    venue: "Advait Innovation Hub",
    desc: "Showcasing student-built autonomous agents, peer-reviewed paper dispatches, and awarding the top open source contributors in the Hall of Builders.",
    status: "upcoming",
    actionText: "RSVP for showcase ↗",
  },
  {
    id: "e-5",
    num: "05",
    type: "event",
    typeLabel: "ARCHIVE SALON",
    division: "RED",
    title: "Designing Data-Intensive Micro-Architectures",
    date: "SEP 12, 2026",
    desc: "Archive recording & lecture slides from our systems salon exploring fault tolerance, replication logs, and Raft consensus.",
    status: "past",
    actionText: "View slides & recording ↗",
  },
  {
    id: "e-6",
    num: "06",
    type: "news",
    typeLabel: "SYSTEM DISPATCH",
    division: "RED",
    title: "Advait-HOB-SDK v1.1.0 Released to Community",
    date: "SEP 02, 2026",
    desc: "Complete overhaul of the Go & Rust client SDKs featuring automated state sync, high-throughput RPC, and zero-alloc serialization.",
    status: "news",
    actionText: "View release notes ↗",
  },
];

export default function EventsPage() {
  const [filter, setFilter] = useState<EventFilter>("all");
  const [search, setSearch] = useState("");
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter((item) => {
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "upcoming"
            ? item.status === "upcoming"
            : filter === "past"
              ? item.status === "past"
              : filter === "news"
                ? item.status === "news"
                : true;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.division.toLowerCase().includes(q) ||
        item.typeLabel.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const handleRsvp = () => {
    setRsvpSuccess(true);
    setTimeout(() => setRsvpSuccess(false), 4000);
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── 00. Monumental Swiss Header (Opposite Theme: Deep Black Canvas) ── */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerIndex}>
              <span>[00]</span>
              <span>CALENDAR &amp; SALONS / ARCHIVE</span>
            </div>
            <div className={styles.headerMeta}>
              <span>DIR / 2026</span>
            </div>
          </div>

          <div className={styles.titleRow}>
            <div className={styles.titleWrap}>
              <h1 className={styles.title}>ADVAIT&apos;S SOCIAL</h1>
              <span className={styles.registered}>®</span>
            </div>
            <span className={styles.versionTag}>/V.01</span>
            <span className={styles.yearTag}>(2026)</span>
          </div>

          <div className={styles.headerSummaryRow}>
            <div className={styles.summaryLeftCol}>
              <p className={styles.headerSummary}>
                <span className={styles.monoIndex}>{`{1}`}</span>
                Architecture salons, hackathon cohorts, paper reading groups, and technical
                dispatches hosted by the Advait collective. All gatherings prioritize rigorous
                engineering breakdown, runnable live code, and open discussion over keynote fluff.
              </p>
              <div className={styles.headerJumpWrap}>
                <a href="#socials" className={styles.jumpSocialsLink}>
                  [04] VIEW COMMUNITY CHANNELS &amp; SOCIAL HUBS ↓
                </a>
              </div>
            </div>
            <div className={styles.statsRoster}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>04</span>
                <span className={styles.statLabel}>Upcoming Salons</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>06</span>
                <span className={styles.statLabel}>Social Hubs</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>1.2k+</span>
                <span className={styles.statLabel}>Attendees</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── 01. Featured Upcoming Salon Hero Banner ──────────────────────────── */}
        <section id="rsvp" className={styles.featuredSection}>
          <div className={styles.featuredCard}>
            <div className={styles.featuredTopRow}>
              <div className={styles.featuredBadges}>
                <span className={styles.featuredPill}>[FEATURED SALON]</span>
                <span className={styles.divTag}>[{NEXT_FEATURED_SALON.division}]</span>
              </div>
              <span className={styles.countdownBadge}>● LIVE REGISTRATION OPEN</span>
            </div>

            <div className={styles.featuredContent}>
              <div className={styles.dateTimeGrid}>
                <div className={styles.dateBlock}>
                  <span className={styles.dateLabel}>DATE:</span>
                  <span className={styles.dateValue}>{NEXT_FEATURED_SALON.date}</span>
                </div>
                <div className={styles.dateBlock}>
                  <span className={styles.dateLabel}>TIME:</span>
                  <span className={styles.dateValue}>{NEXT_FEATURED_SALON.time}</span>
                </div>
                <div className={styles.dateBlock}>
                  <span className={styles.dateLabel}>LOCATION:</span>
                  <span className={styles.dateValue}>{NEXT_FEATURED_SALON.venue}</span>
                </div>
              </div>

              <h2 className={styles.featuredHeading}>
                {NEXT_FEATURED_SALON.title}
              </h2>
              <p className={styles.featuredDesc}>{NEXT_FEATURED_SALON.desc}</p>
            </div>

            <div className={styles.featuredActions}>
              <button
                type="button"
                onClick={handleRsvp}
                className={styles.rsvpBtn}
              >
                <span>{rsvpSuccess ? "✓ RSVP REGISTERED ON DOCKET" : "RSVP FOR THIS TECHNICAL SALON"}</span>
                <span>→</span>
              </button>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className={styles.discordBtn}
              >
                Join Discord Stage ↗
              </a>
            </div>
          </div>
        </section>

        {/* ── 02. Filter & Search Controls ────────────────────────────────────── */}
        <section className={styles.controlsSection}>
          <div className={styles.controlsRow}>
            {/* Search Input */}
            <div className={styles.searchWrap}>
              <span className={styles.searchPrompt}>[SEARCH] ›</span>
              <input
                type="text"
                placeholder="Search salons by topic, date, or division..."
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

            {/* Filter Pills */}
            <div className={styles.filterPills} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={filter === "all"}
                onClick={() => setFilter("all")}
                className={`${styles.filterPill} ${filter === "all" ? styles.filterPillActive : ""
                  }`}
              >
                [ALL GATHERINGS]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "upcoming"}
                onClick={() => setFilter("upcoming")}
                className={`${styles.filterPill} ${filter === "upcoming" ? styles.filterPillActive : ""
                  }`}
              >
                [UPCOMING SALONS]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "past"}
                onClick={() => setFilter("past")}
                className={`${styles.filterPill} ${filter === "past" ? styles.filterPillActive : ""
                  }`}
              >
                [ARCHIVED REVIEWS]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "news"}
                onClick={() => setFilter("news")}
                className={`${styles.filterPill} ${filter === "news" ? styles.filterPillActive : ""
                  }`}
              >
                [DISPATCHES &amp; NEWS]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "socials"}
                onClick={() => setFilter("socials")}
                className={`${styles.filterPill} ${filter === "socials" ? styles.filterPillActive : ""
                  }`}
              >
                [COMMUNITY &amp; SOCIALS]
              </button>
            </div>
          </div>
        </section>

        {/* ── 03. Events Grid (Opposite Theme: Inverts to Solid White on Hover) ─ */}
        <section className={styles.eventsGridSection} aria-label="Events Calendar">
          {filteredEvents.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyPrompt}>[NO SESSIONS FOUND]</span>
              <p className={styles.emptyText}>
                No gatherings match your search &quot;{search}&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilter("all");
                  setSearch("");
                }}
                className={styles.resetBtn}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.eventsGrid}>
              {filteredEvents.map((ev) => (
                <article key={ev.id} className={styles.eventCard}>
                  {/* Card Top */}
                  <div className={styles.cardTop}>
                    <div className={styles.cardBadges}>
                      <span className={styles.cardNum}>[{ev.num}]</span>
                      <span className={styles.divPill}>[{ev.division}]</span>
                      <span className={styles.typeBadge}>[{ev.typeLabel}]</span>
                    </div>
                    <span className={styles.dateStamp}>{ev.date}</span>
                  </div>

                  {/* Body */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.eventHeading}>{ev.title}</h3>
                    {ev.time && (
                      <div className={styles.timeVenueRow}>
                        <span>{ev.time}</span>
                        {ev.venue && (
                          <>
                            <span>·</span>
                            <span>{ev.venue}</span>
                          </>
                        )}
                      </div>
                    )}
                    <p className={styles.eventDescText}>{ev.desc}</p>
                  </div>

                  {/* Footer */}
                  <div className={styles.cardFooter}>
                    <span className={styles.statusIndicator}>
                      {ev.status === "upcoming"
                        ? "● UPCOMING SESSION"
                        : ev.status === "past"
                          ? "○ ARCHIVED PROCEEDINGS"
                          : "◆ OFFICIAL DISPATCH"}
                    </span>
                    <span className={styles.cardAction}>
                      <span>{ev.actionText}</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ── 04. Merged Community Channels & Social Network Hub ──────────────── */}
        <section
          className={styles.socialsSection}
          id="socials"
          aria-label="Community Channels & Social Hub"
        >
          <div className={styles.socialsHeader}>
            <div className={styles.socialsIndexRow}>
              <span className={styles.socialsIndex}>[04]</span>
              <span className={styles.socialsLabel}>
                NETWORK DOCKET / SOCIAL REDIRECTS
              </span>
            </div>
            <div className={styles.socialsTitleRow}>
              <h2 className={styles.socialsTitle}>
                COMMUNITY CHANNELS &amp; SOCIAL HUBS
              </h2>
              <p className={styles.socialsSubtitle}>
                Advait operates across open network spaces. Connect directly with division stewards,
                attend salon live stages on Discord, follow visual design essays on Instagram, and
                fork open-source codebases on GitHub.
              </p>
            </div>
          </div>

          <div className={styles.socialsGrid}>
            {SOCIAL_CHANNELS.map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                className={styles.socialCard}
              >
                <div className={styles.socialCardTop}>
                  <div className={styles.socialNumBadge}>
                    <span className={styles.socialNum}>[{soc.num}]</span>
                    <span className={styles.socialBadge}>[{soc.badge}]</span>
                  </div>
                  <span className={styles.socialArrow}>↗</span>
                </div>

                <div className={styles.socialCardBody}>
                  <h3 className={styles.socialName}>{soc.name}</h3>
                  <span className={styles.socialHandle}>{soc.handle}</span>
                  <p className={styles.socialDesc}>{soc.desc}</p>
                </div>

                <div className={styles.socialCardFooter}>
                  <span className={styles.socialMetric}>{soc.metric}</span>
                  <span className={styles.socialLinkAction}>
                    Connect ↗
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── 05. Propose a Salon Section ─────────────────────────────────────── */}
        <section className={styles.proposeSection}>
          <div className={styles.proposeCard}>
            <div className={styles.proposeLeft}>
              <div className={styles.proposeIndex}>
                <span>[05]</span>
                <span>SPEAKER &amp; SALON PROPOSALS</span>
              </div>
              <h3 className={styles.proposeTitle}>
                Want to host an architecture salon or lead a paper reading?
              </h3>
              <p className={styles.proposeDesc}>
                We welcome researchers, founders, and engineers to run interactive sessions
                on low-level runtimes, zero-knowledge proofs, edge model quantization, or
                graphics engineering. Advait coordinates auditorium logistics and live streaming.
              </p>
            </div>

            <div className={styles.proposeActions}>
              <a
                href="mailto:events@advait.collective"
                className={styles.primaryProposeBtn}
              >
                <span>Propose a Session</span>
                <span>↗</span>
              </a>
              <Link href="/team" className={styles.secondaryTeamBtn}>
                Contact EVED Division Leads →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
