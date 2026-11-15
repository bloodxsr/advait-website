"use client";

import { useState } from "react";
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
}

const CLUB_LEADER = {
  name: "Aditya B. Ray",
  initials: "AB",
  role: "Club Leader",
  yearDept: "Year 4 · Computer Science & Engineering",
  bio: "Advancing autonomous systems, open architectures, and empowering our builders to ship world-class systems with clarity and care. Working across distributed consensus, kernel runtimes, and deep generative models.",
  image:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
};

const DIVISION_LEADERS: DivisionLeader[] = [
  {
    id: "lead-red",
    name: "Devin Reyes",
    initials: "DR",
    role: "Division leader",
    divisionCode: "RED",
    divisionName: "Research & Engineering Division",
    yearDept: "Year 3 · CSE",
    desc: "Kernel runtimes, edge model quantization, and distributed AI consensus systems.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "lead-ops",
    name: "Ananya Sharma",
    initials: "AS",
    role: "Division leader",
    divisionCode: "OPS",
    divisionName: "Outreach, PR & Sponsorships",
    yearDept: "Year 3 · IT",
    desc: "Corporate partnerships, open source developer grants, and external communications.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "lead-eved",
    name: "Rohan Mehta",
    initials: "RM",
    role: "Division leader",
    divisionCode: "EVED",
    divisionName: "Events & Ventures Execution Division",
    yearDept: "Year 4 · ECE",
    desc: "Hackathons, architecture salons, workshop cohorts, and incubator spinouts.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "lead-creatives",
    name: "Isha Verma",
    initials: "IV",
    role: "Division leader",
    divisionCode: "Creatives",
    divisionName: "Creatives & Social Media",
    yearDept: "Year 3 · Media Informatics",
    desc: "Design systems, generative visual identity, product UI/UX, and storytelling.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "lead-gameveda",
    name: "Vikramaditya Bose",
    initials: "VB",
    role: "Division leader",
    divisionCode: "GameVeda",
    divisionName: "Game Development Division",
    yearDept: "Year 3 · CSE",
    desc: "Unreal Engine 5 architectures, WebGPU compute shaders, and procedural physics engines.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
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
        <span>{initials}</span>
      )}
    </div>
  );
}

export default function TeamPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── Page Header (matching wireframe) ─────────────────────────────── */}
        <section className={styles.hero}>
          <span className={styles.eyebrow}>STEWARDSHIP · WORKING GROUPS</span>
          <h1 className={styles.title}>Meet our team</h1>
          <p className={styles.subtitle}>
            The leader and division leaders behind Advait.
          </p>
        </section>

        {/* ── Club Leader Card (Featured Top Card from wireframe) ─────────── */}
        <section className={styles.leaderCard}>
          <TeamAvatar
            src={CLUB_LEADER.image}
            alt={CLUB_LEADER.name}
            initials={CLUB_LEADER.initials}
            className={styles.leaderAvatar}
          />
          <div className={styles.leaderInfo}>
            <span className={styles.leaderBadge}>{CLUB_LEADER.role}</span>
            <h2 className={styles.leaderName}>{CLUB_LEADER.name}</h2>
            <p className={styles.leaderMeta}>{CLUB_LEADER.yearDept}</p>
            <p className={styles.leaderBio}>{CLUB_LEADER.bio}</p>
          </div>
        </section>

        {/* ── Division Leaders Section (matching wireframe with 5 divisions) ─ */}
        <section className={styles.divisionSection}>
          <h2 className={styles.sectionTitle}>Division leaders</h2>

          <div className={styles.divisionGrid}>
            {DIVISION_LEADERS.map((leader) => (
              <article key={leader.id} className={styles.divisionCard}>
                <TeamAvatar
                  src={leader.image}
                  alt={leader.name}
                  initials={leader.initials}
                  className={styles.divisionAvatar}
                />
                <h3 className={styles.divisionCardName}>{leader.name}</h3>
                <p className={styles.divisionRole}>{leader.role}</p>
                <span className={styles.divisionBadge}>
                  [{leader.divisionCode}]
                </span>
                <span className={styles.divisionFullName}>
                  {leader.divisionName}
                </span>
                <span className={styles.divisionDept}>{leader.yearDept}</span>
                <p className={styles.divisionDesc}>{leader.desc}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
