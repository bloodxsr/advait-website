"use client";

import { useEffect, useRef, useState } from "react";
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMousePos({ x, y });
    };

    const heroEl = heroRef.current;
    heroEl?.addEventListener("mousemove", handleMouseMove);
    return () => heroEl?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToContent = () => {
    const target = document.getElementById("manifesto");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={heroRef} className={styles.hero} aria-label="Advait Platform Hero">
      {/* ── Vertical Scrolling Marquee with Repetition (from CRL reference) ── */}
      <div
        className={styles.monumentalLayer}
        style={{
          transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -8}px, 0)`,
        }}
      >
        <div className={styles.marqueeTrack}>
          {/* Group 1 */}
          <div className={styles.marqueeGroup}>
            {SET_ITEMS.map((item) => (
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
                  <path d={GLYPH_PATHS[item.glyph]} />
                </svg>
              </div>
            ))}
          </div>

          {/* Group 2 (100% pixel-identical copy for seamless continuous infinite loop) */}
          <div className={styles.marqueeGroup} aria-hidden="true">
            {SET_ITEMS.map((item) => (
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
                  <path d={GLYPH_PATHS[item.glyph]} />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Foreground Swiss Editorial Grid ───────────────────────────────── */}
      <div className={styles.editorialGrid}>
        {/* Top Row: Identity & Primary Manifesto */}
        <div className={styles.topRow}>
          <div className={styles.identityBlock}>
            <div className={styles.brandRow}>
              <span className={styles.brandTitle}>ADVAIT</span>
              <span className={styles.registered}>®</span>
            </div>
            <p className={styles.brandDesc}>
              Association of Developers and Visionaries in AI &amp; Tech. An
              independent collective building open architectures, autonomous
              systems, and enduring research.
            </p>
          </div>

          <div className={styles.manifestoText}>
            <span className={styles.sectionIndexNum}>{`{1}`}</span>
            ADVAIT® is an independent collective of developers and visionaries in
            AI &amp; Tech, built from work that has proven its value through
            continued execution. Spanning multiple divisions — RED (Research &amp;
            Engineering), OPS (Outreach &amp; Sponsorships), EVED (Events &amp;
            Ventures), Creatives, and GameVeda — the collective reflects a
            disciplined approach to building: selected for longevity and craft over
            volume or trend.
          </div>
        </div>

        {/* Middle Typographic Banner (Iconic ADVAIT ®, /V.01 & (2026)) ──────── */}
        <div className={styles.middleBanner}>
          <div className={styles.midBrandWrap}>
            <span className={styles.midBrand}>ADVAIT</span>
            <span className={styles.midRegistered}>®</span>
          </div>
          <div className={styles.midVersion}>/V.01</div>
          <div className={styles.midYear}>(2026)</div>
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
            <Link href="/leaderboard" className={styles.dirItem}>
              <span className={styles.dirNum}>[3]</span> Contributor dev leaderboard ↗
            </Link>
            <Link href="/events" className={styles.dirItem}>
              <span className={styles.dirNum}>[4]</span> Salons, workshops &amp; events ↗
            </Link>
            <Link href="/team" className={styles.dirItem}>
              <span className={styles.dirNum}>[5]</span> Collective working groups ↗
            </Link>
            <Link href="/hall-of-flames" className={styles.dirItem}>
              <span className={styles.dirNum}>[6]</span> Hall of flames selected work ↗
            </Link>
          </nav>

          {/* Center Column: Scope Description */}
          <p className={styles.scopeText}>
            <span className={styles.sectionIndexNum}>{`{2}`}</span>
            The collective spans a range of outputs, from autonomous multi-agent
            orchestration (AetherSwarm Engine) to client-side neural radiance
            renderers (LatentMesh) and ZK-SNARK compile-time verifiers. Together,
            these artifacts form an open technical foundation for builders working
            across modern computing.
          </p>

          {/* Right Column: Status & Scroll */}
          <div className={styles.statusCol}>
            <span>DIR / 2026</span>
            <span>AUTONOMOUS SYSTEMS</span>
            <span onClick={scrollToContent} className={styles.scrollHint}>
              Scroll to explore ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
