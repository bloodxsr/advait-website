"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./events.module.css";

type EventFilter = "upcoming" | "past" | "news";

interface EventItem {
  id: string;
  type: "event" | "news";
  typeLabel: "Event" | "News";
  title: string;
  date: string;
  time?: string;
  venue?: string;
  desc: string;
  status: "upcoming" | "past" | "news";
  accentGradient: string;
  actionText: string;
}

const NEXT_EVENT = {
  title: "AetherSwarm Distributed Architecture Salon",
  date: "Oct 28, 2026",
  time: "6:00 PM – 8:30 PM IST",
  venue: "Main Campus Auditorium & Discord Live Stage",
  desc: "A hands-on technical workshop dissecting multi-agent node consensus, WebGPU compute shaders, and low-latency RPC streaming protocols with core collective maintainers.",
  link: "#rsvp",
};

const EVENTS_DATA: EventItem[] = [
  {
    id: "e-1",
    type: "event",
    typeLabel: "Event",
    title: "Open Systems & Generative Latents Workshop",
    date: "Nov 04, 2026",
    time: "5:00 PM IST",
    venue: "Lab 4 & Online",
    desc: "Building local inference visualizers with 3D Gaussian splatting running client-side with zero cloud dependencies.",
    status: "upcoming",
    accentGradient: "linear-gradient(135deg, rgba(10, 132, 255, 0.3), rgba(0, 0, 0, 0.7))",
    actionText: "RSVP for session →",
  },
  {
    id: "e-2",
    type: "event",
    typeLabel: "Event",
    title: "Zero-Knowledge Proofs in Compilation Pipelines",
    date: "Nov 18, 2026",
    time: "6:30 PM IST",
    venue: "Discord Stage",
    desc: "Deep-dive into ZK-SNARK verifier circuits and proof-carrying intermediate representations for confidential inferences.",
    status: "upcoming",
    accentGradient: "linear-gradient(135deg, rgba(191, 90, 242, 0.3), rgba(0, 0, 0, 0.7))",
    actionText: "RSVP for session →",
  },
  {
    id: "e-3",
    type: "news",
    typeLabel: "News",
    title: "Advait Autumn Research Sprint Kickoff & Grants",
    date: "Oct 20, 2026",
    desc: "Announcing $5,000 in micro-grants for student open-source infrastructure projects, edge AI accelerators, and verifiable compute.",
    status: "news",
    accentGradient: "linear-gradient(135deg, rgba(255, 159, 10, 0.3), rgba(0, 0, 0, 0.7))",
    actionText: "Read announcement →",
  },
  {
    id: "e-4",
    type: "event",
    typeLabel: "Event",
    title: "End-of-Year Collective Review & Project Showcase",
    date: "Dec 19, 2026",
    time: "4:00 PM IST",
    venue: "Advait Innovation Hub",
    desc: "Showcasing student-built autonomous agents, peer-reviewed paper dispatches, and awarding the top open source contributors.",
    status: "upcoming",
    accentGradient: "linear-gradient(135deg, rgba(48, 209, 88, 0.3), rgba(0, 0, 0, 0.7))",
    actionText: "RSVP for session →",
  },
  {
    id: "e-5",
    type: "event",
    typeLabel: "Event",
    title: "Designing Data-Intensive Micro-Architectures",
    date: "Sep 12, 2026",
    desc: "Archive recording & lecture slides from our systems salon exploring fault tolerance, replication logs, and Raft consensus.",
    status: "past",
    accentGradient: "linear-gradient(135deg, rgba(94, 92, 230, 0.3), rgba(0, 0, 0, 0.7))",
    actionText: "View slides & recording →",
  },
  {
    id: "e-6",
    type: "news",
    typeLabel: "News",
    title: "Advait-HOB-SDK v1.1.0 Released to Community",
    date: "Sep 02, 2026",
    desc: "Complete overhaul of the Go & Rust client SDKs featuring automated state sync and zero-alloc serialization.",
    status: "news",
    accentGradient: "linear-gradient(135deg, rgba(255, 69, 58, 0.3), rgba(0, 0, 0, 0.7))",
    actionText: "Read changelog →",
  },
];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<EventFilter>("upcoming");

  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter((e) => {
      if (activeFilter === "upcoming") return e.status === "upcoming";
      if (activeFilter === "past") return e.status === "past";
      if (activeFilter === "news") return e.type === "news";
      return true;
    });
  }, [activeFilter]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── Page Header (matching wireframe) ─────────────────────────────── */}
        <section className={styles.hero}>
          <span className={styles.eyebrow}>CALENDAR &amp; GATHERINGS · COMMUNITY</span>
          <h1 className={styles.title}>Events</h1>
          <p className={styles.subtitle}>Upcoming events and club news.</p>
        </section>

        {/* ── Filter Pills: Upcoming / Past / News (matching wireframe) ─────── */}
        <div className={styles.filterRow}>
          <button
            onClick={() => setActiveFilter("upcoming")}
            className={`${styles.filterPill} ${
              activeFilter === "upcoming" ? styles.filterPillActive : ""
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter("past")}
            className={`${styles.filterPill} ${
              activeFilter === "past" ? styles.filterPillActive : ""
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setActiveFilter("news")}
            className={`${styles.filterPill} ${
              activeFilter === "news" ? styles.filterPillActive : ""
            }`}
          >
            News
          </button>
        </div>

        {/* ── Featured Next Event Card (Split 50/50 Layout from wireframe) ─── */}
        {activeFilter === "upcoming" && (
          <section className={styles.featuredCard}>
            <div className={styles.featuredVisual}>
              <div className={styles.visualPattern} />
              <div className={styles.visualBadgeOverlay}>
                <div className={styles.visualDateBox}>
                  <span className={styles.visualDay}>28</span>
                  <span className={styles.visualMonth}>OCT 2026</span>
                </div>
                <span className={styles.visualLabel}>Advait Gathering #14</span>
              </div>
            </div>

            <div className={styles.featuredContent}>
              <span className={styles.nextEventBadge}>Next event</span>
              <h2 className={styles.featuredTitle}>{NEXT_EVENT.title}</h2>
              <p className={styles.featuredMeta}>
                {NEXT_EVENT.date} · {NEXT_EVENT.time} · {NEXT_EVENT.venue}
              </p>
              <p className={styles.featuredDesc}>{NEXT_EVENT.desc}</p>
              <div className={styles.featuredActions}>
                <a href={NEXT_EVENT.link} className={styles.rsvpBtn}>
                  Register for salon →
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ── 3-Column Grid (matching wireframe) ───────────────────────────── */}
        <div className={styles.grid}>
          {filteredEvents.map((evt) => (
            <article key={evt.id} className={styles.card}>
              <div className={styles.cardVisual}>
                <div
                  className={styles.cardVisualGradient}
                  style={{ background: evt.accentGradient }}
                />
                <span className={styles.cardVisualDate}>{evt.date}</span>
              </div>
              <div className={styles.cardBody}>
                <span
                  className={`${styles.cardTag} ${
                    evt.type === "event" ? styles.tagEvent : styles.tagNews
                  }`}
                >
                  {evt.typeLabel}
                </span>
                <h3 className={styles.cardTitle}>{evt.title}</h3>
                <p className={styles.cardMeta}>
                  {evt.date}
                  {evt.venue ? ` · ${evt.venue}` : ""}
                </p>
                <p className={styles.cardDesc}>{evt.desc}</p>
                <a href="#details" className={styles.cardAction}>
                  {evt.actionText}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
