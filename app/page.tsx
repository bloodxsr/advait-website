"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdvaitIntro } from "@/components/AdvaitIntro";
import { ArchitecturalHero } from "@/components/ArchitecturalHero";
import styles from "./home.module.css";

interface DivisionItem {
  code: string;
  name: string;
  badge: string;
  desc: string;
  href: string;
}

interface EventPreview {
  day: string;
  month: string;
  category: string;
  title: string;
  desc: string;
  href: string;
}

const DEFAULT_DIVISIONS: DivisionItem[] = [
  {
    code: "RED",
    name: "Research & Engineering",
    badge: "Engineering",
    desc: "Kernel runtimes, edge model quantization, WebGPU shaders, and distributed multi-agent consensus architectures.",
    href: "/team",
  },
  {
    code: "OPS",
    name: "Outreach, PR & Sponsorships",
    badge: "Ecosystem",
    desc: "Corporate partnerships, university alliances, developer grants, and external communications for open scholarship.",
    href: "/team",
  },
  {
    code: "EVED",
    name: "Events & Ventures Execution",
    badge: "Operations",
    desc: "Architecture salons, quarterly hackathons, technical workshop cohorts, and incubator venture spinouts.",
    href: "/team",
  },
  {
    code: "Creatives",
    name: "Creatives & Social Media",
    badge: "Design",
    desc: "Design systems, generative visual identity, product UI/UX, typography, and community narrative dispatches.",
    href: "/team",
  },
  {
    code: "GameVeda",
    name: "Game Development Division",
    badge: "Interactive",
    desc: "Unreal Engine 5 architectures, procedural physics simulations, and next-generation interactive experiences.",
    href: "/team",
  },
];

export default function Home() {
  const [divisions, setDivisions] = useState<DivisionItem[]>(DEFAULT_DIVISIONS);
  const [events, setEvents] = useState<EventPreview[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadLandingData() {
      try {
        const [divRes, evRes] = await Promise.all([
          fetch("/api/divisions"),
          fetch("/api/events?limit=3"),
        ]);

        if (divRes.ok) {
          const divData = await divRes.json();
          if (divData.divisions && divData.divisions.length > 0) {
            const mapped = divData.divisions.map((d: any) => ({
              code: d.slug,
              name: d.name,
              badge: d.badge,
              desc: d.desc,
              href: `/team?division=${d.slug}`,
            }));
            if (isMounted) setDivisions(mapped);
          }
        }

        if (evRes.ok) {
          const evData = await evRes.json();
          if (evData.events && evData.events.length > 0) {
            const mapped = evData.events.slice(0, 3).map((e: any) => {
              const d = e.startsAt ? new Date(e.startsAt) : new Date();
              return {
                day: String(d.getDate()).padStart(2, "0"),
                month: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase(),
                category: e.kind === "salon" ? "Technical Salon · Main Campus" : "Advait Technical Workshop",
                title: e.title,
                desc: e.description || "Advait open session and collective gathering.",
                href: "/events",
              };
            });
            if (isMounted) setEvents(mapped);
          }
        }
      } catch (err) {
        console.error("Landing data fetch error:", err);
      }
    }

    loadLandingData();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <main className={styles.main}>
      {/* ── 00. Opening Kinetic Typography Animation (from video reference) ── */}
      <AdvaitIntro />

      {/* ── 01. Swiss Architectural Editorial Hero ─────────────────────────── */}
      <ArchitecturalHero />

      {/* ── 02. Section 01: Working Divisions ──────────────────────────────── */}
      <section id="manifesto" className={styles.section} aria-label="Divisions">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIndex}>
            <span>[01]</span>
            <span>DIVISIONS / WORKING GROUPS</span>
          </div>
          <span className={styles.sectionMeta}>
            5 Active Units · Autonomous Execution
          </span>
        </div>

        <div className={styles.divisionsGrid}>
          {divisions.map((div) => (
            <Link
              key={div.code}
              href={div.href}
              className={styles.divisionCard}
              title={`View ${div.name}`}
            >
              <div>
                <div className={styles.divisionCardTop}>
                  <span className={styles.divisionCode}>{div.code}</span>
                  <span className={styles.divisionBadge}>{div.badge}</span>
                </div>
                <h3 className={styles.divisionName}>{div.name}</h3>
                <p className={styles.divisionDesc}>{div.desc}</p>
              </div>
              <div className={styles.divisionArrow}>
                <span>Meet team &amp; projects</span>
                <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 03. Section 02: Upcoming Events ─────────────────────────────────── */}
      <section className={styles.section} aria-label="Events Calendar">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIndex}>
            <span>[02]</span>
            <span>SALONS &amp; CALENDAR / 2026</span>
          </div>
          <span className={styles.sectionMeta}>Free &amp; Open Access</span>
        </div>

        <div className={styles.eventsList}>
          {events.length === 0 ? (
            <div style={{ padding: "36px 0", color: "#71717a", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
              No upcoming public salons or events on the calendar. Check back soon or visit{" "}
              <Link href="/events" style={{ color: "#a78bfa" }}>
                Advait&apos;s Socials ↗
              </Link>
              .
            </div>
          ) : (
            events.map((ev) => (
              <Link
                key={ev.title}
                href={ev.href}
                className={styles.eventRow}
                title={`View ${ev.title}`}
              >
                <div className={styles.eventDate}>
                  <span className={styles.eventDay}>{ev.day}</span>
                  <span className={styles.eventMonth}>{ev.month}</span>
                </div>
                <div className={styles.eventInfo}>
                  <span className={styles.eventCategory}>{ev.category}</span>
                  <h3 className={styles.eventTitle}>{ev.title}</h3>
                  <p className={styles.eventDesc}>{ev.desc}</p>
                </div>
                <div className={styles.eventLink}>
                  <span>Details</span>
                  <span>↗</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ── 04. Section 03: Connect Desk ────────────────────────────────────── */}
      <section className={styles.section} aria-label="Connect Desk">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIndex}>
            <span>[03]</span>
            <span>CONNECT / COMMUNICATIONS DESK</span>
          </div>
          <span className={styles.sectionMeta}>Advait Collective</span>
        </div>

        <div className={styles.connectContent}>
          <div>
            <h2 className={styles.connectHeading}>
              Building open systems for longevity and craft.
            </h2>
            <p className={styles.connectDesc}>
              Whether you are an engineer writing low-level kernel code, a researcher
              exploring neural radiance fields, or an organizer curious about
              collaborating, reach out directly.
            </p>
          </div>

          <div className={styles.connectActions}>
            <a
              href="mailto:hello@advait.collective"
              className={styles.connectEmailBtn}
            >
              <span>hello@advait.collective</span>
              <span>↗</span>
            </a>
            <Link href="/login" className={styles.connectSignInBtn}>
              <span>Member Sign In &amp; Dashboard</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
