"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.css";

const publicLinks = [
  { href: "/projects", label: "Projects", tag: "Artifacts" },
  { href: "/hall-of-flames", label: "Hall of Flames", tag: "Archive" },
  { href: "/leaderboard", label: "Leaderboard", tag: "Rankings" },
  { href: "/events", label: "Events", tag: "Gatherings" },
  { href: "/resources", label: "Resources", tag: "Library" },
  { href: "/team", label: "Meet our Team", tag: "Stewardship" },
];

const allLinks = [
  { href: "/projects", label: "Projects", tag: "Artifacts" },
  { href: "/hall-of-flames", label: "Hall of Flames", tag: "Archive" },
  { href: "/leaderboard", label: "Leaderboard", tag: "Rankings" },
  { href: "/events", label: "Events", tag: "Gatherings" },
  { href: "/resources", label: "Resources", tag: "Library" },
  { href: "/team", label: "Meet our Team", tag: "Stewardship" },
  { href: "/dashboard", label: "Dashboard", tag: "Personal" },
  { href: "/social", label: "Social Links", tag: "Network" },
  { href: "/admin", label: "Admin Portal", tag: "Admin" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const isLoginPage = pathname === "/login";

  // Check login session cookie on mount and route changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(document.cookie.includes("advait_session="));
    };
    checkAuth();
  }, [pathname]);

  // Handle scroll and outside clicks
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleOutsideClick);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleSignOut = () => {
    document.cookie = "advait_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = isLoggedIn ? allLinks : publicLinks;

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.inner}>
        {/* Brand */}
        <Link
          className={styles.brand}
          href="/"
          aria-label="Advait Home"
          onClick={() => setMenuOpen(false)}
        >
          Advait
        </Link>

        {/* Center Tagline (fades out as navbar shrinks) */}
        <span className={styles.descriptor}>
          Association of Developers and Visionaries in AI &amp; Tech.
        </span>

        {/* Action Controls */}
        <div className={styles.actions}>
          {isLoginPage ? (
            <Link className={styles.signInBtn} href="/">
              ← Home
            </Link>
          ) : (
            <>
              {/* Menu Trigger Button */}
              <button
                type="button"
                className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnActive : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-label="Toggle navigation menu"
              >
                <span className={styles.menuBars} aria-hidden="true">
                  <span className={menuOpen ? styles.barOpen1 : styles.bar1} />
                  <span className={menuOpen ? styles.barOpen2 : styles.bar2} />
                </span>
                <span className={styles.menuLabel}>Menu</span>
              </button>

              {/* Login / Member Action */}
              {isLoggedIn ? (
                <button
                  type="button"
                  className={styles.signOutBtn}
                  onClick={handleSignOut}
                  title="Sign out of collective"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <Link className={styles.signInBtn} href="/login">
                    Sign in
                  </Link>
                  <Link className={styles.joinBtn} href="/login">
                    Join
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dropdown Menu (Anchored beneath the capsule / bar) */}
      <div
        className={`${styles.dropdown} ${menuOpen ? styles.dropdownOpen : ""}`}
        role="menu"
        aria-hidden={!menuOpen}
      >
        <div className={styles.dropdownHeader}>
          <div className={styles.dropdownStatus}>
            <span
              className={isLoggedIn ? styles.dotActive : styles.dotPublic}
              aria-hidden="true"
            />
            <span className={styles.dropdownTitle}>
              {isLoggedIn ? "All Collective Pages" : "Explore Advait"}
            </span>
          </div>
          <span className={styles.dropdownBadge}>
            {isLoggedIn ? "Active" : "Directory"}
          </span>
        </div>

        <div className={styles.menuLinks}>
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.itemNumber}>0{index + 1}</span>
                <span className={styles.itemLabel}>{link.label}</span>
                <span className={styles.itemTag}>{link.tag}</span>
                <span className={styles.itemArrow} aria-hidden="true">
                  ↗
                </span>
              </Link>
            );
          })}
        </div>

        {isLoggedIn && (
          <div className={styles.dropdownFooter}>
            <button
              type="button"
              className={styles.dropdownActionBtn}
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
