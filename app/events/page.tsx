"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { CountdownTimer } from "@/components/CountdownTimer";
import { uploadWithSignedUrl } from "@/lib/client-upload";
import styles from "./events.module.css";

type EventFilter = "all" | "upcoming" | "past" | "news" | "gallery" | "socials";
type ContentType = "event" | "news" | "gallery";

interface EventItem {
  id: string;
  num: string;
  type: ContentType;
  typeLabel: string;
  division: string;
  title: string;
  date: string;
  rawStartsAt?: string;
  time?: string;
  venue?: string;
  desc: string;
  status: "upcoming" | "past" | "news";
  actionText: string;
  imageUrls?: string[];
}

interface SocialChannel {
  id: string;
  num: string;
  name: string;
  handle: string;
  desc: string;
  badge: string;
  url: string;
  metric: string;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: "soc-ig",
    num: "01",
    name: "Instagram",
    handle: "@advait.collective",
    desc: "Visual design essays, generative stencil breakdowns, salon backstage recaps, and collective culture dispatches.",
    badge: "VISUAL & CULTURE",
    url: "https://instagram.com",
    metric: "1.8K Followers",
  },
  {
    id: "soc-gh",
    num: "02",
    name: "GitHub Organization",
    handle: "github.com/advait-collective",
    desc: "Open source engineering artifacts: AetherSwarm, LatentMesh WebGPU, ZKML proof verifiers, and client SDKs.",
    badge: "CODE & REPOSITORIES",
    url: "https://github.com",
    metric: "48 Repositories · 120+ PRs",
  },
  {
    id: "soc-dc",
    num: "03",
    name: "Discord Stage & Lounge",
    handle: "discord.gg/advait",
    desc: "Real-time builder rooms for RED, OPS, EVED, Creatives, and GameVeda. Live stage broadcasts for all technical salons.",
    badge: "REAL-TIME COMMUNITY",
    url: "https://discord.com",
    metric: "3,200+ Members Active",
  },
  {
    id: "soc-x",
    num: "04",
    name: "X / Twitter",
    handle: "@advait_collective",
    desc: "Low-latency engineering threads, benchmark differentials, research paper dispatches, and salon reminders.",
    badge: "SYSTEMS DISPATCHES",
    url: "https://x.com",
    metric: "Daily Announcements",
  },
  {
    id: "soc-yt",
    num: "05",
    name: "YouTube Channel",
    handle: "youtube.com/@advait",
    desc: "Full-length 4K lecture archives, architecture teardown recordings, WebGPU shader workshops, and builder demos.",
    badge: "VIDEO ARCHIVE",
    url: "https://youtube.com",
    metric: "Salon Video Vault",
  },
  {
    id: "soc-news",
    num: "06",
    name: "Research Newsletter",
    handle: "hello@advait.collective",
    desc: "Curated fortnightly digest covering state-of-the-art open models, collective grant allocations, and peer review logs.",
    badge: "EDITORIAL DIGEST",
    url: "mailto:hello@advait.collective",
    metric: "Fortnightly Docket",
  },
];

export default function EventsPage() {
  const [filter, setFilter] = useState<EventFilter>("all");
  const [search, setSearch] = useState("");
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [socialChannels, setSocialChannels] = useState<SocialChannel[]>([]);
  const [featuredSalon, setFeaturedSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Admin Check & Event Creation Modal State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    kind: "salon" as "salon" | "workshop" | "meetup" | "hackathon" | "news",
    location: "Main Auditorium & Online",
    startsAt: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
    endsAt: "",
    status: "upcoming" as "upcoming" | "completed",
    imageUrl: "",
  });

  // Verify Admin Session
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.role === "admin") {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadWithSignedUrl(file, "event");
      setNewEvent((prev) => ({ ...prev, imageUrl: url }));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Network error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    setCreatingEvent(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEvent.title.trim(),
          description: newEvent.description.trim() || undefined,
          kind: newEvent.kind,
          location: newEvent.location.trim() || undefined,
          startsAt: new Date(newEvent.startsAt).toISOString(),
          endsAt: newEvent.endsAt ? new Date(newEvent.endsAt).toISOString() : undefined,
          status: newEvent.status,
          imageUrl: newEvent.imageUrl || undefined,
        }),
      });

      if (res.ok) {
        setIsEventModalOpen(false);
        setNewEvent({
          title: "",
          description: "",
          kind: "salon",
          location: "Main Auditorium & Online",
          startsAt: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
          endsAt: "",
          status: "upcoming",
          imageUrl: "",
        });
        // Reload events list
        loadEventsAndSocials();
        alert("Event scheduled and published successfully!");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to schedule event.");
      }
    } catch {
      alert("Network error scheduling event.");
    } finally {
      setCreatingEvent(false);
    }
  };

  const loadEventsAndSocials = async () => {
    try {
      const [evRes, socRes, socialPostsRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/social-links"),
        fetch("/api/social-posts"),
      ]);

      const allItems: EventItem[] = [];

      if (evRes.ok) {
        const evData = await evRes.json();
        (evData.events || []).forEach((e: any, idx: number) => {
          const dateStr = e.startsAt
            ? new Date(e.startsAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }).toUpperCase()
            : "OCT 2026";

          const status = e.status === "completed" ? "past" : e.kind === "news" ? "news" : "upcoming";
          const typeLabel =
            e.kind === "salon"
              ? "TECHNICAL SALON"
              : e.kind === "news"
              ? "SYSTEM DISPATCH"
              : "COMMUNITY EVENT";

          allItems.push({
            id: e.id,
            num: String(idx + 1).padStart(2, "0"),
            type: e.kind === "news" ? "news" : "event",
            typeLabel,
            division: "RED",
            title: e.title,
            date: dateStr,
            rawStartsAt: e.startsAt,
            time: "6:00 PM IST",
            venue: e.location || "Online & Main Campus",
            desc: e.description || "Advait technical salon and collective gathering.",
            status,
            actionText: status === "past" ? "View archive ↗" : "RSVP for session ↗",
          });
        });
      }

      if (socialPostsRes.ok) {
        const spData = await socialPostsRes.json();
        (spData.posts || []).forEach((sp: any, idx: number) => {
          if (sp.type === "news" && allItems.some((item) => item.type === "news" && item.title === sp.title)) {
            return;
          }

          const dateStr = sp.createdAt
            ? new Date(sp.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }).toUpperCase()
            : "OCT 2026";

          const typeLabel =
            sp.type === "gallery"
              ? "PHOTO GALLERY"
              : sp.type === "news"
              ? "NEWS DISPATCH"
              : "PHOTO POST";

          allItems.push({
            id: sp.id,
            num: String(allItems.length + idx + 1).padStart(2, "0"),
            type: sp.type === "news" ? "news" : "gallery",
            typeLabel,
            division: sp.divisionSlug || "Creatives",
            title: sp.title,
            date: dateStr,
            rawStartsAt: sp.createdAt,
            time: undefined,
            venue: undefined,
            desc: sp.caption || "Advait social dispatch.",
            status: sp.type === "news" ? "news" : "past",
            actionText: sp.type === "news" ? "Read dispatch ↗" : "View photos ↗",
            imageUrls: sp.imageUrls,
          });
        });
      }

      setEventsList(allItems);
      const eventItemsForFeature = allItems.filter((item) => item.type === "event");
      const firstSalon =
        eventItemsForFeature.find((i) => i.typeLabel.includes("SALON") && i.status === "upcoming") ||
        eventItemsForFeature.find((i) => i.status === "upcoming") ||
        eventItemsForFeature[0];

      if (firstSalon) {
        setFeaturedSalon({
          num: "00",
          title: firstSalon.title,
          division: "RED / EVED",
          date: firstSalon.date,
          rawStartsAt: firstSalon.rawStartsAt,
          time: firstSalon.time || "6:00 PM IST",
          venue: firstSalon.venue || "Main Campus Auditorium",
          desc: firstSalon.desc,
          link: "#rsvp",
        });
      } else {
        setFeaturedSalon(null);
      }

      if (socRes.ok) {
        const socData = await socRes.json();
        const sItems: SocialChannel[] = (socData.socials || []).map((s: any, idx: number) => ({
          id: s.id,
          num: String(idx + 1).padStart(2, "0"),
          name: s.title,
          handle: s.platform === "github" ? "github.com/advait-collective" : `@advait_${s.platform}`,
          desc: `Official Advait Collective verified platform on ${s.title}.`,
          badge: `${s.title.toUpperCase()} CHANNEL`,
          url: s.url,
          metric: "Verified Collective Channel",
        }));

        if (sItems.length > 0) {
          setSocialChannels(sItems);
        }
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventsAndSocials();
  }, []);

  const currentSocialChannels = socialChannels.length > 0 ? socialChannels : SOCIAL_CHANNELS;

  const filteredEvents = useMemo(() => {
    return eventsList.filter((item) => {
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "upcoming"
            ? item.status === "upcoming"
            : filter === "past"
              ? item.status === "past"
              : filter === "news"
                ? item.status === "news"
                : filter === "gallery"
                  ? item.type === "gallery"
                : true;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.division.toLowerCase().includes(q) ||
        item.typeLabel.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const eventItems = filteredEvents.filter((item) => item.type === "event");
  const newsItems = filteredEvents.filter((item) => item.type === "news");
  const galleryItems = filteredEvents.filter((item) => item.type === "gallery");

  const renderContentCard = (ev: EventItem) => (
    <article key={ev.id} className={styles.eventCard}>
      <div className={styles.cardTop}>
        <div className={styles.cardBadges}>
          <span className={styles.cardNum}>[{ev.num}]</span>
          <span className={styles.divPill}>[{ev.division}]</span>
          <span className={styles.typeBadge}>[{ev.typeLabel}]</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <span className={styles.dateStamp}>{ev.date}</span>
          {ev.rawStartsAt && ev.status === "upcoming" && (
            <CountdownTimer targetDate={ev.rawStartsAt} variant="badge" />
          )}
          {ev.type === "news" && (
            <span className={styles.newsMarker}>● PERMANENT NEWS</span>
          )}
        </div>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.eventHeading}>{ev.title}</h3>
        {ev.time && (
          <div className={styles.timeVenueRow}>
            <span>{ev.time}</span>
            {ev.venue && (
              <>
                <span>·</span>
                <span>{ev.venue}</span>
              </>
            )}
          </div>
        )}
        {ev.imageUrls && ev.imageUrls.length > 0 && (
          <div className={styles.contentImages}>
            {ev.imageUrls.slice(0, 3).map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={img}
                alt={ev.title}
                className={styles.contentImage}
              />
            ))}
          </div>
        )}
        <p className={styles.eventDescText}>{ev.desc}</p>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.statusIndicator}>
          {ev.status === "upcoming"
            ? "● UPCOMING SESSION"
            : ev.status === "past"
              ? "○ ARCHIVED PROCEEDINGS"
              : "◆ OFFICIAL DISPATCH"}
        </span>
        <span className={styles.cardAction}>{ev.actionText}</span>
      </div>
    </article>
  );

  const renderContentSection = (
    id: string,
    index: string,
    label: string,
    title: string,
    items: EventItem[],
    emptyText: string
  ) => (
    <section className={styles.contentSection} id={id} aria-labelledby={`${id}-title`}>
      <div className={styles.contentSectionHeader}>
        <div className={styles.contentSectionIndex}>
          <span>[{index}]</span>
          <span>{label}</span>
        </div>
        <h2 id={`${id}-title`} className={styles.contentSectionTitle}>{title}</h2>
      </div>
      {items.length > 0 ? (
        <div className={styles.eventsGrid}>{items.map(renderContentCard)}</div>
      ) : (
        <div className={styles.sectionEmptyState}>{emptyText}</div>
      )}
    </section>
  );

  const handleRsvp = () => {
    setRsvpSuccess(true);
    setTimeout(() => setRsvpSuccess(false), 4000);
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── 00. Monumental Swiss Header (Opposite Theme: Deep Black Canvas) ── */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerIndex}>
              <span>[00]</span>
              <span>CALENDAR &amp; SALONS / ARCHIVE</span>
            </div>
            <div className={styles.headerMeta}>
              <span>DIR / 2026</span>
            </div>
          </div>

          <div className={styles.titleRow}>
            <div className={styles.titleWrap}>
              <h1 className={styles.title}>ADVAIT&apos;S SOCIAL</h1>
              <span className={styles.registered}>®</span>
            </div>
            <span className={styles.versionTag}>/V.01</span>
            <span className={styles.yearTag}>(2026)</span>
          </div>

          <div className={styles.headerSummaryRow}>
            <div className={styles.summaryLeftCol}>
              <p className={styles.headerSummary}>
                <span className={styles.monoIndex}>{`{1}`}</span>
                Architecture salons, hackathon cohorts, paper reading groups, and technical
                dispatches hosted by the Advait collective. All gatherings prioritize rigorous
                engineering breakdown, runnable live code, and open discussion over keynote fluff.
              </p>
              <div className={styles.headerJumpWrap}>
                <a href="#socials" className={styles.jumpSocialsLink}>
                  [04] VIEW COMMUNITY CHANNELS &amp; SOCIAL HUBS ↓
                </a>
              </div>
            </div>
            <div className={styles.statsRoster}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>04</span>
                <span className={styles.statLabel}>Upcoming Salons</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>06</span>
                <span className={styles.statLabel}>Social Hubs</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>1.2k+</span>
                <span className={styles.statLabel}>Attendees</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── 01. Featured Upcoming Salon Hero Banner ──────────────────────────── */}
        {featuredSalon && (
          <section id="rsvp" className={styles.featuredSection}>
            <div className={styles.featuredCard}>
              <div className={styles.featuredTopRow}>
                <div className={styles.featuredBadges}>
                  <span className={styles.featuredPill}>[FEATURED SALON]</span>
                  <span className={styles.divTag}>[{featuredSalon.division}]</span>
                </div>
                <span className={styles.countdownBadge}>● LIVE REGISTRATION OPEN</span>
              </div>

              <div className={styles.featuredContent}>
                <div className={styles.dateTimeGrid}>
                  <div className={styles.dateBlock}>
                    <span className={styles.dateLabel}>DATE:</span>
                    <span className={styles.dateValue}>{featuredSalon.date}</span>
                  </div>
                  <div className={styles.dateBlock}>
                    <span className={styles.dateLabel}>TIME:</span>
                    <span className={styles.dateValue}>{featuredSalon.time}</span>
                  </div>
                  <div className={styles.dateBlock}>
                    <span className={styles.dateLabel}>LOCATION:</span>
                    <span className={styles.dateValue}>{featuredSalon.venue}</span>
                  </div>
                </div>

                <h2 className={styles.featuredHeading}>
                  {featuredSalon.title}
                </h2>
                
                {/* Live Real-time Countdown Timer for Featured Salon */}
                {featuredSalon.rawStartsAt && (
                  <div style={{ margin: "16px 0" }}>
                    <CountdownTimer targetDate={featuredSalon.rawStartsAt} variant="hero" />
                  </div>
                )}

                <p className={styles.featuredDesc}>{featuredSalon.desc}</p>
              </div>

              <div className={styles.featuredActions}>
                <button
                  type="button"
                  onClick={handleRsvp}
                  className={styles.rsvpBtn}
                >
                  <span>{rsvpSuccess ? "RSVP REGISTERED ON DOCKET" : "RSVP FOR THIS TECHNICAL SALON"}</span>
                  <span>→</span>
                </button>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.discordBtn}
                >
                  Join Discord Stage ↗
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ── 02. Filter & Search Controls ────────────────────────────────────── */}
        <section className={styles.controlsSection}>
          <div className={styles.controlsRow}>
            {/* Search Input */}
            <div className={styles.searchWrap}>
              <span className={styles.searchPrompt}>[SEARCH] ›</span>
              <input
                type="text"
                placeholder="Search salons by topic, date, or division..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className={styles.clearSearchBtn}
                  aria-label="Clear filter"
                >
                  [CLEAR ×]
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className={styles.filterPills} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={filter === "all"}
                onClick={() => setFilter("all")}
                className={`${styles.filterPill} ${filter === "all" ? styles.filterPillActive : ""
                  }`}
              >
                [ALL GATHERINGS]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "upcoming"}
                onClick={() => setFilter("upcoming")}
                className={`${styles.filterPill} ${filter === "upcoming" ? styles.filterPillActive : ""
                  }`}
              >
                [UPCOMING SALONS]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "past"}
                onClick={() => setFilter("past")}
                className={`${styles.filterPill} ${filter === "past" ? styles.filterPillActive : ""
                  }`}
              >
                [ARCHIVED REVIEWS]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "news"}
                onClick={() => setFilter("news")}
                className={`${styles.filterPill} ${filter === "news" ? styles.filterPillActive : ""
                  }`}
              >
                [DISPATCHES &amp; NEWS]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "gallery"}
                onClick={() => setFilter("gallery")}
                className={`${styles.filterPill} ${filter === "gallery" ? styles.filterPillActive : ""
                  }`}
              >
                [GALLERY &amp; PHOTOS]
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "socials"}
                onClick={() => setFilter("socials")}
                className={`${styles.filterPill} ${filter === "socials" ? styles.filterPillActive : ""
                  }`}
              >
                [COMMUNITY &amp; SOCIALS]
              </button>
            </div>
          </div>
        </section>

        {/* ── 03. Dedicated Events, News, and Gallery sections ──────────────── */}
        <section className={styles.eventsGridSection} aria-label="Events, News, and Galleries">
          {filteredEvents.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyPrompt}>[NO SESSIONS FOUND]</span>
              <p className={styles.emptyText}>
                {search
                  ? `No content matches your search "${search}".`
                  : filter === "gallery"
                    ? "No photo posts or galleries have been published yet."
                    : filter === "news"
                      ? "No official news dispatches have been published yet."
                      : "No events, news, or galleries are currently available."}
              </p>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setSearch("");
                  }}
                  className={styles.resetBtn}
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {eventItems.length > 0 && renderContentSection(
                "events",
                "03",
                "CALENDAR / LIVE PROGRAMMING",
                "EVENTS & SALONS",
                eventItems,
                "No events or salons are currently scheduled."
              )}
              {newsItems.length > 0 && renderContentSection(
                "news",
                "04",
                "EDITORIAL / OFFICIAL DISPATCHES",
                "NEWS & ANNOUNCEMENTS",
                newsItems,
                "No official news dispatches have been published."
              )}
              {galleryItems.length > 0 && renderContentSection(
                "gallery",
                "05",
                "VISUAL ARCHIVE / COLLECTIVE MOMENTS",
                "GALLERIES & PHOTO POSTS",
                galleryItems,
                "No photo posts or galleries have been published."
              )}
            </>
          )}
        </section>

        {/* ── 04. Merged Community Channels & Social Network Hub ──────────────── */}
        <section
          className={styles.socialsSection}
          id="socials"
          aria-label="Community Channels & Social Hub"
        >
          <div className={styles.socialsHeader}>
            <div className={styles.socialsIndexRow}>
              <span className={styles.socialsIndex}>[04]</span>
              <span className={styles.socialsLabel}>
                NETWORK DOCKET / SOCIAL REDIRECTS
              </span>
            </div>
            <div className={styles.socialsTitleRow}>
              <h2 className={styles.socialsTitle}>
                COMMUNITY CHANNELS &amp; SOCIAL HUBS
              </h2>
              <p className={styles.socialsSubtitle}>
                Advait operates across open network spaces. Connect directly with division stewards,
                attend salon live stages on Discord, follow visual design essays on Instagram, and
                fork open-source codebases on GitHub.
              </p>
            </div>
          </div>

          <div className={styles.socialsGrid}>
            {currentSocialChannels.map((soc) => (
              <a
                key={soc.id}
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                className={styles.socialCard}
              >
                <div className={styles.socialCardTop}>
                  <div className={styles.socialNumBadge}>
                    <span className={styles.socialNum}>[{soc.num}]</span>
                    <span className={styles.socialBadge}>[{soc.badge}]</span>
                  </div>
                  <span className={styles.socialArrow}>↗</span>
                </div>

                <div className={styles.socialCardBody}>
                  <h3 className={styles.socialName}>{soc.name}</h3>
                  <span className={styles.socialHandle}>{soc.handle}</span>
                  <p className={styles.socialDesc}>{soc.desc}</p>
                </div>

                <div className={styles.socialCardFooter}>
                  <span className={styles.socialMetric}>{soc.metric}</span>
                  <span className={styles.socialLinkAction}>
                    Connect ↗
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── 05. Propose a Salon Section ─────────────────────────────────────── */}
        <section className={styles.proposeSection}>
          <div className={styles.proposeCard}>
            <div className={styles.proposeLeft}>
              <div className={styles.proposeIndex}>
                <span>[05]</span>
                <span>SPEAKER &amp; SALON PROPOSALS</span>
              </div>
              <h3 className={styles.proposeTitle}>
                Want to host an architecture salon or lead a paper reading?
              </h3>
              <p className={styles.proposeDesc}>
                We welcome researchers, founders, and engineers to run interactive sessions
                on low-level runtimes, zero-knowledge proofs, edge model quantization, or
                graphics engineering. Advait coordinates auditorium logistics and live streaming.
              </p>
            </div>

            <div className={styles.proposeActions}>
              <a
                href="mailto:events@advait.collective"
                className={styles.primaryProposeBtn}
              >
                <span>Propose a Session</span>
                <span>↗</span>
              </a>
              <Link href="/team" className={styles.secondaryTeamBtn}>
                Contact EVED Division Leads →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 06. Admin Schedule Event Modal ──────────────────────────────────── */}
        {isEventModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsEventModalOpen(false)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Schedule New Gathering (Admin Direct)</h3>
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className={styles.modalCloseBtn}
                >
                  [CLOSE]
                </button>
              </div>

              <p style={{ color: "#a1a1aa", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                Directly publish an architecture salon, technical workshop, or collective gathering
                to the official Advait calendar.
              </p>

              <form onSubmit={handleCreateEvent} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Technical Salon 05: Distributed State Sync"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className={styles.modalInput}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Event Kind</label>
                    <select
                      value={newEvent.kind}
                      onChange={(e) => setNewEvent({ ...newEvent, kind: e.target.value as any })}
                      className={styles.modalSelect}
                    >
                      <option value="salon">Technical Salon</option>
                      <option value="workshop">Hands-on Workshop</option>
                      <option value="hackathon">Hackathon / Sprint</option>
                      <option value="meetup">Community Meetup</option>
                      <option value="news">Official Dispatch</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Location / Venue</label>
                    <input
                      type="text"
                      placeholder="e.g., Main Campus & Discord Stage"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className={styles.modalInput}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Starts At *</label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.startsAt}
                      onChange={(e) => setNewEvent({ ...newEvent, startsAt: e.target.value })}
                      className={styles.modalInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ends At (Optional)</label>
                    <input
                      type="datetime-local"
                      value={newEvent.endsAt}
                      onChange={(e) => setNewEvent({ ...newEvent, endsAt: e.target.value })}
                      className={styles.modalInput}
                    />
                  </div>
                </div>

                {/* Cover Image Upload / Attachment */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Cover Image (Optional)</label>
                  <div className={styles.uploadRow}>
                    <input
                      type="url"
                      placeholder="Paste image URL or click browse..."
                      value={newEvent.imageUrl}
                      onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                      className={styles.modalInput}
                      style={{ flex: 1 }}
                    />
                    <label className={styles.uploadBtn}>
                      <span>{uploadingImage ? "Uploading..." : "Browse"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  {newEvent.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={newEvent.imageUrl}
                      alt="Event preview"
                      style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px", marginTop: "6px", border: "1px solid #27272a" }}
                    />
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description &amp; Agenda</label>
                  <textarea
                    rows={3}
                    placeholder="Keynote topics, speaker credentials, and discussion prompts..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className={styles.modalTextarea}
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingEvent || uploadingImage}
                  className={styles.modalSubmitBtn}
                >
                  {creatingEvent ? "Publishing Gathering..." : "Publish Event to Calendar"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
