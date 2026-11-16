"use client";

import Link from "next/link";
import { GLYPH_PATHS, GLYPH_VIEWBOX } from "./AdvaitGlyphs";
import styles from "./ArchitecturalHero.module.css";

// 6 glyphs ordered so that downward motion reveals them as: A -> D -> V -> A -> I -> T
const SET_ITEMS: Array<{ id: string; glyph: "A" | "D" | "V" | "I" | "T" }> = [
  { id: "t", glyph: "T" },
  { id: "i", glyph: "I" },
  { id: "a2", glyph: "A" },
  { id: "v", glyph: "V" },
  { id: "d", glyph: "D" },
  { id: "a1", glyph: "A" },
];

export function ArchitecturalHero() {
  const scrollToContent = () => {
    const target = document.getElementById("manifesto");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.hero} aria-label="Advait Platform Hero">
      {/* ── Vertical Scrolling Marquee with Repetition (from CRL reference) ── */}
      <div className={styles.monumentalLayer}>
        <div className={styles.marqueeTrack}>
          {/* Group 1 */}
          <div className={styles.marqueeGroup}>
            {SET_ITEMS.map((item) => {
              const fillId = `g1-fill-${item.id}`;
              return (
                <div
                  key={`g1-${item.id}`}
                  className={
                    item.glyph === "I"
                      ? styles.marqueeLetterI
                      : styles.marqueeLetter
                  }
                >
                  <svg
                    viewBox={GLYPH_VIEWBOX[item.glyph]}
                    className={styles.marqueeSvg}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id={fillId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
                        <stop offset="12%" stopColor="#e9d5ff" stopOpacity="0.90" />
                        <stop offset="28%" stopColor="#c084fc" stopOpacity="0.90" />
                        <stop offset="42%" stopColor="#f472b6" stopOpacity="0.88" />
                        <stop offset="58%" stopColor="#7c3aed" stopOpacity="0.90" />
                        <stop offset="72%" stopColor="#ffffff" stopOpacity="0.88" />
                        <stop offset="84%" stopColor="#a855f7" stopOpacity="0.88" />
                        <stop offset="94%" stopColor="#fbcfe8" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#18072e" stopOpacity="0.90" />
                      </linearGradient>
                    </defs>
                    <path
                      d={GLYPH_PATHS[item.glyph]}
                      fill={`url(#${fillId})`}
                      stroke="rgba(192, 132, 252, 0.3)"
                      strokeWidth="0.6"
                    />
                  </svg>
                </div>
              );
            })}
          </div>

          {/* Group 2 (100% pixel-identical copy for seamless continuous infinite loop) */}
          <div className={styles.marqueeGroup} aria-hidden="true">
            {SET_ITEMS.map((item) => {
              const fillId = `g2-fill-${item.id}`;
              return (
                <div
                  key={`g2-${item.id}`}
                  className={
                    item.glyph === "I"
                      ? styles.marqueeLetterI
                      : styles.marqueeLetter
                  }
                >
                  <svg
                    viewBox={GLYPH_VIEWBOX[item.glyph]}
                    className={styles.marqueeSvg}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id={fillId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
                        <stop offset="12%" stopColor="#e9d5ff" stopOpacity="0.90" />
                        <stop offset="28%" stopColor="#c084fc" stopOpacity="0.90" />
                        <stop offset="42%" stopColor="#f472b6" stopOpacity="0.88" />
                        <stop offset="58%" stopColor="#7c3aed" stopOpacity="0.90" />
                        <stop offset="72%" stopColor="#ffffff" stopOpacity="0.88" />
                        <stop offset="84%" stopColor="#a855f7" stopOpacity="0.88" />
                        <stop offset="94%" stopColor="#fbcfe8" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#18072e" stopOpacity="0.90" />
                      </linearGradient>
                    </defs>
                    <path
                      d={GLYPH_PATHS[item.glyph]}
                      fill={`url(#${fillId})`}
                      stroke="rgba(192, 132, 252, 0.3)"
                      strokeWidth="0.6"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Foreground Swiss Editorial Grid ───────────────────────────────── */}
      <div className={styles.editorialGrid}>
        {/* Middle Typographic Banner (Centered ADVAIT in Tiny5 Duo Text) ───── */}
        <div className={styles.middleBanner}>
          <div className={styles.midDuoWrap} aria-label="ADVAIT">
            <span className={styles.midDuoText}>
              <span className={styles.duoSilver}>AD</span>
              <span className={styles.duoPurple}>VAIT</span>
            </span>
          </div>
        </div>

        {/* Bottom Row: Directory Index & Artifacts Scope */}
        <div className={styles.bottomRow}>
          {/* Left Column: Direct Links Directory */}
          <nav className={styles.directoryList} aria-label="Quick directory">
            <Link href="/projects" className={styles.dirItem}>
              <span className={styles.dirNum}>[1]</span> Open source systems (Community) ↗
            </Link>
            <Link href="/resources" className={styles.dirItem}>
              <span className={styles.dirNum}>[2]</span> Research vault &amp; papers ↗
            </Link>
            <Link href="/hall-of-builders" className={styles.dirItem}>
              <span className={styles.dirNum}>[3]</span> Hall of builders (Leaderboard) ↗
            </Link>
            <Link href="/team" className={styles.dirItem}>
              <span className={styles.dirNum}>[4]</span> Stewardship &amp; team roster ↗
            </Link>
            <Link href="/events" className={styles.dirItem}>
              <span className={styles.dirNum}>[5]</span> Advait&apos;s social ↗
            </Link>
            <Link href="/hall-of-flames" className={styles.dirItem}>
              <span className={styles.dirNum}>[6]</span> Hall of flames selected work ↗
            </Link>
          </nav>

          {/* Center Column: Our Vision */}
          <p className={styles.scopeText}>
            <span className={styles.sectionIndexNum}>[OUR VISION]</span>
            The collective spans a range of outputs, from autonomous multi-agent
            orchestration (AetherSwarm Engine) to client-side neural radiance
            renderers (LatentMesh) and ZK-SNARK compile-time verifiers. Together,
            these artifacts form an open technical foundation for builders working
            across modern computing.
          </p>

          {/* Right Column: Social Redirects, Status & Scroll */}
          <div className={styles.statusCol}>
            <div className={styles.socialBlock}>
              <span className={styles.socialLabel}>[NETWORK / REDIRECTS]</span>
              <div className={styles.socialList}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                  title="Instagram"
                >
                  Instagram ↗
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                  title="GitHub"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                  title="X / Twitter"
                >
                  X / Twitter ↗
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                  title="Discord"
                >
                  Discord ↗
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialLink}
                  title="YouTube"
                >
                  YouTube ↗
                </a>
              </div>
            </div>

            <div className={styles.statusSub}>
              <span>DIR / COLLECTIVE</span>
              <span>AUTONOMOUS SYSTEMS</span>
              <span onClick={scrollToContent} className={styles.scrollHint}>
                Scroll to explore ↓
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
