"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./team.module.css";

interface DivisionLeader {
  id: string;
  name: string;
  initials: string;
  role: string;
  divisionCode: string;
  divisionName: string;
  yearDept: string;
  desc: string;
  image: string;
  deliverable: string;
  num: string;
}

const CLUB_LEADER = {
  name: "Aditya B. Ray",
  initials: "AB",
  role: "Club Leader",
  titleBadge: "EXECUTIVE STEWARD",
  yearDept: "Year 4 · Computer Science & Engineering",
  term: "Active Term 2026",
  bio: "Advancing autonomous systems, open architectures, and empowering our builders to ship world-class systems with clarity and care. Directing research across distributed consensus, WebGPU compute shaders, and deep generative models.",
  image:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  oversight: ["RED", "OPS", "EVED", "Creatives", "GameVeda"],
};

const DIVISION_LEADERS: DivisionLeader[] = [
  {
    id: "lead-red",
    num: "01",
    name: "Devin Reyes",
    initials: "DR",
    role: "Division Lead",
    divisionCode: "RED",
    divisionName: "Research & Engineering Division",
    yearDept: "Year 3 · Computer Science & Engineering",
    desc: "Low-level kernel runtimes, edge model quantization, distributed multi-agent consensus protocols, and WebGPU compute shaders.",
    deliverable: "AetherSwarm Engine v0.9",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lead-ops",
    num: "02",
    name: "Ananya Sharma",
    initials: "AS",
    role: "Division Lead",
    divisionCode: "OPS",
    divisionName: "Outreach, PR & Sponsorships",
    yearDept: "Year 3 · Information Technology",
    desc: "Institutional partnerships, open-source developer grants, tech ecosystem alliances, and external public communications.",
    deliverable: "Open Dev Grant Registry",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lead-eved",
    num: "03",
    name: "Rohan Mehta",
    initials: "RM",
    role: "Division Lead",
    divisionCode: "EVED",
    divisionName: "Events & Ventures Execution Division",
    yearDept: "Year 4 · Electronics & Communication",
    desc: "Flagship hackathons, architecture salons, technical workshop cohorts, demo days, and early-stage venture incubator spinouts.",
    deliverable: "Quarterly Tech Salons",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lead-creatives",
    num: "04",
    name: "Isha Verma",
    initials: "IV",
    role: "Division Lead",
    divisionCode: "Creatives",
    divisionName: "Creatives & Social Media",
    yearDept: "Year 3 · Media Informatics & Design",
    desc: "Brutalist design systems, generative visual identity, editorial typography, product UX architecture, and community dispatches.",
    deliverable: "Advait Stencil Identity System",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lead-gameveda",
    num: "05",
    name: "Vikramaditya Bose",
    initials: "VB",
    role: "Division Lead",
    divisionCode: "GameVeda",
    divisionName: "Game Development Division",
    yearDept: "Year 3 · Computer Science & Engineering",
    desc: "Unreal Engine 5 architectures, procedural physics engines, custom HLSL render passes, and next-gen interactive virtual environments.",
    deliverable: "Procedural Terrain Voxel Engine",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
  },
];

function TeamAvatar({
  src,
  alt,
  initials,
  className,
}: {
  src?: string;
  alt: string;
  initials: string;
  className: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={className}>
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          className={styles.avatarImg}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <span className={styles.fallbackInitials}>{initials}</span>
      )}
    </div>
  );
}

export default function TeamPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── 00. Monumental Swiss Header ─────────────────────────────────────── */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerIndex}>
              <span>[00]</span>
              <span>STEWARDSHIP / DIRECTORY</span>
            </div>
            <div className={styles.headerMeta}>
              <span>DIR / 2026</span>
              <span>·</span>
              <span>5 WORKING GROUPS</span>
              <span>·</span>
              <span>AUTONOMOUS EXECUTION</span>
            </div>
          </div>

          <div className={styles.titleRow}>
            <div className={styles.titleWrap}>
              <h1 className={styles.title}>STEWARDSHIP</h1>
              <span className={styles.registered}>®</span>
            </div>
            <span className={styles.versionTag}>/V.01</span>
            <span className={styles.yearTag}>(2026)</span>
          </div>

          <div className={styles.headerSummaryRow}>
            <p className={styles.headerSummary}>
              <span className={styles.monoIndex}>{`{1}`}</span>
              Advait is stewarded through a decentralized division model. Each
              working group is led by an elected lead maintaining autonomous
              execution across open research, distributed systems, developer
              grants, architectural salons, generative identity, and interactive
              simulation.
            </p>
            <div className={styles.statsRoster}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>01</span>
                <span className={styles.statLabel}>Club Leader</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>05</span>
                <span className={styles.statLabel}>Division Leads</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>100+</span>
                <span className={styles.statLabel}>Active Contributors</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── 01. Club Leader Dossier ─────────────────────────────────────────── */}
        <section className={styles.section} aria-label="Executive Stewardship">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIndex}>
              <span>[01]</span>
              <span>EXECUTIVE STEWARDSHIP</span>
            </div>
            <span className={styles.sectionMeta}>
              Collective Leadership · General Direction
            </span>
          </div>

          <div className={styles.leaderCard}>
            <div className={styles.leaderMedia}>
              <TeamAvatar
                src={CLUB_LEADER.image}
                alt={CLUB_LEADER.name}
                initials={CLUB_LEADER.initials}
                className={styles.leaderAvatar}
              />
              <div className={styles.mediaMeta}>
                <span className={styles.mediaTag}>[00 · LEAD]</span>
                <span className={styles.mediaStatus}>ACTIVE STEWARD</span>
              </div>
            </div>

            <div className={styles.leaderInfo}>
              <div className={styles.leaderHeader}>
                <div>
                  <div className={styles.badgeRow}>
                    <span className={styles.roleBadge}>
                      {CLUB_LEADER.titleBadge}
                    </span>
                    <span className={styles.termBadge}>{CLUB_LEADER.term}</span>
                  </div>
                  <h2 className={styles.leaderName}>{CLUB_LEADER.name}</h2>
                  <p className={styles.leaderDept}>{CLUB_LEADER.yearDept}</p>
                </div>
              </div>

              <p className={styles.leaderBio}>{CLUB_LEADER.bio}</p>

              <div className={styles.oversightBlock}>
                <span className={styles.oversightTitle}>
                  Divisions Under Oversight:
                </span>
                <div className={styles.oversightBadges}>
                  {CLUB_LEADER.oversight.map((code) => (
                    <span key={code} className={styles.oversightPill}>
                      [{code}]
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.leaderFooter}>
                <span className={styles.contactHint}>
                  For governance inquiries:
                </span>
                <a
                  href="mailto:leader@advait.collective"
                  className={styles.contactBtn}
                >
                  leader@advait.collective ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02. Division Leaders Grid ───────────────────────────────────────── */}
        <section className={styles.section} aria-label="Division Leaders">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIndex}>
              <span>[02]</span>
              <span>DIVISION LEADS / WORKING GROUPS</span>
            </div>
            <span className={styles.sectionMeta}>
              5 Autonomous Working Units · 2026 Term
            </span>
          </div>

          <div className={styles.divisionGrid}>
            {DIVISION_LEADERS.map((leader) => (
              <article key={leader.id} className={styles.divisionCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIndexRow}>
                    <span className={styles.cardNum}>[{leader.num}]</span>
                    <span className={styles.divisionBadge}>
                      [{leader.divisionCode}]
                    </span>
                  </div>
                  <span className={styles.roleTag}>{leader.role}</span>
                </div>

                <div className={styles.cardMediaRow}>
                  <TeamAvatar
                    src={leader.image}
                    alt={leader.name}
                    initials={leader.initials}
                    className={styles.divisionAvatar}
                  />
                  <div className={styles.nameBlock}>
                    <h3 className={styles.divisionCardName}>{leader.name}</h3>
                    <span className={styles.divisionDept}>
                      {leader.yearDept}
                    </span>
                  </div>
                </div>

                <div className={styles.divisionDetails}>
                  <h4 className={styles.divisionFullName}>
                    {leader.divisionName}
                  </h4>
                  <p className={styles.divisionDesc}>{leader.desc}</p>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.deliverableWrap}>
                    <span className={styles.deliverableLabel}>
                      Current Artifact:
                    </span>
                    <span className={styles.deliverableVal}>
                      {leader.deliverable}
                    </span>
                  </div>
                  <Link href="/projects" className={styles.divisionLink}>
                    <span>View artifacts</span>
                    <span>↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 03. Connect / Stewardship Inquiries ─────────────────────────────── */}
        <section className={styles.section} aria-label="Join Stewardship">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIndex}>
              <span>[03]</span>
              <span>ELECTIONS &amp; JOINING STEWARDSHIP</span>
            </div>
            <span className={styles.sectionMeta}>Spring 2026 Cohort</span>
          </div>

          <div className={styles.joinCard}>
            <div className={styles.joinLeft}>
              <h3 className={styles.joinTitle}>
                Want to lead a working group or propose a new division?
              </h3>
              <p className={styles.joinDesc}>
                Advait holds open division reviews and working group nominations
                every semester. Contributor voting is weighted by verified code
                contributions, workshop moderation, and technical output.
              </p>
            </div>
            <div className={styles.joinActions}>
              <Link href="/projects" className={styles.primaryActionBtn}>
                Explore Active Projects →
              </Link>
              <Link href="/" className={styles.secondaryActionBtn}>
                ← Back to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
