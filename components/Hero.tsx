import Link from "next/link";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.tagPill}>
          <span className={styles.liveDot} />
          <span>Independent Technology Collective</span>
        </div>

        <h1 className={styles.title}>ADVAIT</h1>

        <p className={styles.subtitle}>
          A collective for builders, researchers, and visionaries in AI &amp; systems.
          Building open, thoughtful technology that outlasts the moment.
        </p>

        <div className={styles.actions}>
          <Link className="button button-light" href="/projects">
            Explore Ecosystem <span>↓</span>
          </Link>
          <Link className="button button-outline" href="/login">
            Join the Collective →
          </Link>
        </div>

        {/* Quick highlight stream tags */}
        <div className={styles.streamPills}>
          <span className={styles.streamTag}>⚡ Distributed AI</span>
          <span className={styles.dotSep}>·</span>
          <span className={styles.streamTag}>🛡️ ZK Research</span>
          <span className={styles.dotSep}>·</span>
          <span className={styles.streamTag}>🌐 Open Systems</span>
          <span className={styles.dotSep}>·</span>
          <span className={styles.streamTag}>🧠 Neural Graphics</span>
        </div>
      </div>

      <a className={styles.cue} href="#vision-section" aria-label="Scroll to vision">
        <span>Scroll to Explore</span>
        <span className={styles.cueArrow}>↓</span>
      </a>
    </section>
  );
}
