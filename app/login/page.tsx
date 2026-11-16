"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

function GoogleIcon() {
  return (
    <svg className={styles.oauthIcon} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9c-.2-.7-.4-1.5-.4-2.4z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17C3.7 20.7 7.5 23.5 12 23.5z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className={styles.oauthIcon} viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const DIVISIONS = [
  { code: "RED", name: "Research & Engineering (Kernels, Shaders, Consensus)" },
  { code: "OPS", name: "Outreach, PR & Sponsorships (Ecosystem, Grants)" },
  { code: "EVED", name: "Events & Ventures Execution (Salons, Hackathons)" },
  { code: "Creatives", name: "Creatives & Social Media (Identity, Systems, UI/UX)" },
  { code: "GameVeda", name: "Game Development (Unreal 5, Procedural Physics)" },
];

function AuthGateway() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";
  const isLocked = searchParams.get("locked") === "true";
  const initialMode = searchParams.get("mode") === "join" ? "join" : "signin";

  const [mode, setMode] = useState<"signin" | "join">(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sign-in form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Join waitlist form state
  const [fullName, setFullName] = useState("");
  const [githubUser, setGithubUser] = useState("");
  const [joinEmail, setJoinEmail] = useState("");
  const [division, setDivision] = useState("RED");
  const [intentNote, setIntentNote] = useState("");
  const [joinSubmitted, setJoinSubmitted] = useState(false);

  useEffect(() => {
    if (searchParams.get("mode") === "join") {
      setMode("join");
    } else if (searchParams.get("mode") === "signin") {
      setMode("signin");
    }
  }, [searchParams]);

  const activateSessionAndRedirect = () => {
    setLoading(true);
    document.cookie = "advait_session=member; path=/; max-age=604800; SameSite=Lax";
    setTimeout(() => {
      router.push(redirectTarget);
      router.refresh();
    }, 350);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    activateSessionAndRedirect();
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate logging applicant into interview queue
    setTimeout(() => {
      setLoading(false);
      setJoinSubmitted(true);
    }, 450);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* ── Top Masthead / Brand Row ──────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.headerIndex}>
              {mode === "signin" ? "[00] OPERATOR AUTHENTICATION" : "[00] ADMISSIONS & INTERVIEWS"}
            </span>
            <span className={styles.headerMeta}>SEASON // 2026</span>
          </div>

          <div className={styles.brandRow}>
            <Link className={styles.brand} href="/" aria-label="Advait Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/advait-logo.png"
                alt="ADVAIT"
                className={styles.brandLogoImg}
                fetchPriority="high"
                decoding="async"
              />
            </Link>
            <span className={styles.versionTag}>/V.01</span>
          </div>

          <h1 className={styles.title}>
            {mode === "signin" ? "Member Authorization" : "Admissions & Interviews"}
          </h1>
          <p className={styles.subtitle}>
            {mode === "signin"
              ? "Access member dossiers, active engineering workstreams, and research archives."
              : "Advait Collective admissions cohort for Autumn/Spring 2026."}
          </p>
        </div>

        {/* ── Lock Notification (if bounced from protected page) ──────── */}
        {isLocked && (
          <div className={styles.notice}>
            <span className={styles.noticeBadge}>[LOCKED // AUTH REQUIRED]</span>
            <span>Please authenticate with your member credentials to access this system.</span>
          </div>
        )}

        {/* ── Mode Toggle Tabs ────────────────────────────────────────── */}
        <div className={styles.tabTrack} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            className={`${styles.tabBtn} ${
              mode === "signin" ? styles.tabBtnActive : ""
            }`}
            onClick={() => setMode("signin")}
          >
            <span className={styles.tabNum}>[01]</span>
            <span>MEMBER SIGN IN</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "join"}
            className={`${styles.tabBtn} ${
              mode === "join" ? styles.tabBtnActive : ""
            }`}
            onClick={() => setMode("join")}
          >
            <span className={styles.tabNum}>[02]</span>
            <span>JOIN &amp; INTERVIEWS</span>
          </button>
        </div>

        {/* ── MODE: SIGN IN ───────────────────────────────────────────── */}
        {mode === "signin" && (
          <div className={styles.flowWrap}>
            {/* OAuth Actions */}
            <div className={styles.oauthStack}>
              <button
                type="button"
                className={styles.oauthBtn}
                onClick={activateSessionAndRedirect}
                disabled={loading}
              >
                <GitHubIcon />
                <span>Continue with GitHub</span>
                <span className={styles.oauthTag}>[ONE-CLICK]</span>
              </button>

              <button
                type="button"
                className={styles.oauthBtn}
                onClick={activateSessionAndRedirect}
                disabled={loading}
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>or operator email authorization</span>
              <span className={styles.dividerLine} />
            </div>

            {/* Credentials Form */}
            <form className={styles.form} onSubmit={handleSignIn}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="signin-email">
                  <span>OPERATOR EMAIL ADDRESS</span>
                  <span className={styles.reqMarker}>*</span>
                </label>
                <input
                  id="signin-email"
                  type="email"
                  className={styles.input}
                  placeholder="builder@advait.collective"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="signin-password">
                    <span>SECURITY KEY / PASSPHRASE</span>
                    <span className={styles.reqMarker}>*</span>
                  </label>
                  <button
                    type="button"
                    className={styles.togglePasswordBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                <span>{loading ? "AUTHORIZING SESSION..." : "AUTHORIZE & ENTER"}</span>
                <span className={styles.btnArrow}>→</span>
              </button>
            </form>

            {/* Instant Demo Access Shortcut */}
            <div className={styles.demoHelperBox}>
              <div className={styles.demoHelperHeader}>
                <span className={styles.demoBadge}>[DEMO PROTOCOL]</span>
                <span className={styles.demoHint}>Instant Member Bypass</span>
              </div>
              <p className={styles.demoText}>
                No credentials required for collective review. Click below to enter directly as an active operator.
              </p>
              <button
                type="button"
                onClick={activateSessionAndRedirect}
                className={styles.demoBtn}
                disabled={loading}
              >
                ⚡ ONE-CLICK ENTER AS OPERATOR →
              </button>
            </div>
          </div>
        )}

        {/* ── MODE: JOIN & INTERVIEWS ─────────────────────────────────── */}
        {mode === "join" && (
          <div className={styles.flowWrap}>
            {/* Prominent Interviews Status Banner (Requested Feature) */}
            <div className={styles.interviewNoticeBanner}>
              <div className={styles.interviewStatusTop}>
                <span className={styles.interviewPulseDot} />
                <span className={styles.interviewStatusTag}>
                  RECRUITMENT COHORT // 2026 TERM
                </span>
              </div>
              <h2 className={styles.interviewHeading}>
                INTERVIEWS WILL BEGIN SHORTLY.
                <br />
                <span className={styles.interviewHeadingSub}>STAY TUNED.</span>
              </h2>
              <p className={styles.interviewDesc}>
                The Advait Collective admissions committee is preparing the 2026 intake cycles across RED (Research &amp; Engineering), OPS (Outreach), EVED (Events), Creatives, and GameVeda. Registered candidates will receive direct calendar invites and interview dispatch links via email and GitHub.
              </p>

              {/* 3-Step Process Timeline */}
              <div className={styles.timelineGrid}>
                <div className={`${styles.timelineStep} ${styles.stepActive}`}>
                  <span className={styles.stepNum}>[STAGE 01]</span>
                  <span className={styles.stepTitle}>DOSSIER LOG</span>
                  <span className={styles.stepStatus}>ACTIVE</span>
                </div>
                <div className={`${styles.timelineStep} ${styles.stepPending}`}>
                  <span className={styles.stepNum}>[STAGE 02]</span>
                  <span className={styles.stepTitle}>TECH INTERVIEWS</span>
                  <span className={styles.stepStatus}>SHORTLY</span>
                </div>
                <div className={styles.timelineStep}>
                  <span className={styles.stepNum}>[STAGE 03]</span>
                  <span className={styles.stepTitle}>KEY ALLOCATION</span>
                  <span className={styles.stepStatus}>UPCOMING</span>
                </div>
              </div>
            </div>

            {/* If applicant already submitted registration */}
            {joinSubmitted ? (
              <div className={styles.submittedCard}>
                <div className={styles.submittedHeader}>
                  <span className={styles.submittedBadge}>● APPLICATION LOGGED</span>
                  <span className={styles.submittedQueue}>QUEUE ID: ADV-INT-8842</span>
                </div>
                <h3 className={styles.submittedTitle}>
                  You are registered on the interview waitlist.
                </h3>
                <p className={styles.submittedDesc}>
                  Thank you, <strong>{fullName || "Builder"}</strong>. Your application for <strong>[{division}]</strong> has been recorded in the Advait admissions registry. We will contact you at <strong>{joinEmail || "your email"}</strong> as soon as the interview slots open.
                </p>
                <div className={styles.submittedActions}>
                  <Link href="/projects" className={styles.submittedPrimaryBtn}>
                    Explore Active Projects ↗
                  </Link>
                  <Link href="/hall-of-builders" className={styles.submittedSecondaryBtn}>
                    View Hall of Builders ↗
                  </Link>
                </div>
              </div>
            ) : (
              /* Early Registration / Candidate Waitlist Form */
              <div className={styles.applicationSection}>
                <div className={styles.formHeader}>
                  <h3 className={styles.formTitle}>REGISTER FOR INTERVIEW DISPATCH</h3>
                  <p className={styles.formDesc}>
                    Submit your details below to secure your spot in the initial interview review queue.
                  </p>
                </div>

                <form className={styles.form} onSubmit={handleJoinSubmit}>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="join-name">
                        <span>FULL NAME</span>
                        <span className={styles.reqMarker}>*</span>
                      </label>
                      <input
                        id="join-name"
                        type="text"
                        className={styles.input}
                        placeholder="Aditya Ray"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="join-github">
                        <span>GITHUB USERNAME</span>
                        <span className={styles.reqMarker}>*</span>
                      </label>
                      <input
                        id="join-github"
                        type="text"
                        className={styles.input}
                        placeholder="@username"
                        value={githubUser}
                        onChange={(e) => setGithubUser(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="join-email">
                      <span>EMAIL FOR INTERVIEW DISPATCH</span>
                      <span className={styles.reqMarker}>*</span>
                    </label>
                    <input
                      id="join-email"
                      type="email"
                      className={styles.input}
                      placeholder="builder@domain.com"
                      value={joinEmail}
                      onChange={(e) => setJoinEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="join-division">
                      <span>TARGET DIVISION OF INTEREST</span>
                      <span className={styles.reqMarker}>*</span>
                    </label>
                    <select
                      id="join-division"
                      className={styles.select}
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                    >
                      {DIVISIONS.map((d) => (
                        <option key={d.code} value={d.code}>
                          [{d.code}] — {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="join-note">
                      <span>PRIMARY CRAFT / WHAT YOU SHIP (OPTIONAL)</span>
                    </label>
                    <textarea
                      id="join-note"
                      rows={3}
                      className={styles.textarea}
                      placeholder="e.g. Building distributed WebGPU compute shaders, low-level Rust runtimes, or generative brand visual identities..."
                      value={intentNote}
                      onChange={(e) => setIntentNote(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    <span>
                      {loading
                        ? "RECORDING DOSSIER..."
                        : "REGISTER FOR INTERVIEWS & STAY TUNED"}
                    </span>
                    <span className={styles.btnArrow}>→</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className={styles.footer}>
          <span className={styles.footerTag}>[SYS // ADVAIT IDENTITY GATEWAY]</span>
          <span className={styles.footerText}>
            Advait Collective · 2026 Term
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className={styles.container} />}>
      <AuthGateway />
    </Suspense>
  );
}
