"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./PageLoader.module.css";

export function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeRoute, setActiveRoute] = useState("");
  const prevPathnameRef = useRef(pathname);
  const isDarkPage = pathname.startsWith("/events");

  useEffect(() => {
    // Only trigger transition if the route actually changed
    if (prevPathnameRef.current === pathname) {
      return;
    }
    prevPathnameRef.current = pathname;

    // Trigger architectural transition animation
    setLoading(true);
    setActiveRoute(pathname);
    setProgress(25);

    const t1 = setTimeout(() => {
      setProgress(75);
    }, 120);

    const t2 = setTimeout(() => {
      setProgress(100);
    }, 280);

    const t3 = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 520);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  if (!loading) return null;

  const routeLabel =
    activeRoute === "/"
      ? "LANDING / HERO"
      : activeRoute.replace(/^\//, "").toUpperCase();

  return (
    <>
      {/* ── Top Progress Line ─────────────────────────────────────────────── */}
      <div className={styles.topLine} role="progressbar" aria-valuenow={progress}>
        <div
          className={isDarkPage ? styles.topBarDark : styles.topBar}
          style={{
            width: `${progress}%`,
            opacity: progress === 100 ? 0 : 1,
          }}
        />
      </div>

      {/* ── Corner Telemetry HUD Badge ────────────────────────────────────── */}
      <div className={`${styles.hudBadge} ${isDarkPage ? styles.hudBadgeDark : ""}`}>
        <span className={styles.hudPulse} />
        <span className={styles.hudSpinner} />
        <span>[DISPATCH: {routeLabel}]</span>
      </div>
    </>
  );
}
