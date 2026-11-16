"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { CountdownTimer } from "@/components/CountdownTimer";
import { uploadWithSignedUrl } from "@/lib/client-upload";
import styles from "./publish.module.css";

type ContentType = "event" | "news" | "photo" | "gallery" | "blog" | "project" | "resource";

interface ContentTypeOption {
  id: ContentType;
  num: string;
  tag: string;
  label: string;
  desc: string;
  adminOnly?: boolean;
}

const ALL_CONTENT_TYPES: ContentTypeOption[] = [
  {
    id: "event",
    num: "01",
    tag: "[SALON]",
    label: "Event / Salon",
    desc: "Architecture salons, hackathons & keynotes with interactive live countdown.",
    adminOnly: true,
  },
  {
    id: "news",
    num: "02",
    tag: "[NEWS]",
    label: "Official News",
    desc: "Permanent news archive dispatches, protocol updates & announcements.",
    adminOnly: true,
  },
  {
    id: "photo",
    num: "03",
    tag: "[PHOTO]",
    label: "Photo Post",
    desc: "Single high-fidelity visual drop, design essay snapshot, culture highlight.",
    adminOnly: true,
  },
  {
    id: "gallery",
    num: "04",
    tag: "[GALLERY]",
    label: "Photo Gallery",
    desc: "Multi-photo curated album with thumbnail grid & division tags.",
    adminOnly: true,
  },
  {
    id: "blog",
    num: "05",
    tag: "[ESSAY]",
    label: "Technical Essay",
    desc: "Hall of Flames markdown deep dives with code fences & image embeds.",
    adminOnly: false,
  },
  {
    id: "project",
    num: "06",
    tag: "[ARTIFACT]",
    label: "Open Artifact",
    desc: "Repositories, developer tooling, and collective infrastructure.",
    adminOnly: false,
  },
  {
    id: "resource",
    num: "07",
    tag: "[TOOL]",
    label: "Resource / Tool",
    desc: "Curate papers, developer libraries, or architecture frameworks.",
    adminOnly: false,
  },
];

export default function PublishStudioPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [selectedType, setSelectedType] = useState<ContentType>("blog");

  // Form Global States
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successResult, setSuccessResult] = useState<{ title: string; link: string; message: string } | null>(null);
  const [previewMarkdown, setPreviewMarkdown] = useState(false);

  // 01. Event Fields
  const [eventData, setEventData] = useState({
    title: "",
    kind: "salon" as "salon" | "event" | "workshop" | "hackathon",
    location: "Main Auditorium & Online Discord Stage",
    startsAt: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
    endsAt: "",
    imageUrl: "",
    description: "",
  });

  // 02. News Fields
  const [newsData, setNewsData] = useState({
    title: "",
    excerpt: "",
    body: "",
    division: "RED",
    imageUrl: "",
    isPinned: true,
  });

  // 03. Photo Post Fields
  const [photoData, setPhotoData] = useState({
    title: "",
    caption: "",
    divisionId: "",
    imageUrl: "",
  });

  // 04. Gallery Fields
  const [galleryData, setGalleryData] = useState({
    title: "",
    caption: "",
    divisionId: "",
    imageUrls: [] as string[],
  });

  // 05. Blog Fields
  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    bodyMd: "",
    coverImageUrl: "",
    subtopicId: "",
    readTime: "6 min read",
  });

  // 06. Project Fields
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    type: "open_source" as "open_source" | "individual" | "group",
    link: "",
    divisionId: "",
    subtopicId: "",
  });

  // 07. Resource Fields
  const [resourceData, setResourceData] = useState({
    title: "",
    link: "",
    category: "Architecture",
    tags: "webgpu, distributed-systems",
    description: "",
  });

  // Dynamic Options (Divisions & Subtopics)
  const [divisionsList, setDivisionsList] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [subtopicsList, setSubtopicsList] = useState<{ id: string; name: string; scope: string }[]>([]);

  // Drag and drop states
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Check auth session
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setIsLoggedIn(true);
          const adminFlag = data.user.role === "admin";
          setIsAdmin(adminFlag);
          setSelectedType(adminFlag ? "event" : "blog");
        } else {
          setIsLoggedIn(false);
          // Redirect unauthenticated visitors to login
          window.location.href = "/login?redirect=/publish";
        }
      })
      .catch(() => {
        window.location.href = "/login?redirect=/publish";
      })
      .finally(() => setLoadingSession(false));

    // Load divisions and subtopics
    fetch("/api/divisions")
      .then((r) => r.json())
      .then((d) => setDivisionsList(d.divisions || []))
      .catch(() => {});

    fetch("/api/subtopics")
      .then((r) => r.json())
      .then((d) => setSubtopicsList(d.subtopics || []))
      .catch(() => {});
  }, []);

  // Filter content types according to role
  const availableTypes = isAdmin
    ? ALL_CONTENT_TYPES
    : ALL_CONTENT_TYPES.filter((t) => !t.adminOnly);

  // Auto slug generation for blog
  const handleBlogTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setBlogData((prev) => ({ ...prev, title: val, slug }));
  };

  // Image upload handler
  const uploadSingleImage = async (file: File): Promise<string | null> => {
    setUploadingImage(true);
    try {
      const kind =
        selectedType === "gallery" ? "gallery" :
        selectedType === "photo" ? "photo" :
        selectedType === "event" || selectedType === "news" ? "event" :
        "post-cover";

      return await uploadWithSignedUrl(file, kind);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Network error authorizing image upload");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    if (selectedType === "gallery") {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadSingleImage(files[i]);
        if (url) uploadedUrls.push(url);
      }
      setGalleryData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));
    } else {
      const url = await uploadSingleImage(files[0]);
      if (url) {
        if (selectedType === "event") setEventData((prev) => ({ ...prev, imageUrl: url }));
        if (selectedType === "news") setNewsData((prev) => ({ ...prev, imageUrl: url }));
        if (selectedType === "photo") setPhotoData((prev) => ({ ...prev, imageUrl: url }));
        if (selectedType === "blog") setBlogData((prev) => ({ ...prev, coverImageUrl: url }));
      }
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (selectedType === "gallery") {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadSingleImage(files[i]);
        if (url) uploadedUrls.push(url);
      }
      setGalleryData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));
    } else {
      const url = await uploadSingleImage(files[0]);
      if (url) {
        if (selectedType === "event") setEventData((prev) => ({ ...prev, imageUrl: url }));
        if (selectedType === "news") setNewsData((prev) => ({ ...prev, imageUrl: url }));
        if (selectedType === "photo") setPhotoData((prev) => ({ ...prev, imageUrl: url }));
        if (selectedType === "blog") setBlogData((prev) => ({ ...prev, coverImageUrl: url }));
      }
    }
  };

  // Insert markdown helper into blog body
  const insertMarkdown = (syntaxBefore: string, syntaxAfter = "") => {
    setBlogData((prev) => ({
      ...prev,
      bodyMd: prev.bodyMd + syntaxBefore + "text" + syntaxAfter,
    }));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (selectedType === "event") {
        if (!eventData.title.trim()) {
          alert("Event title is required.");
          setSubmitting(false);
          return;
        }
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: eventData.title.trim(),
            description: eventData.description.trim() || undefined,
            kind: eventData.kind,
            location: eventData.location.trim() || undefined,
            startsAt: new Date(eventData.startsAt).toISOString(),
            endsAt: eventData.endsAt ? new Date(eventData.endsAt).toISOString() : undefined,
            status: "upcoming",
            imageUrl: eventData.imageUrl || undefined,
          }),
        });

        if (res.ok) {
          setSuccessResult({
            title: eventData.title,
            link: "/events",
            message: "Event published to official calendar with real-time countdown timer.",
          });
        } else {
          const err = await res.json();
          alert(err.error || "Failed to schedule event.");
        }
      } else if (selectedType === "news") {
        if (!newsData.title.trim()) {
          alert("News headline is required.");
          setSubmitting(false);
          return;
        }

        const evRes = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newsData.title.trim(),
            description: (newsData.excerpt ? `${newsData.excerpt}\n\n` : "") + newsData.body,
            kind: "news",
            startsAt: new Date().toISOString(),
            imageUrl: newsData.imageUrl || undefined,
            status: "upcoming",
          }),
        });

        if (evRes.ok) {
          let mirrorWarning = "";
          if (newsData.imageUrl) {
            const socialRes = await fetch("/api/social-posts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: newsData.title.trim(),
                caption: newsData.excerpt || newsData.body.slice(0, 200),
                type: "news",
                imageUrls: [newsData.imageUrl],
              }),
            });
            if (!socialRes.ok) {
              mirrorWarning = " The event archive was saved, but its Social mirror could not be created.";
            }
          }

          setSuccessResult({
            title: newsData.title,
            link: "/events",
            message: `Official news dispatch permanently archived in Advait News & Events docket.${mirrorWarning}`,
          });
        } else {
          const err = await evRes.json();
          alert(err.error || "Failed to publish news dispatch.");
        }
      } else if (selectedType === "photo") {
        if (!photoData.title.trim() || !photoData.imageUrl) {
          alert("Photo title and image are required.");
          setSubmitting(false);
          return;
        }

        const res = await fetch("/api/social-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: photoData.title.trim(),
            caption: photoData.caption.trim() || undefined,
            type: "photo",
            imageUrls: [photoData.imageUrl],
            divisionId: photoData.divisionId || undefined,
          }),
        });

        if (res.ok) {
          setSuccessResult({
            title: photoData.title,
            link: "/events",
            message: "Photo post successfully published to Advait Social network feed.",
          });
        } else {
          const err = await res.json();
          alert(err.error || "Failed to publish photo post.");
        }
      } else if (selectedType === "gallery") {
        if (!galleryData.title.trim() || galleryData.imageUrls.length === 0) {
          alert("Gallery title and at least one image are required.");
          setSubmitting(false);
          return;
        }

        const res = await fetch("/api/social-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: galleryData.title.trim(),
            caption: galleryData.caption.trim() || undefined,
            type: "gallery",
            imageUrls: galleryData.imageUrls,
            divisionId: galleryData.divisionId || undefined,
          }),
        });

        if (res.ok) {
          setSuccessResult({
            title: galleryData.title,
            link: "/events",
            message: `Photo gallery with ${galleryData.imageUrls.length} pictures published to Advait Social.`,
          });
        } else {
          const err = await res.json();
          alert(err.error || "Failed to publish gallery.");
        }
      } else if (selectedType === "blog") {
        if (!blogData.title.trim() || !blogData.bodyMd.trim()) {
          alert("Title and Markdown body are required.");
          setSubmitting(false);
          return;
        }

        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: blogData.title.trim(),
            slug: blogData.slug.trim(),
            excerpt: blogData.excerpt.trim() || blogData.title,
            bodyMd: blogData.bodyMd.trim(),
            coverImageUrl: blogData.coverImageUrl || undefined,
            subtopicId: blogData.subtopicId || undefined,
            readTime: blogData.readTime || "5 min read",
          }),
        });

        if (res.ok) {
          setSuccessResult({
            title: blogData.title,
            link: `/hall-of-flames/${blogData.slug}`,
            message: isAdmin
              ? "Technical essay published directly to Hall of Flames."
              : "Technical essay submitted to Admin Review Docket (+25 Karma upon approval).",
          });
        } else {
          const err = await res.json();
          alert(err.error || "Failed to submit blog.");
        }
      } else if (selectedType === "project") {
        if (!projectData.name.trim() || !projectData.link.trim()) {
          alert("Project name and repository link are required.");
          setSubmitting(false);
          return;
        }

        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: projectData.name.trim(),
            description: projectData.description.trim() || undefined,
            type: projectData.type,
            link: projectData.link.trim(),
            divisionId: projectData.divisionId || undefined,
            subtopicId: projectData.subtopicId || undefined,
          }),
        });

        if (res.ok) {
          setSuccessResult({
            title: projectData.name,
            link: "/projects",
            message: isAdmin
              ? "Open-source artifact published directly to Projects directory."
              : "Project submitted to Admin Review Docket (+35 Karma upon approval).",
          });
        } else {
          const err = await res.json();
          alert(err.error || "Failed to submit project.");
        }
      } else if (selectedType === "resource") {
        if (!resourceData.title.trim() || !resourceData.link.trim()) {
          alert("Resource title and URL link are required.");
          setSubmitting(false);
          return;
        }

        const res = await fetch("/api/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: resourceData.title.trim(),
            link: resourceData.link.trim(),
            category: resourceData.category,
            tags: resourceData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            description: resourceData.description.trim() || undefined,
          }),
        });

        if (res.ok) {
          setSuccessResult({
            title: resourceData.title,
            link: "/resources",
            message: isAdmin
              ? "Educational resource published directly to library."
              : "Resource submitted to Admin Review Docket (+15 Karma upon approval).",
          });
        } else {
          const err = await res.json();
          alert(err.error || "Failed to submit resource.");
        }
      }
    } catch {
      alert("Network error submitting dispatch.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSession) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#a1a1aa", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
            [AUTHENTICATING BUILDER SESSION...]
          </div>
        </div>
      </main>
    );
  }

  const currentOption = ALL_CONTENT_TYPES.find((t) => t.id === selectedType) || availableTypes[0];

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* ── 01. Studio Header ────────────────────────────────────────────── */}
        <header className={styles.headerBlock}>
          <span className={styles.preHeading}>[UNIFIED PUBLISHING ENGINE]</span>
          <h1 className={styles.mainHeading}>ADVAIT CREATOR STUDIO</h1>
          <p className={styles.subHeading}>
            {isAdmin
              ? "Full architect publishing terminal for technical salons, official announcements, photo albums, essays, and open-source artifacts."
              : "Submit technical essays, open-source repositories, and developer resources to the Advait Collective."}
          </p>
        </header>

        {/* ── 02. Content Type Selector Grid (Role-Filtered) ──────────────── */}
        <section className={styles.typeGrid} role="tablist">
          {availableTypes.map((t) => {
            const isActive = selectedType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setSelectedType(t.id);
                  setSuccessResult(null);
                }}
                className={`${styles.typeCard} ${isActive ? styles.typeCardActive : ""}`}
              >
                <div className={styles.typeTop}>
                  <span className={styles.typeTag}>{t.tag}</span>
                  <span className={styles.typeNum}>[{t.num}]</span>
                </div>
                <div>
                  <span className={styles.typeLabel}>{t.label}</span>
                  <p className={styles.typeDesc}>{t.desc}</p>
                </div>
              </button>
            );
          })}
        </section>

        {/* ── 03. Form Workspace ───────────────────────────────────────────── */}
        {successResult ? (
          <div className={styles.successOverlay}>
            <span className={styles.successTag}>[SUCCESS]</span>
            <h2 className={styles.successTitle}>Dispatch Published Successfully</h2>
            <p className={styles.successDesc}>
              &quot;{successResult.title}&quot; has been processed. {successResult.message}
            </p>
            <div className={styles.successActions}>
              <Link href={successResult.link} className={styles.submitBtn}>
                View on Live Site →
              </Link>
              <button
                type="button"
                onClick={() => setSuccessResult(null)}
                className={styles.resetBtn}
              >
                + Create Another Dispatch
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.formCard}>
            {/* Header info for currently active form */}
            <div className={styles.formSectionHeader}>
              <h2 className={styles.formSectionTitle}>
                <span>{currentOption.label} Dispatch</span>
              </h2>
              <span className={styles.formBadge}>
                {isAdmin ? "DIRECT LIVE PUBLISH" : "PEER REVIEW QUEUE"}
              </span>
            </div>

            {/* ── Type 01: Event / Salon (Admin Only) ──────────────────────── */}
            {selectedType === "event" && isAdmin && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>
                      <span>Event Title</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Technical Salon 06: Decentralized WebGPU & LLM Latency"
                      value={eventData.title}
                      onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Event Kind</label>
                    <select
                      value={eventData.kind}
                      onChange={(e) => setEventData({ ...eventData, kind: e.target.value as any })}
                      className={styles.select}
                    >
                      <option value="salon">Technical Salon</option>
                      <option value="event">Community Gathering</option>
                      <option value="workshop">Hands-on Architecture Workshop</option>
                      <option value="hackathon">Advait Hackathon / Sprint</option>
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Location / Venue</label>
                    <input
                      type="text"
                      placeholder="e.g., Main Campus Auditorium & Online Discord Stage"
                      value={eventData.location}
                      onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>
                      <span>Starts At</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={eventData.startsAt}
                      onChange={(e) => setEventData({ ...eventData, startsAt: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Ends At (Optional)</label>
                    <input
                      type="datetime-local"
                      value={eventData.endsAt}
                      onChange={(e) => setEventData({ ...eventData, endsAt: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Live Real-Time Countdown Preview Widget */}
                {eventData.startsAt && (
                  <div style={{ marginBottom: "24px" }}>
                    <CountdownTimer targetDate={eventData.startsAt} variant="preview" />
                  </div>
                )}

                {/* Cover Image Dropzone */}
                <div className={styles.formFieldFull} style={{ marginBottom: "20px" }}>
                  <label className={styles.label}>Cover Image Banner</label>
                  <div
                    className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className={styles.fileInputHidden}
                    />
                    <span className={styles.dropzoneTag}>[DROP BANNER IMAGE]</span>
                    <span className={styles.dropzonePrompt}>
                      {uploadingImage ? "Uploading to storage..." : "Drag and drop cover banner, or click to browse"}
                    </span>
                    <span className={styles.dropzoneHint}>PNG, JPG, WebP up to 10MB</span>
                  </div>

                  {eventData.imageUrl && (
                    <div className={styles.imagePreviewRow}>
                      <div className={styles.imagePreviewCard} style={{ width: "240px", height: "135px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={eventData.imageUrl} alt="Cover Preview" className={styles.previewImg} />
                        <button
                          type="button"
                          onClick={() => setEventData({ ...eventData, imageUrl: "" })}
                          className={styles.removeImageBtn}
                          title="Remove image"
                        >
                          [REMOVE]
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.formFieldFull}>
                  <label className={styles.label}>Description & Keynote Agenda</label>
                  <textarea
                    rows={4}
                    placeholder="Keynote topics, guest speakers, architectural breakdown, and workshop prerequisites..."
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    className={styles.textarea}
                  />
                </div>
              </>
            )}

            {/* ── Type 02: Official News (Admin Only) ──────────────────────── */}
            {selectedType === "news" && isAdmin && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>
                      <span>Headline</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Advait Protocol v2.4 Upgrade & Autumn Grant Allocations"
                      value={newsData.title}
                      onChange={(e) => setNewsData({ ...newsData, title: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Division Tag</label>
                    <select
                      value={newsData.division}
                      onChange={(e) => setNewsData({ ...newsData, division: e.target.value })}
                      className={styles.select}
                    >
                      <option value="RED">RED — Research & Engineering</option>
                      <option value="OPS">OPS — Operations & Infra</option>
                      <option value="EVED">EVED — Events & Salons</option>
                      <option value="Creatives">Creatives — Design & Media</option>
                      <option value="GameVeda">GameVeda — Interactive Graphics</option>
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Archival Status</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", height: "42px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#38bdf8", fontWeight: 700 }}>
                        [PERMANENT NEWS ARCHIVE — ALWAYS PRESERVED]
                      </span>
                    </div>
                  </div>

                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>Summary / Excerpt</label>
                    <input
                      type="text"
                      placeholder="One-line summary for notification tickers and calendar previews..."
                      value={newsData.excerpt}
                      onChange={(e) => setNewsData({ ...newsData, excerpt: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Banner Upload */}
                <div className={styles.formFieldFull} style={{ marginBottom: "20px" }}>
                  <label className={styles.label}>News Banner Image (Optional)</label>
                  <div
                    className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className={styles.fileInputHidden}
                    />
                    <span className={styles.dropzoneTag}>[DROP BANNER]</span>
                    <span className={styles.dropzonePrompt}>
                      {uploadingImage ? "Uploading banner..." : "Drag and drop news banner image, or click to browse"}
                    </span>
                  </div>

                  {newsData.imageUrl && (
                    <div className={styles.imagePreviewRow}>
                      <div className={styles.imagePreviewCard} style={{ width: "240px", height: "135px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={newsData.imageUrl} alt="News Banner" className={styles.previewImg} />
                        <button
                          type="button"
                          onClick={() => setNewsData({ ...newsData, imageUrl: "" })}
                          className={styles.removeImageBtn}
                        >
                          [REMOVE]
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.formFieldFull}>
                  <label className={styles.label}>Full Announcement Body</label>
                  <textarea
                    rows={6}
                    placeholder="Full announcement transcript, release notes, and action items..."
                    value={newsData.body}
                    onChange={(e) => setNewsData({ ...newsData, body: e.target.value })}
                    className={styles.textarea}
                  />
                </div>
              </>
            )}

            {/* ── Type 03: Photo Post (Admin Only) ─────────────────────────── */}
            {selectedType === "photo" && isAdmin && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>
                      <span>Photo Title</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Salon 05 Backstage: Neural Renderer Live Benchmark"
                      value={photoData.title}
                      onChange={(e) => setPhotoData({ ...photoData, title: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Division / Guild</label>
                    <select
                      value={photoData.divisionId}
                      onChange={(e) => setPhotoData({ ...photoData, divisionId: e.target.value })}
                      className={styles.select}
                    >
                      <option value="">General Collective</option>
                      {divisionsList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>
                      <span>Upload Picture</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <div
                      className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className={styles.fileInputHidden}
                      />
                      <span className={styles.dropzoneTag}>[DROP PHOTOGRAPH]</span>
                      <span className={styles.dropzonePrompt}>
                        {uploadingImage ? "Uploading high-res photo..." : "Drop single photograph here, or click to browse"}
                      </span>
                      <span className={styles.dropzoneHint}>Supports high-resolution PNG, JPG, WebP</span>
                    </div>

                    {photoData.imageUrl && (
                      <div className={styles.imagePreviewRow}>
                        <div className={styles.imagePreviewCard} style={{ width: "220px", height: "140px" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photoData.imageUrl} alt="Uploaded Photo" className={styles.previewImg} />
                          <button
                            type="button"
                            onClick={() => setPhotoData({ ...photoData, imageUrl: "" })}
                            className={styles.removeImageBtn}
                          >
                            [REMOVE]
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>Caption / Story</label>
                    <textarea
                      rows={3}
                      placeholder="Describe the moment, technical milestone, or contributors featured..."
                      value={photoData.caption}
                      onChange={(e) => setPhotoData({ ...photoData, caption: e.target.value })}
                      className={styles.textarea}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── Type 04: Photo Gallery (Admin Only) ───────────────────────── */}
            {selectedType === "gallery" && isAdmin && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>
                      <span>Gallery Title</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Autumn Hackathon 2026: 48 Hours in the Lab"
                      value={galleryData.title}
                      onChange={(e) => setGalleryData({ ...galleryData, title: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Division / Guild</label>
                    <select
                      value={galleryData.divisionId}
                      onChange={(e) => setGalleryData({ ...galleryData, divisionId: e.target.value })}
                      className={styles.select}
                    >
                      <option value="">General Collective</option>
                      {divisionsList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>
                      <span>Upload Multiple Pictures ({galleryData.imageUrls.length} attached)</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <div
                      className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleFileDrop}
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileInputChange}
                        className={styles.fileInputHidden}
                      />
                      <span className={styles.dropzoneTag}>[DROP ALBUM PHOTOS]</span>
                      <span className={styles.dropzonePrompt}>
                        {uploadingImage ? "Uploading photographs..." : "Drop multiple pictures here to create album"}
                      </span>
                      <span className={styles.dropzoneHint}>Select or drag multiple files at once</span>
                    </div>

                    {galleryData.imageUrls.length > 0 && (
                      <div className={styles.imagePreviewRow}>
                        {galleryData.imageUrls.map((url, idx) => (
                          <div key={idx} className={styles.imagePreviewCard}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Gallery pic ${idx + 1}`} className={styles.previewImg} />
                            <button
                              type="button"
                              onClick={() =>
                                setGalleryData((prev) => ({
                                  ...prev,
                                  imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
                                }))
                              }
                              className={styles.removeImageBtn}
                              title="Delete photo"
                            >
                              [REMOVE]
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>Gallery Description</label>
                    <textarea
                      rows={3}
                      placeholder="Album overview, photographer credits, and gathering highlights..."
                      value={galleryData.caption}
                      onChange={(e) => setGalleryData({ ...galleryData, caption: e.target.value })}
                      className={styles.textarea}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── Type 05: Technical Essay / Blog (Available to Users & Admins) */}
            {selectedType === "blog" && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>
                      <span>Essay Title</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Zero-Copy GPU Memory Transfers in WebAssembly Runtimes"
                      value={blogData.title}
                      onChange={(e) => handleBlogTitleChange(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>
                      <span>URL Slug</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="zero-copy-gpu-memory"
                      value={blogData.slug}
                      onChange={(e) => setBlogData({ ...blogData, slug: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Estimated Read Time</label>
                    <input
                      type="text"
                      placeholder="6 min read"
                      value={blogData.readTime}
                      onChange={(e) => setBlogData({ ...blogData, readTime: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Subtopic / Research Area</label>
                    <select
                      value={blogData.subtopicId}
                      onChange={(e) => setBlogData({ ...blogData, subtopicId: e.target.value })}
                      className={styles.select}
                    >
                      <option value="">General Architecture</option>
                      {subtopicsList.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Lead Excerpt</label>
                    <input
                      type="text"
                      placeholder="Concise summary for feed index cards..."
                      value={blogData.excerpt}
                      onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>

                {/* Cover Image */}
                <div className={styles.formFieldFull} style={{ marginBottom: "20px" }}>
                  <label className={styles.label}>Cover Header Image</label>
                  <div
                    className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className={styles.fileInputHidden}
                    />
                    <span className={styles.dropzoneTag}>[DROP COVER BANNER]</span>
                    <span className={styles.dropzonePrompt}>
                      {uploadingImage ? "Uploading cover..." : "Drop essay cover banner or click to browse"}
                    </span>
                  </div>

                  {blogData.coverImageUrl && (
                    <div className={styles.imagePreviewRow}>
                      <div className={styles.imagePreviewCard} style={{ width: "220px", height: "120px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={blogData.coverImageUrl} alt="Blog Cover" className={styles.previewImg} />
                        <button
                          type="button"
                          onClick={() => setBlogData({ ...blogData, coverImageUrl: "" })}
                          className={styles.removeImageBtn}
                        >
                          [REMOVE]
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Markdown Editor with Quick Toolbar & Live Preview Toggle */}
                <div className={styles.formFieldFull}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <label className={styles.label}>
                      <span>Markdown Essay Body</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPreviewMarkdown(!previewMarkdown)}
                      className={styles.toolbarBtn}
                      style={{ color: previewMarkdown ? "#c084fc" : "#a1a1aa" }}
                    >
                      {previewMarkdown ? "[EDIT MARKDOWN]" : "[LIVE PREVIEW]"}
                    </button>
                  </div>

                  {/* Toolbar */}
                  <div className={styles.mdToolbar}>
                    <button type="button" onClick={() => insertMarkdown("**", "**")} className={styles.toolbarBtn}>
                      B
                    </button>
                    <button type="button" onClick={() => insertMarkdown("*", "*")} className={styles.toolbarBtn}>
                      I
                    </button>
                    <button type="button" onClick={() => insertMarkdown("## ")} className={styles.toolbarBtn}>
                      H2
                    </button>
                    <button type="button" onClick={() => insertMarkdown("### ")} className={styles.toolbarBtn}>
                      H3
                    </button>
                    <button type="button" onClick={() => insertMarkdown("`", "`")} className={styles.toolbarBtn}>
                      code
                    </button>
                    <button type="button" onClick={() => insertMarkdown("```typescript\n", "\n```")} className={styles.toolbarBtn}>
                      code block
                    </button>
                    <button type="button" onClick={() => insertMarkdown("> ")} className={styles.toolbarBtn}>
                      quote
                    </button>
                    <button type="button" onClick={() => insertMarkdown("[link title](", ")")} className={styles.toolbarBtn}>
                      link
                    </button>
                    <label className={styles.toolbarBtn} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                      + ATTACH IMAGE
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.fileInputHidden}
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const url = await uploadSingleImage(f);
                            if (url) {
                              setBlogData((prev) => ({
                                ...prev,
                                bodyMd: prev.bodyMd + `\n\n![${f.name}](${url})\n\n`,
                              }));
                            }
                          }
                        }}
                      />
                    </label>
                  </div>

                  {previewMarkdown ? (
                    <div className={styles.mdPreviewContainer}>
                      <ReactMarkdown>{blogData.bodyMd || "*Nothing to preview yet. Write some markdown above.*"}</ReactMarkdown>
                    </div>
                  ) : (
                    <textarea
                      required
                      rows={12}
                      placeholder="# Abstract&#10;&#10;Explain the problem space, architectural constraints, and engineering decisions...&#10;&#10;```typescript&#10;const buffer = device.createBuffer({...});&#10;```"
                      value={blogData.bodyMd}
                      onChange={(e) => setBlogData({ ...blogData, bodyMd: e.target.value })}
                      className={`${styles.textarea} ${styles.mdTextareaWithToolbar}`}
                    />
                  )}
                </div>
              </>
            )}

            {/* ── Type 06: Open Artifact / Project (Available to Users & Admins) */}
            {selectedType === "project" && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>
                      <span>Artifact / Project Name</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., AetherSwarm WebGPU Shading Engine"
                      value={projectData.name}
                      onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>
                      <span>Repository / Project Link</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/advait-collective/project"
                      value={projectData.link}
                      onChange={(e) => setProjectData({ ...projectData, link: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Project Scope</label>
                    <select
                      value={projectData.type}
                      onChange={(e) => setProjectData({ ...projectData, type: e.target.value as any })}
                      className={styles.select}
                    >
                      <option value="open_source">Open Source Collective Artifact</option>
                      <option value="group">Collaborative Guild Project</option>
                      <option value="individual">Individual Research Prototype</option>
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Division</label>
                    <select
                      value={projectData.divisionId}
                      onChange={(e) => setProjectData({ ...projectData, divisionId: e.target.value })}
                      className={styles.select}
                    >
                      <option value="">General Collective</option>
                      {divisionsList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>Architecture Description</label>
                    <textarea
                      rows={4}
                      placeholder="Explain the technical problem, stack (e.g. Rust, WebGPU, Next.js), and architectural capabilities..."
                      value={projectData.description}
                      onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                      className={styles.textarea}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── Type 07: Resource / Tool (Available to Users & Admins) ───── */}
            {selectedType === "resource" && (
              <>
                <div className={styles.formGrid}>
                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>
                      <span>Resource Title</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., WebGPU Explainer & Spec Draft by W3C"
                      value={resourceData.title}
                      onChange={(e) => setResourceData({ ...resourceData, title: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>
                      <span>External URL</span>
                      <span className={styles.labelRequired}>*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://gpuweb.github.io/gpuweb/"
                      value={resourceData.link}
                      onChange={(e) => setResourceData({ ...resourceData, link: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>Category</label>
                    <select
                      value={resourceData.category}
                      onChange={(e) => setResourceData({ ...resourceData, category: e.target.value })}
                      className={styles.select}
                    >
                      <option value="Architecture">Architecture & Systems</option>
                      <option value="Research Papers">Research Papers</option>
                      <option value="Developer Tooling">Developer Tooling</option>
                      <option value="Libraries">Libraries & Frameworks</option>
                      <option value="Learning Paths">Learning Paths</option>
                    </select>
                  </div>

                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>Tags (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="webgpu, shaders, distributed-systems, memory"
                      value={resourceData.tags}
                      onChange={(e) => setResourceData({ ...resourceData, tags: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formFieldFull}>
                    <label className={styles.label}>Description</label>
                    <textarea
                      rows={3}
                      placeholder="Why is this resource valuable for Advait builders? Summary of topics covered..."
                      value={resourceData.description}
                      onChange={(e) => setResourceData({ ...resourceData, description: e.target.value })}
                      className={styles.textarea}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── Footer Actions ───────────────────────────────────────────── */}
            <footer className={styles.formFooter}>
              <span className={styles.footerNote}>
                {isAdmin
                  ? "[DIRECT PUBLISH MODE — All fields write directly to production database]"
                  : "[PEER REVIEW MODE — Submissions enter Admin Docket. Earn Karma upon approval]"}
              </span>

              <div className={styles.footerActions}>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset current form fields?")) {
                      if (selectedType === "event") setEventData({ title: "", kind: "salon", location: "Main Auditorium & Online Discord Stage", startsAt: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16), endsAt: "", imageUrl: "", description: "" });
                      if (selectedType === "news") setNewsData({ title: "", excerpt: "", body: "", division: "RED", imageUrl: "", isPinned: true });
                      if (selectedType === "photo") setPhotoData({ title: "", caption: "", divisionId: "", imageUrl: "" });
                      if (selectedType === "gallery") setGalleryData({ title: "", caption: "", divisionId: "", imageUrls: [] });
                      if (selectedType === "blog") setBlogData({ title: "", slug: "", excerpt: "", bodyMd: "", coverImageUrl: "", subtopicId: "", readTime: "6 min read" });
                      if (selectedType === "project") setProjectData({ name: "", description: "", type: "open_source", link: "", divisionId: "", subtopicId: "" });
                      if (selectedType === "resource") setResourceData({ title: "", link: "", category: "Architecture", tags: "webgpu, distributed-systems", description: "" });
                    }
                  }}
                  className={styles.resetBtn}
                >
                  Clear Fields
                </button>

                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className={styles.submitBtn}
                >
                  {submitting
                    ? "Dispatching..."
                    : isAdmin
                    ? `Publish ${currentOption.label} Live →`
                    : `Submit for Peer Review →`}
                </button>
              </div>
            </footer>
          </form>
        )}
      </div>
    </main>
  );
}
