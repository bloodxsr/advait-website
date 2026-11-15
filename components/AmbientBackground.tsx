"use client";

import { useEffect, useRef } from "react";
import styles from "./AmbientBackground.module.css";

export function AmbientBackground() {
  const gridRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    let targetScrollY = 0;
    let currentScrollY = 0;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const loop = (time: number) => {
      // Smooth interpolation for subtle parallax depth
      currentScrollY += (targetScrollY - currentScrollY) * 0.1;

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

      // Very subtle ambient top glow drift
      if (glowRef.current) {
        const tSec = time * 0.001;
        const subtleGlowOffset = Math.sin(tSec * 0.3) * 15;
        const scrollFade = Math.max(0, 1 - currentScrollY / 900);
        glowRef.current.style.transform = `translate3d(calc(-50% + ${subtleGlowOffset}px), 0, 0)`;
        glowRef.current.style.opacity = `${0.65 * scrollFade}`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      {/* Deep Black Canvas Base */}
      <div className={styles.baseCanvas} />

      {/* Subtle Top Ambient Spotlight (Monochrome / Celestial) */}
      <div ref={glowRef} className={styles.topSpotlight} />

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
