"use client";

import { useEffect, useState } from "react";
import { StencilGlyph } from "./AdvaitGlyphs";
import styles from "./AdvaitIntro.module.css";

interface AdvaitIntroProps {
  onComplete?: () => void;
}

export function AdvaitIntro({ onComplete }: AdvaitIntroProps) {
  const [filled, setFilled] = useState(false);
  const [assembled, setAssembled] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 00. Set body attribute to ensure navbar & hero text are hidden while intro plays
    document.body.setAttribute("data-intro-active", "true");

    // 01. Start color fill wipe immediately
    const t0 = setTimeout(() => {
      setFilled(true);
    }, 60);

    // 02. Glide dispersed glyphs into tight horizontal lockup
    const t1 = setTimeout(() => {
      setAssembled(true);
    }, 450);

    // 03. Once filled & assembled, smoothly scale & dissolve into background
    const t2 = setTimeout(() => {
      setIsZooming(true);
      document.body.removeAttribute("data-intro-active");
    }, 1350);

    // 04. Fade out overlay
    const t3 = setTimeout(() => {
      setIsExiting(true);
    }, 1850);

    // 05. Unmount overlay completely
    const t4 = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2250);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
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
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.overlay} ${isExiting ? styles.overlayExiting : ""}`}
      onClick={handleSkip}
      role="banner"
      aria-label="Advait kinetic stencil introduction"
    >
      {/* SVG Liquid Chromium, Rose Quartz & Electric Violet Gradient */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }} aria-hidden="true">
        <defs>
          <linearGradient id="advait-chroma-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fbcfe8" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="75%" stopColor="#c084fc" />
            <stop offset="90%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
      </svg>

      <div className={styles.stage}>
        {/* Kinetic Stencil Wordmark: Color Fill -> Horizontal Lockup -> Dissolve into Background */}
        <div
          className={`${styles.lettersRow} ${
            isZooming ? styles.lettersRowZooming : ""
          }`}
        >
          <div
            className={`${styles.glyphWrap} ${
              assembled ? styles.assembled : styles.spreadA1
            }`}
          >
            <StencilGlyph
              glyph="A"
              filled={filled}
              fillColor="url(#advait-chroma-grad)"
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
              filled={filled}
              fillColor="url(#advait-chroma-grad)"
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
              filled={filled}
              fillColor="url(#advait-chroma-grad)"
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
              filled={filled}
              fillColor="url(#advait-chroma-grad)"
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
              filled={filled}
              fillColor="url(#advait-chroma-grad)"
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
              filled={filled}
              fillColor="url(#advait-chroma-grad)"
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
              filled={filled}
              fillColor="url(#advait-chroma-grad)"
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
