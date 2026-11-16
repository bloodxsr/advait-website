"use client";

import { useEffect, useRef } from "react";
import styles from "./AmbientBackground.module.css";

export function AmbientBackground() {
  const gridRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number | null = null;
    let targetScrollY = 0;
    let currentScrollY = 0;
    let isTicking = false;

    const render = () => {
      // Smooth interpolation for subtle parallax depth
      const diff = targetScrollY - currentScrollY;
      currentScrollY += diff * 0.12;

      // Subtle parallax on the technical grid (moves at 0.15x speed)
      if (gridRef.current) {
        const gridOffset = (currentScrollY * 0.15) % 64;
        gridRef.current.style.transform = `translate3d(0, ${-gridOffset}px, 0)`;
      }

      // Parallax on the star dust layer (moves at 0.08x speed)
      if (starsRef.current) {
        const starOffset = (currentScrollY * 0.08) % 40;
        starsRef.current.style.transform = `translate3d(0, ${-starOffset}px, 0)`;
      }

      // If still interpolating, keep ticking. Otherwise sleep to save CPU.
      if (Math.abs(diff) > 0.3) {
        animId = requestAnimationFrame(render);
      } else {
        isTicking = false;
        animId = null;
      }
    };

    const onScroll = () => {
      targetScrollY = window.scrollY;
      if (!isTicking) {
        isTicking = true;
        animId = requestAnimationFrame(render);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial render
    onScroll();

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      {/* Deep Obsidian Canvas Base */}
      <div className={styles.baseCanvas} />

      {/* Subtle Top Ambient Spotlight (Monochrome / Celestial) */}
      <div className={styles.topSpotlight} />

      {/* Subtle Horizon Line Beam */}
      <div className={styles.horizonBeam} />

      {/* Precision Technical Grid Layer with Radial Mask */}
      <div className={styles.gridMask}>
        <div ref={gridRef} className={styles.gridPattern} />
      </div>

      {/* Crisp Stardust Matrix */}
      <div ref={starsRef} className={styles.starsPattern} />

      {/* Deep Perimeter Vignette */}
      <div className={styles.vignette} />
    </div>
  );
}
