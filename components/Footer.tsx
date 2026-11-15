"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

export function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("advait_session="));
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoggedIn) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {/* Brand & Mission Statement */}
        <div className={styles.brandCol}>
          <Link className={styles.brand} href="/">
            Advait
          </Link>
          <p className={styles.brandDesc}>
            Association of Developers and Visionaries in AI &amp; Tech. An independent collective building open architectures, research artifacts, and enduring technology.
          </p>

          <div className={styles.statusIndicator}>
            <span className={styles.statusDot} />
            <span>Advait Network · Online v0.4.2</span>
          </div>

          <a className={styles.contactEmail} href="mailto:hello@advait.collective">
            <span>Direct desk: hello@advait.collective</span>
            <span>↗</span>
          </a>
        </div>

        {/* Organized Navigation Columns */}
        <div className={styles.linkColumns}>
          {/* Column 1: Member-Only Artifacts & Club Features */}
          <div className={styles.column}>
            <span className={styles.colHeader}>Club Artifacts</span>

            <Link className={styles.navLink} href="/projects">
              <span>Our Projects</span>
            </Link>

            <Link className={styles.navLink} href="/hall-of-flames">
              <span>Hall of Flames</span>
            </Link>

            <Link className={styles.navLink} href="/leaderboard">
              <span>Leaderboard</span>
            </Link>

            <Link className={styles.navLink} href="/resources">
              <span>Educational Resources</span>
            </Link>

            <Link className={styles.navLink} href="/dashboard">
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Column 2: Public Community */}
          <div className={styles.column}>
            <span className={styles.colHeader}>Community</span>

            <Link className={styles.navLink} href="/#vision">
              <span>Our Vision</span>
            </Link>

            <Link className={styles.navLink} href="/events">
              <span>News &amp; Events</span>
            </Link>

            <Link className={styles.navLink} href="/team">
              <span>Meet our Team</span>
            </Link>

            <Link className={styles.navLink} href="/social">
              <span>Social Links</span>
            </Link>
          </div>

          {/* Column 3: Membership & Access */}
          <div className={styles.column}>
            <span className={styles.colHeader}>Access</span>

            <Link className={styles.navLink} href="/login">
              <span>Sign in</span>
            </Link>

            <Link className={styles.navLink} href="/login">
              <span>Join Collective</span>
            </Link>

            <Link className={styles.navLink} href="/admin">
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <span>© 2026 Advait Collective. All rights reserved.</span>
        <button type="button" className={styles.backToTop} onClick={scrollToTop}>
          <span>Back to top</span>
          <span>↑</span>
        </button>
      </div>
    </footer>
  );
}
