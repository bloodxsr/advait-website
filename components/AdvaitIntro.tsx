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
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // 01. Phase 1: Color filling animation from bottom (0%) to top (100%)
    // Starting with 15% ghost outline, wiping up solid black over 1.4s (matching CRL shader)
    const startTime = performance.now() + 150;
    const fillDuration = 1350;

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
        // 02. Phase 2: Once filled, smoothly glide inwards to lock into ADVAIT.
        setTimeout(() => {
          setAssembled(true);
        }, 120);
      }
    };

    animFrameRef.current = requestAnimationFrame(stepFill);

    // 03. Phase 3: Transition out after letters have locked in
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2800);

    // 04. Phase 4: Unmount overlay
    const doneTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 3400);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  // Click anywhere to skip
  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 300);
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
        {/* Kinetic Stencil Wordmark with vertical color fill and horizontal glide */}
        <div className={styles.lettersRow}>
          <div
            className={`${styles.glyphWrap} ${
              assembled ? styles.assembled : styles.spreadA1
            }`}
          >
            <StencilGlyph
              glyph="A"
              fillProgress={fillProgress}
              className={styles.glyphSvg}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              assembled ? styles.assembled : styles.spreadD
            }`}
          >
            <StencilGlyph
              glyph="D"
              fillProgress={fillProgress}
              className={styles.glyphSvg}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              assembled ? styles.assembled : styles.spreadV
            }`}
          >
            <StencilGlyph
              glyph="V"
              fillProgress={fillProgress}
              className={styles.glyphSvg}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              assembled ? styles.assembled : styles.spreadA2
            }`}
          >
            <StencilGlyph
              glyph="A"
              fillProgress={fillProgress}
              className={styles.glyphSvg}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              assembled ? styles.assembled : styles.spreadI
            }`}
          >
            <StencilGlyph
              glyph="I"
              fillProgress={fillProgress}
              className={styles.glyphSvgI}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              assembled ? styles.assembled : styles.spreadT
            }`}
          >
            <StencilGlyph
              glyph="T"
              fillProgress={fillProgress}
              className={styles.glyphSvg}
            />
          </div>

          <div
            className={`${styles.glyphWrap} ${
              assembled ? styles.assembled : styles.spreadDot
            }`}
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
