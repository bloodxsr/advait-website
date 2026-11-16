"use client";

import { useEffect, useState } from "react";
import styles from "./AdvaitIntro.module.css";

interface AdvaitIntroProps {
  onComplete?: () => void;
}

export function AdvaitIntro({ onComplete }: AdvaitIntroProps) {
  const [assembled, setAssembled] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Phase 1: Trigger smooth slide-in towards center after brief initial render
    const assembleTimer = setTimeout(() => {
      setAssembled(true);
    }, 100);

    // Phase 2: Start exit transition after letters assemble and lock in
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1800);

    // Phase 3: Unmount overlay and trigger onComplete callback
    const doneTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2400);

    return () => {
      clearTimeout(assembleTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  // Allow clicking anywhere to skip intro immediately
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
      aria-label="Advait introduction animation"
    >
      <div className={styles.stage}>
        {/* Kinetic Assembling Wordmark */}
        <div className={styles.lettersRow}>
          <span
            className={`${styles.letter} ${
              assembled ? styles.assembled : styles.spreadA1
            }`}
          >
            A
          </span>
          <span
            className={`${styles.letter} ${
              assembled ? styles.assembled : styles.spreadD
            }`}
          >
            D
          </span>
          <span
            className={`${styles.letter} ${
              assembled ? styles.assembled : styles.spreadV
            }`}
          >
            V
          </span>
          <span
            className={`${styles.letter} ${
              assembled ? styles.assembled : styles.spreadA2
            }`}
          >
            A
          </span>
          <span
            className={`${styles.letter} ${
              assembled ? styles.assembled : styles.spreadI
            }`}
          >
            I
          </span>
          <span
            className={`${styles.letter} ${
              assembled ? styles.assembled : styles.spreadT
            }`}
          >
            T
          </span>
          <span
            className={`${styles.letter} ${styles.dot} ${
              assembled ? styles.assembled : styles.spreadDot
            }`}
          >
            .
          </span>
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

