import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.overlay} role="status" aria-label="Loading Advait Route">
      <div className={styles.card}>
        <div className={styles.topRow}>
          <span className={styles.indexTag}>[SYS / ROUTE LOADER]</span>
          <span className={styles.metaTag}>2026 CYCLE · RUNTIME V.01</span>
        </div>

        <div className={styles.brandRow}>
          <div className={styles.brandTitle}>ADVAIT®</div>
          <div className={styles.versionBadge}>/V.01</div>
        </div>

        {/* Animated Sweep Track */}
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} />
        </div>

        {/* Telemetry Logs */}
        <div className={styles.telemetryList}>
          <div className={styles.logLine}>
            <span className={styles.dotPulse} />
            <span>DISPATCHING COMPILED ARTIFACTS &amp; SYLLABI...</span>
          </div>
          <div className={styles.logLine}>
            <span className={styles.dotPulse} />
            <span>INITIALIZING SWISS BRUTALIST GRID LAYOUT</span>
          </div>
        </div>

        <div className={styles.footerNote}>
          <span>BUFFER: ZERO-COPY STREAM</span>
          <span>LATENCY: &lt;1MS</span>
        </div>
      </div>
    </div>
  );
}

