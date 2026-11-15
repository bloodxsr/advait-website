"use client";

import { useEffect, useState } from "react";
import styles from "./LandingColorFlow.module.css";

type SectionColor = "hero" | "vision" | "events" | "contact";

export function LandingColorFlow() {
  const [activeSection, setActiveSection] = useState<SectionColor>("hero");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = Math.max(
            document.documentElement.scrollHeight - window.innerHeight,
            1
          );
          setScrollProgress(Math.min(1, Math.max(0, scrollY / maxScroll)));

          // Check section positions
          const visionEl = document.getElementById("vision-section");
          const eventsEl = document.getElementById("events");
          const contactEl = document.getElementById("contact-section");

          const vTop = visionEl ? visionEl.getBoundingClientRect().top : 9999;
          const eTop = eventsEl ? eventsEl.getBoundingClientRect().top : 9999;
          const cTop = contactEl ? contactEl.getBoundingClientRect().top : 9999;

          const threshold = window.innerHeight * 0.45;

          if (cTop <= threshold) {
            setActiveSection("contact");
          } else if (eTop <= threshold) {
            setActiveSection("events");
          } else if (vTop <= threshold) {
            setActiveSection("vision");
          } else {
            setActiveSection("hero");
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={styles.flowContainer} aria-hidden="true">
      {/* SECTION 1: HERO — Deep Oceanic Electric Blue & Celestial Indigo current */}
      <div
        className={`${styles.liquidWave} ${styles.waveHero} ${
          activeSection === "hero" ? styles.waveActive : styles.waveExiting
        }`}
      >
        <div className={styles.waterMeshHero} />
        <div className={styles.waterRipple1} />
        <div className={styles.waterSheen} />
      </div>

      {/* SECTION 2: VISION — Aurora Emerald & Bioluminescent Teal current */}
      <div
        className={`${styles.liquidWave} ${styles.waveVision} ${
          activeSection === "vision" ? styles.waveActive : styles.waveExiting
        }`}
      >
        <div className={styles.waterMeshVision} />
        <div className={styles.waterRipple2} />
        <div className={styles.waterSheen} />
      </div>

      {/* SECTION 3: EVENTS — Warm Amber Flame & Sunset Coral current */}
      <div
        className={`${styles.liquidWave} ${styles.waveEvents} ${
          activeSection === "events" ? styles.waveActive : styles.waveExiting
        }`}
      >
        <div className={styles.waterMeshEvents} />
        <div className={styles.waterRipple3} />
        <div className={styles.waterSheen} />
      </div>

      {/* SECTION 4: CONTACT — Royal Electric Violet & Cyber Neon Cyan current */}
      <div
        className={`${styles.liquidWave} ${styles.waveContact} ${
          activeSection === "contact" ? styles.waveActive : styles.waveExiting
        }`}
      >
        <div className={styles.waterMeshContact} />
        <div className={styles.waterRipple4} />
        <div className={styles.waterSheen} />
      </div>

      {/* Ambient water depth mist layer */}
      <div
        className={styles.ambientWaterDepth}
        style={{
          opacity: 0.25 + scrollProgress * 0.15,
        }}
      />
    </div>
  );
}

