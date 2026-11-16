"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

// ── Types ──────────────────────────────────────────────────────────────────
interface AdminStats {
  totalMembers: number;
  totalProjects: number;
  totalPosts: number;
  pendingApprovals: number;
  pendingBreakdown?: {
    resources: number;
    projects: number;
    posts: number;
  };
  totalPointsAwarded: number;
}

interface PendingItem {
  id: string;
  kind: "resource" | "project" | "post";
  title: string;
  description: string | null;
  link?: string;
  categoryOrSubtopic?: string;
  divisionSlug?: string | null;
  submitterName?: string | null;
  submitterEmail?: string | null;
  createdAt: string;
  bodyMd?: string;
}

interface ProjectRecord {
  id: string;
  name: string;
  description: string | null;
  type: string;
  link: string;
  status: string;
  divisionName: string | null;
  divisionSlug: string | null;
  subtopicName: string | null;
  leadName: string | null;
  leadEmail: string | null;
  createdAt: string;
}

interface PostRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  subtopicName: string | null;
  subtopicSlug: string | null;
  authorName: string | null;
  authorEmail: string | null;
  readTime: string | null;
  status: string;
  createdAt: string;
}

interface SocialPostRecord {
  id: string;
  title: string;
  caption: string | null;
  type: "photo" | "gallery" | "news";
  imageUrls: string[];
  divisionId?: string | null;
  divisionName?: string | null;
  divisionSlug?: string | null;
  authorName?: string | null;
  createdAt: string;
}

interface EventRecord {
  id: string;
  title: string;
  description: string | null;
  kind: "salon" | "workshop" | "meetup" | "hackathon" | "news";
  location: string | null;
  startsAt: string;
  endsAt: string | null;
  status: "upcoming" | "completed" | "cancelled";
}

interface ResourceRecord {
  id: string;
  title: string;
  description: string | null;
  link: string;
  category: string;
  tags: string[];
  status: string;
  submitterName: string | null;
  createdAt: string;
}

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  headline: string | null;
  year: string | null;
  section: string | null;
  department: string | null;
  bio: string | null;
  avatarUrl: string | null;
  techStack: string[];
  divisionName: string | null;
  divisionSlug: string | null;
  isDivisionLead: boolean;
  isLeader: boolean;
  totalPoints: number;
}

interface DivisionRecord {
  id: string;
  name: string;
  slug: string;
  badge: string;
}

interface SubtopicRecord {
  id: string;
  name: string;
  slug: string;
}

type AdminTab = "queue" | "projects" | "blogs" | "social" | "resources" | "members";
type SocialSubTab = "all" | "photo" | "events" | "news" | "gallery";

export default function AdminPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Tab & Filter States
  const [activeTab, setActiveTab] = useState<AdminTab>("queue");
  const [activeDivision, setActiveDivision] = useState("all");
  const [queueKindFilter, setQueueKindFilter] = useState<"all" | "projects" | "posts" | "resources">("all");
  const [socialSubTab, setSocialSubTab] = useState<SocialSubTab>("all");

  // Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectRecord[]>([]);
  const [postsList, setPostsList] = useState<PostRecord[]>([]);
  const [socialPostsList, setSocialPostsList] = useState<SocialPostRecord[]>([]);
  const [eventsList, setEventsList] = useState<EventRecord[]>([]);
  const [resourcesList, setResourcesList] = useState<ResourceRecord[]>([]);
  const [membersList, setMembersList] = useState<MemberRecord[]>([]);
  const [divisions, setDivisions] = useState<DivisionRecord[]>([]);
  const [subtopics, setSubtopics] = useState<SubtopicRecord[]>([]);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");

  // Karma Modal State
  const [karmaTarget, setKarmaTarget] = useState<MemberRecord | null>(null);
  const [karmaPoints, setKarmaPoints] = useState<number>(25);
  const [karmaReason, setKarmaReason] = useState("");
  const [karmaSubmitting, setKarmaSubmitting] = useState(false);

  // 1. Verify Admin Session
  useEffect(() => {
    let isMounted = true;
    async function checkAdminAuth() {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) {
          if (isMounted) {
            setIsAuthorized(false);
            setAuthChecked(true);
            router.push("/login?redirect=/admin");
          }
          return;
        }

        const data = await res.json();
        if (data.user && data.user.role === "admin") {
          if (isMounted) {
            setIsAuthorized(true);
            setAuthChecked(true);
          }
        } else {
          if (isMounted) {
            setIsAuthorized(false);
            setAuthChecked(true);
            window.location.href = "/login?redirect=/admin";
          }
        }
      } catch {
        if (isMounted) {
          setIsAuthorized(false);
          setAuthChecked(true);
          router.push("/login?redirect=/admin");
        }
      }
    }
    checkAdminAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  // 2. Fetch All Admin Datasets
  const loadData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        approvalsRes,
        projectsRes,
        postsRes,
        socialRes,
        eventsRes,
        resourcesRes,
        membersRes,
        divRes,
        subRes,
      ] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/approvals"),
        fetch("/api/projects?status=all&limit=100"),
        fetch("/api/posts?status=all&limit=100"),
        fetch("/api/social-posts"),
        fetch("/api/events"),
        fetch("/api/resources"),
        fetch("/api/members"),
        fetch("/api/divisions"),
        fetch("/api/subtopics"),
      ]);

      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData.stats || sData);
      }

      if (approvalsRes.ok) {
        const aData = await approvalsRes.json();
        const unifiedPending: PendingItem[] = [];

        (aData.projects || []).forEach((p: any) => {
          unifiedPending.push({
            id: p.id,
            kind: "project",
            title: p.name,
            description: p.description,
            link: p.link,
            categoryOrSubtopic: p.subtopicName || p.type,
            divisionSlug: p.divisionSlug,
            submitterName: p.leadName,
            submitterEmail: p.leadEmail,
            createdAt: p.createdAt,
          });
        });

        (aData.posts || []).forEach((b: any) => {
          unifiedPending.push({
            id: b.id,
            kind: "post",
            title: b.title,
            description: b.excerpt,
            categoryOrSubtopic: b.subtopicName || "Essay",
            submitterName: b.authorName,
            submitterEmail: b.authorEmail,
            createdAt: b.createdAt,
            bodyMd: b.bodyMd,
          });
        });

        (aData.resources || []).forEach((r: any) => {
          unifiedPending.push({
            id: r.id,
            kind: "resource",
            title: r.title,
            description: r.description,
            link: r.link,
            categoryOrSubtopic: r.category,
            submitterName: r.submitterName,
            submitterEmail: r.submitterEmail,
            createdAt: r.createdAt,
          });
        });

        unifiedPending.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPendingItems(unifiedPending);
      }

      if (projectsRes.ok) {
        const pData = await projectsRes.json();
        setProjectsList(pData.projects || []);
      }

      if (postsRes.ok) {
        const bData = await postsRes.json();
        setPostsList(bData.posts || []);
      }

      if (socialRes.ok) {
        const sData = await socialRes.json();
        setSocialPostsList(sData.posts || []);
      }

      if (eventsRes.ok) {
        const evData = await eventsRes.json();
        setEventsList(evData.events || []);
      }

      if (resourcesRes.ok) {
        const rData = await resourcesRes.json();
        setResourcesList(rData.resources || []);
      }

      if (membersRes.ok) {
        const mData = await membersRes.json();
        setMembersList(mData.members || []);
      }

      if (divRes.ok) {
        const dData = await divRes.json();
        setDivisions(dData.divisions || []);
      }

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubtopics(subData.subtopics || []);
      }
    } catch (err) {
      console.error("Failed to load admin telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadData();
    }
  }, [isAuthorized]);

  // 3. Central Approval Actions
  const handleReviewItem = async (
    item: PendingItem,
    decision: "approved" | "rejected"
  ) => {
    setActionLoading(item.id);
    try {
      let note = "";
      if (decision === "rejected") {
        const inputNote = window.prompt("Reason for rejection (optional feedback for author):");
        if (inputNote === null) {
          setActionLoading(null);
          return;
        }
        note = inputNote;
      }

      const pluralKind = item.kind === "project" ? "projects" : item.kind === "post" ? "posts" : "resources";
      const res = await fetch(`/api/admin/approvals/${pluralKind}/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, note }),
      });

      if (res.ok) {
        await loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to process review.");
      }
    } catch (err) {
      console.error("Review action error:", err);
      alert("Network error processing review.");
    } finally {
      setActionLoading(null);
    }
  };

  // 4. Delete Handlers
  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete project "${name}"?`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) await loadData();
      else alert("Failed to delete project.");
    } catch {
      alert("Network error deleting project.");
    }
  };

  const handleDeletePost = async (idOrSlug: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete essay "${title}"?`)) return;
    try {
      const res = await fetch(`/api/posts/${idOrSlug}`, { method: "DELETE" });
      if (res.ok) await loadData();
      else alert("Failed to delete essay.");
    } catch {
      alert("Network error deleting essay.");
    }
  };

  const handleDeleteSocial = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete social dispatch "${title}"?`)) return;
    try {
      const res = await fetch(`/api/social-posts/${id}`, { method: "DELETE" });
      if (res.ok) await loadData();
      else alert("Failed to delete social dispatch.");
    } catch {
      alert("Network error deleting social dispatch.");
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) await loadData();
      else alert("Failed to delete event.");
    } catch {
      alert("Network error deleting event.");
    }
  };

  const handleDeleteResource = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete resource "${title}"?`)) return;
    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      if (res.ok) await loadData();
      else alert("Failed to delete resource.");
    } catch {
      alert("Network error deleting resource.");
    }
  };

  // 5. Karma Points Handler
  const handleAwardPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!karmaTarget) return;

    if (!karmaReason.trim()) {
      alert("Please provide a milestone or reason description.");
      return;
    }

    setKarmaSubmitting(true);
    try {
      const res = await fetch("/api/admin/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: karmaTarget.id,
          points: Number(karmaPoints),
          reason: karmaReason.trim(),
        }),
      });

      if (res.ok) {
        setKarmaTarget(null);
        setKarmaReason("");
        setKarmaPoints(25);
        await loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to award points.");
      }
    } catch {
      alert("Network error awarding points.");
    } finally {
      setKarmaSubmitting(false);
    }
  };

  // 7. Filtered Computations
  const filteredPending = useMemo(() => {
    return pendingItems.filter((item) => {
      const matchesKind = queueKindFilter === "all" || item.kind === queueKindFilter.slice(0, -1);
      const matchesDivision =
        activeDivision === "all" ||
        (item.divisionSlug && item.divisionSlug.toLowerCase() === activeDivision.toLowerCase());
      return matchesKind && matchesDivision;
    });
  }, [pendingItems, queueKindFilter, activeDivision]);

  const filteredProjects = useMemo(() => {
    return projectsList.filter((p) => {
      const matchesDivision =
        activeDivision === "all" ||
        (p.divisionSlug && p.divisionSlug.toLowerCase() === activeDivision.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.leadName && p.leadName.toLowerCase().includes(q));
      return matchesDivision && matchesSearch;
    });
  }, [projectsList, activeDivision, searchQuery]);

  const filteredPosts = useMemo(() => {
    return postsList.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.authorName && b.authorName.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [postsList, searchQuery]);

  const filteredSocial = useMemo(() => {
    return socialPostsList.filter((s) => {
      const matchesType = socialSubTab === "all" || s.type === socialSubTab;
      const matchesDivision =
        activeDivision === "all" ||
        (s.divisionSlug && s.divisionSlug.toLowerCase() === activeDivision.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        (s.caption && s.caption.toLowerCase().includes(q));
      return matchesType && matchesDivision && matchesSearch;
    });
  }, [socialPostsList, socialSubTab, activeDivision, searchQuery]);

  const filteredResources = useMemo(() => {
    return resourcesList.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        r.title.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        r.category.toLowerCase().includes(q)
      );
    });
  }, [resourcesList, searchQuery]);

  const filteredMembers = useMemo(() => {
    return membersList.filter((m) => {
      const matchesDivision =
        activeDivision === "all" ||
        (m.divisionSlug && m.divisionSlug.toLowerCase() === activeDivision.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      return (
        matchesDivision &&
        (!q ||
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.department && m.department.toLowerCase().includes(q)))
      );
    });
  }, [membersList, activeDivision, searchQuery]);

  // Auth gate check view
  if (!authChecked) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <span className={styles.livePulse} />
            <p className={styles.emptyText}>Verifying Advait Architectural Credentials...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.unauthorizedBox}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "#ef4444", fontWeight: 800 }}>[RESTRICTED ACCESS]</span>
            <h2 className={styles.unauthorizedTitle}>RESTRICTED ACCESS</h2>
            <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: 1.6 }}>
              This operations command center is strictly restricted to verified Advait Lead Architects.
              Public visitors and standard members cannot access this area.
            </p>
            <Link href="/login?redirect=/admin" className={styles.loginRedirectBtn}>
              Sign In with Admin Credentials →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── 01. Masthead ────────────────────────────────────────────────── */}
        <section className={styles.masthead}>
          <div className={styles.mastheadLeft}>
            <div className={styles.systemBadge}>
              <span className={styles.livePulse} />
              <span>Advait Operations // Admin Command Center</span>
            </div>
            <h1 className={styles.title}>Administration Portal</h1>
            <p className={styles.subtitle}>
              Full operational control over the central approval queue, active project repositories,
              Hall of Flames editorial dispatches, Advait Social media, and verified membership records.
            </p>
          </div>

          <div className={styles.mastheadRight}>
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className={styles.refreshBtn}
              title="Refresh database records"
            >
              <span>↻</span>
              <span>{loading ? "Syncing..." : "Sync Live Data"}</span>
            </button>
          </div>
        </section>

        {/* ── 02. Division Switcher Bar ───────────────────────────────────── */}
        <section className={styles.divisionBanner}>
          <span className={styles.divisionSelectorLabel}>
            <span>Active Division Filter:</span>
          </span>
          <div className={styles.divisionChips}>
            {["all", "RED", "OPS", "EVED", "Creatives", "GameVeda"].map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => setActiveDivision(slug)}
                className={`${styles.divisionChip} ${
                  activeDivision.toLowerCase() === slug.toLowerCase() ? styles.divisionChipActive : ""
                }`}
              >
                {slug === "all" ? "[ALL DIVISIONS]" : `[${slug.toUpperCase()}]`}
              </button>
            ))}
          </div>
        </section>

        {/* ── 03. Stats Telemetry ─────────────────────────────────────────── */}
        <section className={styles.statsGrid}>
          <div className={`${styles.statCard} ${pendingItems.length > 0 ? styles.statCardAlert : ""}`}>
            <span className={styles.statLabel}>Pending Approvals</span>
            <div className={styles.statValue}>
              <span>{pendingItems.length}</span>
              {pendingItems.length > 0 && <span className={styles.statBadge}>NEEDS REVIEW</span>}
            </div>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Projects</span>
            <div className={styles.statValue}>{projectsList.length}</div>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Hall of Flames Essays</span>
            <div className={styles.statValue}>{postsList.length}</div>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Advait Social Dispatches</span>
            <div className={styles.statValue}>{socialPostsList.length + eventsList.length}</div>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Verified Members</span>
            <div className={styles.statValue}>{membersList.length}</div>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Karma Distributed</span>
            <div className={styles.statValue}>
              <span style={{ color: "#f59e0b" }}>{stats?.totalPointsAwarded ?? "—"}</span>
              <span style={{ fontSize: "14px", color: "#71717a", fontWeight: 500 }}>pts</span>
            </div>
          </div>
        </section>

        {/* ── 04. Primary Navigation Tabs ─────────────────────────────────── */}
        <nav className={styles.tabsBar} aria-label="Admin Navigation Tabs">
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "queue" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("queue")}
          >
            <span>[01] CENTRAL APPROVALS</span>
            <span className={`${styles.tabPill} ${pendingItems.length > 0 ? styles.tabPillAlert : ""}`}>
              {pendingItems.length}
            </span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "projects" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <span>[02] PROJECTS</span>
            <span className={styles.tabPill}>{projectsList.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "blogs" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("blogs")}
          >
            <span>[03] HALL OF FLAMES</span>
            <span className={styles.tabPill}>{postsList.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "social" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("social")}
          >
            <span>[04] ADVAIT SOCIAL</span>
            <span className={styles.tabPill}>{socialPostsList.length + eventsList.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "resources" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("resources")}
          >
            <span>[05] RESOURCES</span>
            <span className={styles.tabPill}>{resourcesList.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "members" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("members")}
          >
            <span>[06] MEMBERS &amp; KARMA</span>
            <span className={styles.tabPill}>{membersList.length}</span>
          </button>
        </nav>

        {/* ── 05. TAB 1: Centralized Approval Queue ───────────────────────── */}
        {activeTab === "queue" && (
          <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className={styles.subFiltersRow}>
              {(["all", "projects", "posts", "resources"] as const).map((kind) => {
                const count =
                  kind === "all"
                    ? pendingItems.length
                    : pendingItems.filter((i) => i.kind === kind.slice(0, -1)).length;
                return (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => setQueueKindFilter(kind)}
                    className={`${styles.subFilterBtn} ${
                      queueKindFilter === kind ? styles.subFilterBtnActive : ""
                    }`}
                  >
                    <span>{`[${kind.toUpperCase()}]`}</span>
                    <span className={styles.tabPill}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.queueGrid}>
              {filteredPending.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>[ALL CLEAR]</span>
                  <h3 className={styles.emptyTitle}>Central Approval Queue Clean</h3>
                  <p className={styles.emptyText}>
                    All user-submitted projects, Hall of Flames blogs, and educational resources have
                    been reviewed.
                  </p>
                </div>
              ) : (
                filteredPending.map((item) => (
                  <article key={item.id} className={styles.queueCard}>
                    <div className={styles.queueHeader}>
                      <div className={styles.queueTitleRow}>
                        <span className={styles.queueCategoryTag}>
                          [{item.kind.toUpperCase()} PROPOSAL] · SUBMITTED FOR APPROVAL
                          {item.divisionSlug && ` · DIVISION: ${item.divisionSlug}`}
                        </span>
                        <h2 className={styles.queueTitle}>
                          {item.title}
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.extLink}
                              title="Open URL"
                            >
                              ↗ Open Link
                            </a>
                          )}
                        </h2>
                      </div>

                      <div className={styles.queueActions}>
                        <button
                          type="button"
                          disabled={actionLoading === item.id}
                          onClick={() => handleReviewItem(item, "approved")}
                          className={styles.approveBtn}
                        >
                          {actionLoading === item.id
                            ? "Processing..."
                            : item.kind === "project"
                            ? "APPROVE (+15 PTS)"
                            : item.kind === "post"
                            ? "APPROVE (+25 PTS)"
                            : "APPROVE (+3 PTS)"}
                        </button>

                        <button
                          type="button"
                          disabled={actionLoading === item.id}
                          onClick={() => handleReviewItem(item, "rejected")}
                          className={styles.rejectBtn}
                        >
                          REJECT
                        </button>
                      </div>
                    </div>

                    {item.description && <p className={styles.queueDesc}>{item.description}</p>}

                    {item.bodyMd && (
                      <details style={{ marginTop: "4px" }}>
                        <summary
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                            color: "#a78bfa",
                            cursor: "pointer",
                          }}
                        >
                          ▶ View Submitted Markdown Body ({item.bodyMd.length} chars)
                        </summary>
                        <pre
                          style={{
                            marginTop: "8px",
                            padding: "12px",
                            background: "#09090b",
                            border: "1px solid #27272a",
                            borderRadius: "6px",
                            fontSize: "12px",
                            color: "#d4d4d8",
                            whiteSpace: "pre-wrap",
                            maxHeight: "240px",
                            overflowY: "auto",
                          }}
                        >
                          {item.bodyMd}
                        </pre>
                      </details>
                    )}

                    <div className={styles.queueMeta}>
                      <div className={styles.queueMetaItem}>
                        <span>Author / Submitter:</span>
                        <strong className={styles.queueMetaValue}>
                          {item.submitterName || "Member"}
                        </strong>
                        {item.submitterEmail && (
                          <span style={{ color: "#71717a" }}>({item.submitterEmail})</span>
                        )}
                      </div>

                      <div className={styles.queueMetaItem}>
                        <span>Timestamp:</span>
                        <span className={styles.queueMetaValue}>
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {item.categoryOrSubtopic && (
                        <div className={styles.queueMetaItem}>
                          <span>Category:</span>
                          <span className={styles.queueMetaValue}>{item.categoryOrSubtopic}</span>
                        </div>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )}

        {/* ── 06. TAB 2: Projects Management ──────────────────────────────── */}
        {activeTab === "projects" && (
          <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className={styles.controlsBar}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search projects by name, description, or lead..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.membersTable}>
                <thead>
                  <tr>
                    <th>Project Name &amp; Description</th>
                    <th>Type</th>
                    <th>Division</th>
                    <th>Lead</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#71717a" }}>
                        No projects found. Click &quot;Direct Publish Project&quot; above to add one.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontWeight: 700, color: "#ffffff", textDecoration: "none" }}
                            >
                              {p.name} ↗
                            </a>
                            <span style={{ fontSize: "12px", color: "#a1a1aa", maxWidth: "420px" }}>
                              {p.description || "—"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.roleBadgeMember}>{p.type.toUpperCase()}</span>
                        </td>
                        <td>
                          <span className={styles.divBadge}>{p.divisionSlug || "RED"}</span>
                        </td>
                        <td>
                          <span style={{ color: "#d4d4d8" }}>{p.leadName || "Admin"}</span>
                        </td>
                        <td>
                          <span
                            className={
                              p.status === "approved"
                                ? styles.roleBadgeAdmin
                                : p.status === "pending"
                                ? styles.tabPillAlert
                                : styles.roleBadgeMember
                            }
                          >
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(p.id, p.name)}
                            className={styles.deleteBtn}
                          >
                            [DELETE]
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── 07. TAB 3: Hall of Flames (Blog Management) ──────────────────── */}
        {activeTab === "blogs" && (
          <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className={styles.controlsBar}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search essays by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.membersTable}>
                <thead>
                  <tr>
                    <th>Title &amp; Excerpt</th>
                    <th>Subtopic</th>
                    <th>Author</th>
                    <th>Read Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#71717a" }}>
                        No Hall of Flames essays found. Click &quot;Write &amp; Publish Essay&quot; above to add one.
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <Link
                              href={`/hall-of-flames/${b.slug}`}
                              style={{ fontWeight: 700, color: "#ffffff", textDecoration: "none" }}
                            >
                              {b.title} ↗
                            </Link>
                            <span style={{ fontSize: "12px", color: "#a1a1aa", maxWidth: "420px" }}>
                              {b.excerpt || "—"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.divBadge}>{b.subtopicName || "Research"}</span>
                        </td>
                        <td>
                          <span style={{ color: "#d4d4d8" }}>{b.authorName || "Editorial"}</span>
                        </td>
                        <td>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#71717a" }}>
                            {b.readTime || "5 min"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              b.status === "approved"
                                ? styles.roleBadgeAdmin
                                : b.status === "pending"
                                ? styles.tabPillAlert
                                : styles.roleBadgeMember
                            }
                          >
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleDeletePost(b.slug, b.title)}
                            className={styles.deleteBtn}
                          >
                            [DELETE]
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── 08. TAB 4: Advait Social Management ──────────────────────────── */}
        {activeTab === "social" && (
          <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className={styles.subFiltersRow}>
              {(["all", "photo", "events", "news", "gallery"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSocialSubTab(tab)}
                  className={`${styles.subFilterBtn} ${
                    socialSubTab === tab ? styles.subFilterBtnActive : ""
                  }`}
                >
                  {tab === "all" ? "[ALL SOCIAL MEDIA]" : `[${tab.toUpperCase()}]`}
                </button>
              ))}
            </div>

            {/* Social Posts Grid */}
            <div className={styles.socialGrid}>
              {/* Event Cards if socialSubTab is 'all' or 'events' */}
              {(socialSubTab === "all" || socialSubTab === "events") &&
                eventsList.map((ev) => (
                  <article key={ev.id} className={styles.socialCard}>
                    <div className={styles.socialContent}>
                      <div className={styles.socialBadgeRow}>
                        <span className={styles.socialTypeTag}>EVENT // {ev.kind.toUpperCase()}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#30d158" }}>
                          ● {ev.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className={styles.socialTitle}>{ev.title}</h3>
                      <p className={styles.socialCaption}>{ev.description || "Advait Salon gathering."}</p>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#71717a" }}>
                        <span>Location: {ev.location || "Main Campus"}</span> · <span>Starts: {new Date(ev.startsAt).toLocaleDateString()}</span>
                      </div>
                      <div className={styles.socialFooter}>
                        <span>Event ID: {ev.id.slice(0, 8)}...</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          className={styles.deleteBtn}
                        >
                          [DELETE EVENT]
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

              {/* Photo & Gallery & News Cards */}
              {filteredSocial.map((item) => (
                <article key={item.id} className={styles.socialCard}>
                  {item.type === "gallery" && item.imageUrls.length > 1 ? (
                    <div className={styles.socialGalleryPreview}>
                      {item.imageUrls.slice(0, 4).map((url, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={url} alt={item.title} className={styles.socialGalleryImg} />
                      ))}
                    </div>
                  ) : item.imageUrls.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrls[0]} alt={item.title} className={styles.socialImagePreview} />
                  ) : null}

                  <div className={styles.socialContent}>
                    <div className={styles.socialBadgeRow}>
                      <span className={styles.socialTypeTag}>
                        {item.type.toUpperCase()}
                        {item.divisionSlug && ` // ${item.divisionSlug}`}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#71717a" }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className={styles.socialTitle}>{item.title}</h3>
                    {item.caption && <p className={styles.socialCaption}>{item.caption}</p>}

                    <div className={styles.socialFooter}>
                      <span>Images: {item.imageUrls.length}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSocial(item.id, item.title)}
                        className={styles.deleteBtn}
                      >
                        [DELETE]
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {filteredSocial.length === 0 && (socialSubTab !== "events" || eventsList.length === 0) && (
                <div className={styles.emptyState} style={{ gridColumn: "1 / -1" }}>
                  <span className={styles.emptyIcon}>[EMPTY]</span>
                  <h3 className={styles.emptyTitle}>No Advait Social Dispatches Found</h3>
                  <p className={styles.emptyText}>
                    Use the action buttons above to upload photos, create galleries, or schedule salons.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 09. TAB 5: Resources Management ─────────────────────────────── */}
        {activeTab === "resources" && (
          <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className={styles.controlsBar}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search resources by title, category, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.membersTable}>
                <thead>
                  <tr>
                    <th>Title &amp; Link</th>
                    <th>Category</th>
                    <th>Tags</th>
                    <th>Submitter</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#71717a" }}>
                        No resources found. Click &quot;Direct Add Resource&quot; to add one.
                      </td>
                    </tr>
                  ) : (
                    filteredResources.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <a
                              href={r.link}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontWeight: 700, color: "#ffffff", textDecoration: "none" }}
                            >
                              {r.title} ↗
                            </a>
                            <span style={{ fontSize: "12px", color: "#a1a1aa", maxWidth: "420px" }}>
                              {r.description || "—"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.divBadge}>{r.category}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: "12px", color: "#d4d4d8" }}>
                            {r.tags?.join(", ") || "—"}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: "#d4d4d8" }}>{r.submitterName || "Advait Core"}</span>
                        </td>
                        <td>
                          <span
                            className={
                              r.status === "approved"
                                ? styles.roleBadgeAdmin
                                : r.status === "pending"
                                ? styles.tabPillAlert
                                : styles.roleBadgeMember
                            }
                          >
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleDeleteResource(r.id, r.title)}
                            className={styles.deleteBtn}
                          >
                            [DELETE]
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── 10. TAB 6: Member Directory & Karma Records ──────────────────── */}
        {activeTab === "members" && (
          <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className={styles.controlsBar}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search members by name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.membersTable}>
                <thead>
                  <tr>
                    <th>Member Details</th>
                    <th>Role</th>
                    <th>Division</th>
                    <th>Academic Record</th>
                    <th>Karma (Points)</th>
                    <th>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id}>
                      {/* Identity */}
                      <td>
                        <div className={styles.memberIdentity}>
                          <div className={styles.avatarCircle}>
                            {member.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={member.avatarUrl}
                                alt={member.name}
                                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                              />
                            ) : (
                              member.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                            )}
                          </div>
                          <div className={styles.memberNameCol}>
                            <span className={styles.memberName}>
                              {member.name}
                              {member.isLeader && (
                                <span title="Core Lead" className={styles.leadStar}>
                                  [LEAD]
                                </span>
                              )}
                            </span>
                            <span className={styles.memberEmail}>{member.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        {member.role === "admin" ? (
                          <span className={styles.roleBadgeAdmin}>ARCHITECT / ADMIN</span>
                        ) : (
                          <span className={styles.roleBadgeMember}>MEMBER</span>
                        )}
                      </td>

                      {/* Division */}
                      <td>
                        {member.divisionName ? (
                          <span className={styles.divBadge}>
                            {member.divisionSlug || member.divisionName}
                            {member.isDivisionLead && (
                              <span title="Division Lead" className={styles.leadStar}>
                                [LEAD]
                              </span>
                            )}
                          </span>
                        ) : (
                          <span style={{ color: "#71717a", fontFamily: "var(--font-mono)" }}>General</span>
                        )}
                      </td>

                      {/* Academic Record */}
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ color: "#d4d4d8", fontSize: "12px" }}>
                            {member.department || "Engineering"}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "11px",
                              color: "#71717a",
                            }}
                          >
                            {member.year || "3rd Year"} · {member.section || "Section A"}
                          </span>
                        </div>
                      </td>

                      {/* Karma / Points */}
                      <td>
                        <span className={styles.pointsBadge}>{member.totalPoints} pts</span>
                      </td>

                      {/* Action */}
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setKarmaTarget(member);
                            setKarmaPoints(25);
                            setKarmaReason("");
                          }}
                          className={styles.awardKarmaBtn}
                        >
                          + Award Karma
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── 16. MODAL: Award Karma Points ───────────────────────────────── */}
        {karmaTarget && (
          <div className={styles.modalOverlay} onClick={() => setKarmaTarget(null)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Award Karma Points</h3>
                <button
                  type="button"
                  onClick={() => setKarmaTarget(null)}
                  className={styles.modalCloseBtn}
                >
                  [CLOSE]
                </button>
              </div>

              <p style={{ color: "#a1a1aa", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                Issue verifiable karma points to <strong>{karmaTarget.name}</strong> (
                {karmaTarget.email}). Current balance: <strong>{karmaTarget.totalPoints} pts</strong>.
              </p>

              <form onSubmit={handleAwardPoints} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Points Delta</label>
                  <input
                    type="number"
                    value={karmaPoints}
                    onChange={(e) => setKarmaPoints(Number(e.target.value))}
                    min={1}
                    max={500}
                    required
                    className={styles.modalInput}
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    {[10, 25, 50, 100].map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => setKarmaPoints(pt)}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          padding: "4px 8px",
                          background: "#27272a",
                          border: "1px solid #3f3f46",
                          color: "#d4d4d8",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        +{pt} pts
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Reason / Milestone Description</label>
                  <textarea
                    rows={3}
                    placeholder="e.g., Shipped AetherSwarm consensus RFC or organized architecture salon"
                    value={karmaReason}
                    onChange={(e) => setKarmaReason(e.target.value)}
                    required
                    className={styles.modalTextarea}
                  />
                </div>

                <button
                  type="submit"
                  disabled={karmaSubmitting}
                  className={styles.modalSubmitBtn}
                >
                  {karmaSubmitting ? "Issuing Transaction..." : `Issue +${karmaPoints} Points to Member`}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
