"use client";

import { useEffect, useState } from "react";
import styles from "./CountdownTimer.module.css";

interface CountdownTimerProps {
  targetDate: string | Date;
  variant?: "hero" | "badge" | "preview";
  label?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isUpcoming: boolean;
  isLive: boolean;
  isConcluded: boolean;
}

function calculateTimeRemaining(targetDate: string | Date): TimeRemaining {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = target - now;

  // If target within next or happened in past 4 hours, consider it live
  const fourHoursMs = 4 * 60 * 60 * 1000;

  if (diff <= 0) {
    if (Math.abs(diff) <= fourHoursMs) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isUpcoming: false, isLive: true, isConcluded: false };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isUpcoming: false, isLive: false, isConcluded: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isUpcoming: true, isLive: false, isConcluded: false };
}

export function CountdownTimer({ targetDate, variant = "badge", label }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<TimeRemaining>(() => calculateTimeRemaining(targetDate));

  useEffect(() => {
    setMounted(true);
    const update = () => setTime(calculateTimeRemaining(targetDate));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    // Avoid hydration mismatch by rendering a static placeholder
    return null;
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  // Variant: COMPACT BADGE (used on event cards)
  if (variant === "badge") {
    if (time.isLive) {
      return (
        <span className={styles.badgeLive}>
          <span className={styles.liveDot} style={{ width: 6, height: 6 }} />
          LIVE NOW
        </span>
      );
    }
    if (time.isConcluded) {
      return <span className={styles.badgeClock}>CONCLUDED</span>;
    }
    return (
      <span className={styles.badgeClock} title={`Starts in ${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`}>
        T-{time.days > 0 ? `${time.days}D ` : ""}{pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
      </span>
    );
  }

  // Variant: HERO / PREVIEW
  return (
    <div className={variant === "preview" ? styles.previewWidget : undefined}>
      {variant === "preview" && (
        <div className={styles.previewHeader}>
          <span className={styles.previewTitle}>LIVE COUNTDOWN PREVIEW</span>
          <span className={styles.previewTag}>
            {time.isUpcoming
              ? `T-MINUS ${time.days} DAYS`
              : time.isLive
              ? "SESSION ACTIVE"
              : "ARCHIVED"}
          </span>
        </div>
      )}

      {time.isLive ? (
        <div className={styles.liveStatus}>
          <span className={styles.liveDot} />
          <span>● GATHERING CURRENTLY IN SESSION / LIVE STAGE ACTIVE</span>
        </div>
      ) : time.isConcluded ? (
        <div className={styles.concludedStatus}>
          <span>○ SALON CONCLUDED · ARCHIVED PROCEEDINGS</span>
        </div>
      ) : (
        <div className={styles.heroClock}>
          <div className={styles.digitBox}>
            <span className={styles.digitVal}>{pad(time.days)}</span>
            <span className={styles.digitUnit}>DAYS</span>
          </div>
          <span className={styles.colon}>:</span>
          <div className={styles.digitBox}>
            <span className={styles.digitVal}>{pad(time.hours)}</span>
            <span className={styles.digitUnit}>HOURS</span>
          </div>
          <span className={styles.colon}>:</span>
          <div className={styles.digitBox}>
            <span className={styles.digitVal}>{pad(time.minutes)}</span>
            <span className={styles.digitUnit}>MINS</span>
          </div>
          <span className={styles.colon}>:</span>
          <div className={styles.digitBox}>
            <span className={styles.digitVal}>{pad(time.seconds)}</span>
            <span className={styles.digitUnit}>SECS</span>
          </div>
        </div>
      )}
    </div>
  );
}
