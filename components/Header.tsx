"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.css";

const publicLinks = [
  { href: "/projects", label: "Projects", tag: "Artifacts", num: "01" },
  { href: "/hall-of-builders", label: "Hall of Builders", tag: "Leaderboard", num: "02" },
  { href: "/team", label: "Meet our Team", tag: "Stewardship", num: "03" },
  { href: "/hall-of-flames", label: "Hall of Flames", tag: "Archive", num: "04" },
  { href: "/events", label: "Advait's Social", tag: "Salons & Network", num: "05" },
  { href: "/resources", label: "Resources", tag: "Library", num: "06" },
];

const memberLinks = [
  ...publicLinks,
  { href: "/publish", label: "Submit Artifact", tag: "Submit", num: "07" },
  { href: "/dashboard", label: "Dashboard", tag: "Personal", num: "08" },
];

const adminLinks = [
  ...publicLinks,
  { href: "/publish", label: "Publish", tag: "Publish", num: "07" },
  { href: "/dashboard", label: "Dashboard", tag: "Personal", num: "08" },
  { href: "/admin", label: "Admin Portal", tag: "Admin", num: "09" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [educationalOpen, setEducationalOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const isLoginPage = pathname === "/login";

  // Check login session cookie & user role on mount and route changes
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.user) {
              setIsLoggedIn(true);
              setIsAdmin(data.user.role === "admin");
            } else {
              setIsLoggedIn(false);
              setIsAdmin(false);
            }
          }
        } else {
          if (isMounted) {
            setIsLoggedIn(false);
            setIsAdmin(false);
          }
        }
      } catch {
        if (isMounted) {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      }
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
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

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch { }
    document.cookie = "advait_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "advait_session_active=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "advait_name=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "advait_role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    setIsLoggedIn(false);
    setIsAdmin(false);
    setMenuOpen(false);
    setEducationalOpen(false);
    setCommunityOpen(false);
    window.location.href = "/";
  };

  const navLinks = isLoggedIn ? (isAdmin ? adminLinks : memberLinks) : publicLinks;
  const educationalLinks = navLinks.filter(
    (link) => link.href === "/projects" || link.href === "/resources"
  );
  const communityLinks = navLinks.filter(
    (link) => link.href === "/hall-of-builders" || link.href === "/hall-of-flames"
  );
  const directLinks = navLinks.filter(
    (link) =>
      link.href !== "/projects" &&
      link.href !== "/resources" &&
      link.href !== "/hall-of-builders" &&
      link.href !== "/hall-of-flames"
  );
  const educationalActive = educationalLinks.some((link) => pathname === link.href);
  const communityActive = communityLinks.some((link) => pathname === link.href);
  const topLevelRouteCount = 2 + directLinks.length;

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.inner}>
        {/* Brand — Signature Advait Liquid Logo */}
        <Link
          className={styles.brand}
          href="/"
          aria-label="Advait Home"
          onClick={() => setMenuOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/advait-logo.png"
            alt="ADVAIT"
            className={styles.brandLogoImg}
            decoding="async"
            fetchPriority="high"
          />
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
            {isLoggedIn ? "[VERIFIED]" : `[${String(topLevelRouteCount).padStart(2, "0")} ROUTES]`}
          </span>
        </div>

        <div className={styles.menuLinks}>
          <div className={styles.menuGroup}>
            <button
              type="button"
              className={`${styles.menuGroupTrigger} ${educationalActive ? styles.menuItemActive : ""}`}
              aria-expanded={educationalOpen}
              onClick={() => setEducationalOpen((open) => !open)}
            >
              <span className={styles.itemNumber}>01</span>
              <span className={styles.itemLabel}>Educational</span>
              <span className={styles.itemTag}>[Learning &amp; Work]</span>
              <span className={`${styles.itemArrow} ${educationalOpen ? styles.itemArrowOpen : ""}`}>⌄</span>
            </button>
            <div className={`${styles.subMenu} ${educationalOpen ? styles.subMenuOpen : ""}`}>
              {educationalLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${styles.menuItem} ${styles.subMenuItem} ${isActive ? styles.menuItemActive : ""}`}
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setEducationalOpen(false);
                    }}
                  >
                    <span className={styles.itemNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.itemLabel}>{link.label}</span>
                    <span className={styles.itemTag}>[{link.tag}]</span>
                    <span className={styles.itemArrow}>↗</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className={styles.menuGroup}>
            <button
              type="button"
              className={`${styles.menuGroupTrigger} ${communityActive ? styles.menuItemActive : ""}`}
              aria-expanded={communityOpen}
              onClick={() => setCommunityOpen((open) => !open)}
            >
              <span className={styles.itemNumber}>02</span>
              <span className={styles.itemLabel}>Community</span>
              <span className={styles.itemTag}>[Recognition &amp; Archive]</span>
              <span className={`${styles.itemArrow} ${communityOpen ? styles.itemArrowOpen : ""}`}>⌄</span>
            </button>
            <div className={`${styles.subMenu} ${communityOpen ? styles.subMenuOpen : ""}`}>
              {communityLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${styles.menuItem} ${styles.subMenuItem} ${isActive ? styles.menuItemActive : ""}`}
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setCommunityOpen(false);
                    }}
                  >
                    <span className={styles.itemNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.itemLabel}>{link.label}</span>
                    <span className={styles.itemTag}>[{link.tag}]</span>
                    <span className={styles.itemArrow}>↗</span>
                  </Link>
                );
              })}
            </div>
          </div>
          {directLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.menuItem} ${
                  link.href === "/events" ? styles.socialMenuItem : ""
                } ${isActive ? styles.menuItemActive : ""}`}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.itemNumber}>{String(index + 3).padStart(2, "0")}</span>
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
