"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer} role="contentinfo" aria-label="Advait Footer">
      <div className={styles.container}>
        {/* ── Top Architectural Brand Statement ───────────────────────────── */}
        <div className={styles.topSection}>
          <div className={styles.brandBlock}>
            <Link className={styles.brand} href="/" aria-label="Advait Home">
              <span>ADVAIT</span>
              <span className={styles.registered}>®</span>
            </Link>
            <p className={styles.brandDesc}>
              Association of Developers and Visionaries in AI &amp; Tech. An
              independent collective building open architectures, autonomous
              systems, and enduring research. Selected for craft over volume or trend.
            </p>
          </div>

          <div className={styles.inquiryBlock}>
            <span className={styles.inquiryLabel}>COMMUNICATIONS &amp; GRANTS DESK</span>
            <a
              className={styles.inquiryEmail}
              href="mailto:hello@advait.collective"
              title="Send email to Advait"
            >
              <span>hello@advait.collective</span>
              <span>↗</span>
            </a>
            <div className={styles.statusPill}>
              <span className={styles.statusDot} />
              <span>Advait Network · 2026 Season · Online v0.4.2</span>
            </div>
          </div>
        </div>

        {/* ── 2 Swiss Editorial Link Columns ──────────────────────────────── */}
        <div className={styles.columnsGrid}>
          {/* Column 01: Systems & Artifacts */}
          <div className={styles.column}>
            <div className={styles.colHeader}>
              <span className={styles.colNum}>[01]</span>
              <span>SYSTEMS &amp; REGISTRY</span>
            </div>
            <nav className={styles.linkList} aria-label="Systems links">
              <Link className={styles.navLink} href="/projects">
                <span>Our Projects</span>
                <span className={styles.linkArrow}>↗</span>
              </Link>
              <Link className={styles.navLink} href="/resources">
                <span>Research Vault &amp; Syllabi</span>
                <span className={styles.linkArrow}>↗</span>
              </Link>
              <Link className={styles.navLink} href="/hall-of-builders">
                <span>Hall of Builders (Leaderboard)</span>
                <span className={styles.linkArrow}>↗</span>
              </Link>
              <Link className={styles.navLink} href="/hall-of-flames">
                <span>Hall of Flames</span>
                <span className={styles.linkArrow}>↗</span>
              </Link>
              <Link className={styles.navLink} href="/team">
                <span>Stewardship &amp; Team Roster</span>
                <span className={styles.linkArrow}>↗</span>
              </Link>
              <Link className={styles.navLink} href="/dashboard">
                <span>Member Dashboard</span>
                <span className={styles.linkArrow}>↗</span>
              </Link>
            </nav>
          </div>

          {/* Column 02: Community & Access */}
          <div className={styles.column}>
            <div className={styles.colHeader}>
              <span className={styles.colNum}>[02]</span>
              <span>ACCESS &amp; NETWORK</span>
            </div>
            <nav className={styles.linkList} aria-label="Community links">
              <Link className={styles.navLink} href="/events">
                <span>Advait&apos;s Social</span>
                <span className={styles.linkArrow}>↗</span>
              </Link>
              <Link className={styles.navLink} href="/login?mode=signin">
                <span>Member Sign In</span>
                <span className={styles.linkArrow}>→</span>
              </Link>
              <Link className={styles.navLink} href="/login?mode=join">
                <span>Join Collective</span>
                <span className={styles.linkArrow}>→</span>
              </Link>
              <a
                className={styles.navLink}
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
              >
                <span>GitHub Collective</span>
                <span className={styles.linkArrow}>↗</span>
              </a>
              <a
                className={styles.navLink}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <span>Instagram Channel</span>
                <span className={styles.linkArrow}>↗</span>
              </a>
              <Link className={styles.navLink} href="/admin">
                <span>Admin Portal</span>
                <span className={styles.linkTag}>[Auth]</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* ── Bottom Bar ─────────────────────────────────────────────────── */}
        <div className={styles.bottomBar}>
          <div className={styles.legalInfo}>
            <span>ADVAIT COLLECTIVE © 2026 / V.01</span>
            <span className={styles.divider}>·</span>
            <span>ALL ARTIFACTS VERIFIED OPEN SOURCE</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className={styles.backToTop}
            aria-label="Scroll back to top of page"
          >
            <span>Scroll to top</span>
            <span>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
