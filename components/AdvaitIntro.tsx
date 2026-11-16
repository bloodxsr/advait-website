"use client";

import { useEffect, useState, useRef } from "react";
import { StencilGlyph } from "./AdvaitGlyphs";
import styles from "./AdvaitIntro.module.css";

interface AdvaitIntroProps {
  onComplete?: () => void;
}

export function AdvaitIntro({ onComplete }: AdvaitIntroProps) {
  const [fillProgress, setFillProgress] = useState(0);
  const [assembled, setAssembled] = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // 00. Set body attribute to ensure navbar is 100% hidden during preloader
    document.body.setAttribute("data-intro-active", "true");

    // 01. Phase 1: Color filling animation from bottom (0%) to top (100%)
    const startTime = performance.now() + 150;
    const fillDuration = 1300;

    const stepFill = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        animFrameRef.current = requestAnimationFrame(stepFill);
        return;
      }
      const progress = Math.min(1, elapsed / fillDuration);
      setFillProgress(progress);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(stepFill);
      } else {
        // 02. Phase 2: Once filled, glide inward into tight horizontal lockup ADVAIT.
        setTimeout(() => {
          setAssembled(true);
        }, 100);

        // 03. Phase 3: Turn orientation from horizontal alignment to vertical alignment
        setTimeout(() => {
          setIsVertical(true);
        }, 1200);

        // 04. Phase 4: Smooth transition out into the background vertical marquee
        setTimeout(() => {
          setIsExiting(true);
          document.body.removeAttribute("data-intro-active");
        }, 2200);

        // 05. Phase 5: Unmount intro overlay
        setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, 2850);
      }
    };

    animFrameRef.current = requestAnimationFrame(stepFill);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      document.body.removeAttribute("data-intro-active");
    };
  }, [onComplete]);

  // Click anywhere to skip intro immediately
  const handleSkip = () => {
    document.body.removeAttribute("data-intro-active");
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 250);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.overlay} ${isExiting ? styles.overlayExiting : ""}`}
      onClick={handleSkip}
      role="banner"
      aria-label="Advait kinetic stencil introduction"
    >
      <div className={styles.stage}>
        {/* Kinetic Stencil Wordmark: Color Fill -> Horizontal Lockup -> Turn to Vertical Alignment */}
        <div className={styles.lettersRow}>
          <div
            className={`${styles.glyphWrap} ${
              isVertical
                ? styles.verticalA1
                : assembled
                ? styles.assembled
                : styles.spreadA1
            } ${isVertical ? styles.verticalBlack : ""}`}
          >
            <StencilGlyph
              glyph="A"
              fillProgress={fillProgress}
              className={styles.glyphSvg}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              isVertical
                ? styles.verticalD
                : assembled
                ? styles.assembled
                : styles.spreadD
            } ${isVertical ? styles.verticalBlack : ""}`}
          >
            <StencilGlyph
              glyph="D"
              fillProgress={fillProgress}
              className={styles.glyphSvg}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              isVertical
                ? styles.verticalV
                : assembled
                ? styles.assembled
                : styles.spreadV
            } ${isVertical ? styles.verticalBlack : ""}`}
          >
            <StencilGlyph
              glyph="V"
              fillProgress={fillProgress}
              className={styles.glyphSvg}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              isVertical
                ? styles.verticalA2
                : assembled
                ? styles.assembled
                : styles.spreadA2
            } ${isVertical ? styles.verticalBlack : ""}`}
          >
            <StencilGlyph
              glyph="A"
              fillProgress={fillProgress}
              className={styles.glyphSvg}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              isVertical
                ? styles.verticalI
                : assembled
                ? styles.assembled
                : styles.spreadI
            } ${isVertical ? styles.verticalBlack : ""}`}
          >
            <StencilGlyph
              glyph="I"
              fillProgress={fillProgress}
              className={styles.glyphSvgI}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              isVertical
                ? styles.verticalT
                : assembled
                ? styles.assembled
                : styles.spreadT
            } ${isVertical ? styles.verticalBlack : ""}`}
          >
            <StencilGlyph
              glyph="T"
              fillProgress={fillProgress}
              className={styles.glyphSvg}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              isVertical
                ? styles.verticalDot
                : assembled
                ? styles.assembled
                : styles.spreadDot
            } ${isVertical ? styles.verticalBlack : ""}`}
          >
            <StencilGlyph
              glyph="Dot"
              fillProgress={fillProgress}
              className={styles.glyphSvgDot}
            />
          </div>
        </div>

        {/* Minimal Bottom Label */}
        <div className={styles.metaBottom}>
          <span>Association of Developers &amp; Visionaries</span>
          <span className={styles.skipHint}>Click anywhere to enter →</span>
        </div>
      </div>
    </div>
  );
}
