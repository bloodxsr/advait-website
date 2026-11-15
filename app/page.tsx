import { Hero } from "@/components/Hero";
import { LiquidFlowMesh } from "@/components/LiquidFlowMesh";
import Link from "next/link";
import styles from "./home.module.css";

const events = [
  ["28", "Oct 2026", "Building useful things together", "Online workshop"],
  ["04", "Nov 2026", "Open systems, open conversations", "Online salon"],
  ["19", "Dec 2026", "End-of-year collective review", "Community gathering"],
];

export default function Home() {
  return (
    <main className={styles.main}>
      {/* 60fps Dynamic Liquid Water Flow (Smoothly morphs colors with scroll) */}
      <LiquidFlowMesh />

      {/* Hero Section — Minimal, focused, and commanding */}
      <Hero />

      {/* 01 / Our Vision */}
      <section
        id="vision-section"
        className={`section ${styles.vision}`}
        aria-labelledby="vision-title"
      >
        <div className={styles.sectionLabel}>
          <p className="eyebrow accent-cyan">01 / Our vision</p>
          <span className={styles.waterPill}>Aurora Stream</span>
        </div>
        <div className={styles.visionCopy}>
          <h2 id="vision-title">
            Technology is better when people build it together.
          </h2>
          <p>
            Advait is a club for developers, researchers, and visionaries in AI &amp;
            modern tech. We bring curious people together to learn openly, share
            useful work, and make progress that lasts beyond a single project.
          </p>
          <div className={styles.visionHighlights}>
            <div className={styles.highlightPill}>
              <span className={styles.highlightDot} style={{ background: "#30d158" }} />
              Open Source First
            </div>
            <div className={styles.highlightPill}>
              <span className={styles.highlightDot} style={{ background: "#0a84ff" }} />
              Collective Research
            </div>
            <div className={styles.highlightPill}>
              <span className={styles.highlightDot} style={{ background: "#bf5af2" }} />
              Peer Reviewed
            </div>
          </div>
        </div>
      </section>

      {/* 02 / Leaderboard (Featured Card from sketch) */}
      <section
        id="leaderboard-section"
        className={`section ${styles.buildersSection}`}
        aria-labelledby="builders-title"
      >
        <div className={styles.buildersCard}>
          <div className={styles.buildersCardHeader}>
            <span className="eyebrow accent-cyan">02 / Leaderboard</span>
            <h2 id="builders-title" className={styles.buildersTitle}>
              Leaderboard
            </h2>
            <p className={styles.buildersDesc}>
              Most recent open source contributions, by devs
            </p>
          </div>

          <div className={styles.buildersPreviewList}>
            <div className={styles.builderPreviewRow}>
              <div className={styles.builderPreviewLeft}>
                <span className={styles.builderRank}>#01</span>
                <div>
                  <span className={styles.builderName}>Devin Reyes</span>
                  <p className={styles.builderPr}>↳ Added distributed node consensus in AetherSwarm</p>
                </div>
              </div>
              <span className={styles.builderPoints}>3,840 pts</span>
            </div>

            <div className={styles.builderPreviewRow}>
              <div className={styles.builderPreviewLeft}>
                <span className={styles.builderRank}>#02</span>
                <div>
                  <span className={styles.builderName}>Lyra Chen</span>
                  <p className={styles.builderPr}>↳ Optimized Gaussian splatting shader pipeline for WebGPU</p>
                </div>
              </div>
              <span className={styles.builderPoints}>3,120 pts</span>
            </div>

            <div className={styles.builderPreviewRow}>
              <div className={styles.builderPreviewLeft}>
                <span className={styles.builderRank}>#03</span>
                <div>
                  <span className={styles.builderName}>Siddharth Rao</span>
                  <p className={styles.builderPr}>↳ ZK-SNARK proof verifier circuit integration for ONNX</p>
                </div>
              </div>
              <span className={styles.builderPoints}>2,790 pts</span>
            </div>
          </div>

          <div className={styles.buildersCardFooter}>
            <Link href="/leaderboard" className={styles.visitLeaderboardsBtn}>
              Visit leaderboard →
            </Link>
          </div>
        </div>
      </section>

      {/* 03 / Upcoming Events & News */}
      <section
        id="events"
        className={`section ${styles.events}`}
        aria-labelledby="events-title"
      >
        <div className={styles.heading}>
          <div>
            <p className="eyebrow accent-ember">03 / Upcoming</p>
            <h2 id="events-title">Events &amp; gatherings</h2>
          </div>
          <span className="mono-muted">2026 calendar · Open salons</span>
        </div>
        <div className={styles.eventList}>
          {events.map(([day, date, title, type]) => (
            <article className={styles.event} key={title}>
              <time>
                <strong>{day}</strong>
                {date}
              </time>
              <div>
                <p className="card-label">{type}</p>
                <h3>{title}</h3>
                <p>
                  A focused space for deep conversation, making, and meeting other
                  members of the collective.
                </p>
              </div>
              <Link href="/events" className="text-link">
                Details →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 04 / Contact */}
      <section
        id="contact-section"
        className={`section ${styles.contact}`}
        aria-labelledby="contact-title"
      >
        <div className={styles.contactContent}>
          <p className="eyebrow accent-violet">04 / Connect</p>
          <h2 id="contact-title">Have something to share?</h2>
          <p>
            We would love to hear what you are building, researching, or thinking
            about. Reach out to the collective or join our open network.
          </p>
          <div className={styles.contactActions}>
            <a className="button button-light" href="mailto:hello@advait.collective">
              hello@advait.collective <span>↗</span>
            </a>
            <Link className="button button-outline" href="/login">
              Member Sign in →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
