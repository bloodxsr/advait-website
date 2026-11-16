"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AdvaitWordmark, GLYPH_PATHS, GLYPH_VIEWBOX } from "./AdvaitGlyphs";
import styles from "./ArchitecturalHero.module.css";

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
      {/* ── Monumental Giant Stencil Background Typography (from CRL video) ── */}
      <div
        className={styles.monumentalLayer}
        style={{
          transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -10}px, 0)`,
        }}
      >
        <div className={styles.giantLetterTrack}>
          <div className={styles.giantLetterWrap}>
            <svg viewBox={GLYPH_VIEWBOX.A} className={styles.giantLetterSvg}>
              <path d={GLYPH_PATHS.A} />
            </svg>
          </div>
          <div className={styles.giantLetterWrap}>
            <svg viewBox={GLYPH_VIEWBOX.D} className={styles.giantLetterSvg}>
              <path d={GLYPH_PATHS.D} />
            </svg>
          </div>
          <div className={styles.giantLetterWrap}>
            <svg viewBox={GLYPH_VIEWBOX.V} className={styles.giantLetterSvg}>
              <path d={GLYPH_PATHS.V} />
            </svg>
          </div>
          <div className={styles.giantLetterWrap}>
            <svg viewBox={GLYPH_VIEWBOX.A} className={styles.giantLetterSvg}>
              <path d={GLYPH_PATHS.A} />
            </svg>
          </div>
          <div className={styles.giantLetterWrapI}>
            <svg viewBox={GLYPH_VIEWBOX.I} className={styles.giantLetterSvg}>
              <path d={GLYPH_PATHS.I} />
            </svg>
          </div>
          <div className={styles.giantLetterWrap}>
            <svg viewBox={GLYPH_VIEWBOX.T} className={styles.giantLetterSvg}>
              <path d={GLYPH_PATHS.T} />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Foreground Swiss Editorial Grid ───────────────────────────────── */}
      <div className={styles.editorialGrid}>
        {/* Top Row: Identity & Primary Manifesto */}
        <div className={styles.topRow}>
          <div className={styles.identityBlock}>
            <div className={styles.brandRow}>
              <AdvaitWordmark height={26} />
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

        {/* Middle Typographic Banner (Iconic Stencil Brand, /V.01 & (2026)) ─── */}
        <div className={styles.middleBanner}>
          <div className={styles.midBrandWrap}>
            <AdvaitWordmark height="clamp(38px, 6.2vw, 84px)" />
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
