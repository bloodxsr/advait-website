"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.css";

const publicLinks = [
  { href: "/projects", label: "Projects", tag: "Artifacts", num: "01" },
  { href: "/hall-of-flames", label: "Hall of Flames", tag: "Archive", num: "02" },
  { href: "/team", label: "Meet our Team", tag: "Stewardship", num: "03" },
  { href: "/events", label: "Events", tag: "Gatherings", num: "04" },
  { href: "/resources", label: "Resources", tag: "Library", num: "05" },
];

const allLinks = [
  { href: "/projects", label: "Projects", tag: "Artifacts", num: "01" },
  { href: "/hall-of-flames", label: "Hall of Flames", tag: "Archive", num: "02" },
  { href: "/team", label: "Meet our Team", tag: "Stewardship", num: "03" },
  { href: "/events", label: "Events", tag: "Gatherings", num: "04" },
  { href: "/resources", label: "Resources", tag: "Library", num: "05" },
  { href: "/dashboard", label: "Dashboard", tag: "Personal", num: "06" },
  { href: "/social", label: "Social Links", tag: "Network", num: "07" },
  { href: "/admin", label: "Admin Portal", tag: "Admin", num: "08" },
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
        {/* Brand — Swiss Stencil Branding */}
        <Link
          className={styles.brand}
          href="/"
          aria-label="Advait Home"
          onClick={() => setMenuOpen(false)}
        >
          <span>ADVAIT</span>
          <span className={styles.brandRegistered}>®</span>
        </Link>

        {/* Center Tagline (fades out smoothly as capsule shrinks) */}
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
                  <Link className={styles.signInBtn} href="/login?mode=signin">
                    Sign in
                  </Link>
                  <Link className={styles.joinBtn} href="/login?mode=join">
                    Join
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dropdown Menu (Anchored beneath capsule / bar) */}
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
              {isLoggedIn ? "MEMBER DIRECTORY" : "ROSTER INDEX / 2026"}
            </span>
          </div>
          <span className={styles.dropdownBadge}>
            {isLoggedIn ? "[VERIFIED]" : "[05 ROUTES]"}
          </span>
        </div>

        <div className={styles.menuLinks}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.itemNumber}>{link.num}</span>
                <span className={styles.itemLabel}>{link.label}</span>
                <span className={styles.itemTag}>[{link.tag}]</span>
                <span className={styles.itemArrow}>↗</span>
              </Link>
            );
          })}
        </div>

        <div className={styles.dropdownFooter}>
          <span className={styles.dropdownFooterText}>
            Advait Collective · Autonomous Systems &amp; Open Architecture
          </span>
        </div>
      </div>
    </header>
  );
}
