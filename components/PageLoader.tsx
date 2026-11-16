"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./PageLoader.module.css";

const ROUTE_DIRECTORY: Record<
  string,
  { num: string; title: string; tag: string }
> = {
  "/projects": {
    num: "01",
    title: "OPEN SOURCE SYSTEMS",
    tag: "ARTIFACTS REGISTRY",
  },
  "/hall-of-builders": {
    num: "02",
    title: "HALL OF BUILDERS",
    tag: "MERITOCRACY LEADERBOARD",
  },
  "/leaderboard": {
    num: "02",
    title: "HALL OF BUILDERS",
    tag: "MERITOCRACY LEADERBOARD",
  },
  "/team": {
    num: "03",
    title: "STEWARDSHIP & ROSTER",
    tag: "WORKING DIVISIONS",
  },
  "/hall-of-flames": {
    num: "04",
    title: "HALL OF FLAMES",
    tag: "SELECTED WORK ARCHIVE",
  },
  "/events": {
    num: "05",
    title: "ADVAIT'S SOCIAL",
    tag: "SALONS, GATHERINGS & NETWORK",
  },
  "/resources": {
    num: "06",
    title: "RESEARCH VAULT",
    tag: "EDUCATIONAL SYLLABI",
  },
  "/login": {
    num: "AUTH",
    title: "AUTHENTICATION GATEWAY",
    tag: "SIGN IN & JOIN",
  },
  "/dashboard": {
    num: "USER",
    title: "MEMBER DASHBOARD",
    tag: "PERSONAL ENVIRONMENT",
  },
  "/admin": {
    num: "ADMIN",
    title: "ADMINISTRATIVE PORTAL",
    tag: "SYSTEM CONTROL",
  },
  "/": {
    num: "00",
    title: "ADVAIT PLATFORM",
    tag: "ARCHITECTURAL HERO",
  },
};

export function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetRoute, setTargetRoute] = useState(pathname);
  const isInitialMount = useRef(true);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Skip on cold initial page load (landing page uses AdvaitIntro)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathname.current = pathname;
      return;
    }

    // Only fire when navigating between pages
    if (prevPathname.current === pathname) {
      return;
    }
    prevPathname.current = pathname;

    // Snappy between-pages route transition (390ms total)
    setTargetRoute(pathname);
    setLoading(true);
    setIsExiting(false);
    setProgress(25);

    const t1 = setTimeout(() => {
      setProgress(65);
    }, 50);

    const t2 = setTimeout(() => {
      setProgress(90);
    }, 120);

    const t3 = setTimeout(() => {
      setProgress(100);
    }, 190);

    // Smooth exit dissolve
    const t4 = setTimeout(() => {
      setIsExiting(true);
    }, 270);

    // Unmount and cleanly hand off to destination page
    const t5 = setTimeout(() => {
      setLoading(false);
      setIsExiting(false);
      setProgress(0);
    }, 390);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [pathname]);

  if (!loading) return null;

  const isDarkPage = targetRoute.startsWith("/events");
  const routeMeta =
    ROUTE_DIRECTORY[targetRoute] || {
      num: "DIR",
      title: targetRoute.replace(/^\//, "").toUpperCase(),
      tag: "COLLECTIVE ROUTE",
    };

  return (
    <div
      className={`${styles.overlay} ${isDarkPage ? styles.overlayDark : ""
        } ${isExiting ? styles.overlayExiting : ""}`}
      role="status"
      aria-label="Transitioning between Advait pages"
    >
      <div className={styles.card}>
        {/* Top Status Header */}
        <div className={styles.topRow}>
          <span className={styles.indexTag}>
            [SYS / ROUTE PRELOADER]
          </span>
          <span className={styles.metaTag}>2026 CYCLE · RUNTIME V.01</span>
        </div>

        {/* Brand Row */}
        <div className={styles.brandRow}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/advait-logo.png"
            alt="ADVAIT"
            className={styles.loaderLogoImg}
            decoding="async"
          />
          <div className={styles.versionBadge}>/V.01</div>
        </div>

        {/* Target Destination Block */}
        <div className={styles.targetBlock}>
          <span className={styles.targetTag}>
            [{routeMeta.num}] {routeMeta.tag}
          </span>
          <h2 className={styles.targetHeading}>{routeMeta.title}</h2>
        </div>

        {/* Progress Track */}
        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={styles.progressMeta}>
            <span>DISPATCHING COMPILED ARTIFACTS</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Telemetry Footer */}
        <div className={styles.telemetryList}>
          <div>
            <span className={styles.dotPulse} />
            <span>BUFFER: ZERO-COPY DISPATCH</span>
          </div>
          <span>LATENCY: &lt;1MS</span>
        </div>
      </div>
    </div>
  );
}
