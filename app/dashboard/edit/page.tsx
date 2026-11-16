"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserProfile,
  DEFAULT_PROFILE,
  loadProfile,
  saveProfile,
  ProjectItem,
  CertificateItem,
} from "@/lib/profile";
import styles from "./edit.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [tagInput, setTagInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Project Form state
  const [newProject, setNewProject] = useState<{
    name: string;
    type: "Open source" | "Individual" | "Group";
    link: string;
    desc: string;
  }>({
    name: "",
    type: "Individual",
    link: "",
    desc: "",
  });
  const [showAddProject, setShowAddProject] = useState(false);

  // New Certificate Form state
  const [newCert, setNewCert] = useState({
    name: "",
    year: "2026",
    issuer: "",
  });
  const [showAddCert, setShowAddCert] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchMe() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          const p = data.profile;
          if (p && isMounted) {
            setProfile((prev) => ({
              ...prev,
              name: p.name || prev.name,
              email: p.email || prev.email,
              headline: p.headline || prev.headline,
              year: p.year || prev.year,
              section: p.section || prev.section,
              department: p.department || prev.department,
              bio: p.bio || prev.bio,
              techTags: p.techStack && p.techStack.length > 0 ? p.techStack : prev.techTags,
              github: p.github || prev.github,
              linkedin: p.linkedin || prev.linkedin,
              portfolio: p.portfolio || prev.portfolio,
            }));
          }
        } else {
          const loaded = loadProfile();
          if (isMounted) setProfile(loaded);
        }
      } catch {
        const loaded = loadProfile();
        if (isMounted) setProfile(loaded);
      }
    }
    fetchMe();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (!profile.techTags.includes(trimmed)) {
      setProfile({
        ...profile,
        techTags: [...profile.techTags, trimmed],
      });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProfile({
      ...profile,
      techTags: profile.techTags.filter((t) => t !== tagToRemove),
    });
  };

  const handleAddQuickTag = (tag: string) => {
    if (!profile.techTags.includes(tag)) {
      setProfile({
        ...profile,
        techTags: [...profile.techTags, tag],
      });
    }
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;
    const item: ProjectItem = {
      id: Date.now().toString(),
      name: newProject.name,
      type: newProject.type,
      link: newProject.link || "https://github.com",
      desc: newProject.desc,
    };
    setProfile({
      ...profile,
      projects: [...profile.projects, item],
    });
    setNewProject({ name: "", type: "Individual", link: "", desc: "" });
    setShowAddProject(false);
  };

  const handleRemoveProject = (id: string) => {
    setProfile({
      ...profile,
      projects: profile.projects.filter((p) => p.id !== id),
    });
  };

  const handleAddCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.name) return;
    const item: CertificateItem = {
      id: Date.now().toString(),
      name: newCert.name,
      year: newCert.year,
      issuer: newCert.issuer || "Advait Collective",
    };
    setProfile({
      ...profile,
      certificates: [...profile.certificates, item],
    });
    setNewCert({ name: "", year: "2026", issuer: "" });
    setShowAddCert(false);
  };

  const handleRemoveCert = (id: string) => {
    setProfile({
      ...profile,
      certificates: profile.certificates.filter((c) => c.id !== id),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          headline: profile.headline,
          bio: profile.bio,
          year: profile.year,
          section: profile.section,
          department: profile.department,
          techStack: profile.techTags,
          github: profile.github,
          linkedin: profile.linkedin,
          portfolio: profile.portfolio,
        }),
      });
    } catch (err) {
      console.error("Save error:", err);
    }
    saveProfile(profile);
    setSaveSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 600);
  };

  const getInitials = (n: string) => {
    return n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <main className={styles.editPage}>
      <div className={styles.container}>
        {/* Top Breadcrumb & Action Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/dashboard" className={styles.backLink}>
              ← Back to profile
            </Link>
            <h1 className={styles.title}>Edit Profile</h1>
            <p className={styles.subtitle}>
              Manage your personal details, academic standing, bio, skills, and portfolio items.
            </p>
          </div>
          <div className={styles.headerRight}>
            <Link href="/dashboard" className={styles.cancelBtn}>
              Cancel
            </Link>
            <button onClick={handleSave} className={styles.saveBtn}>
              {saveSuccess ? "Saved" : "Save Changes"}
            </button>
          </div>
        </header>

        <form onSubmit={handleSave} className={styles.form}>
          {/* ── SECTION 1: BASIC INFO (LinkedIn Intro Style) ──────────────── */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Basic Info</h2>
            <p className={styles.sectionDesc}>
              This will be displayed at the top of your public Advait member profile.
            </p>

            <div className={styles.avatarRow}>
              <div className={styles.avatarPreview}>
                <span>{getInitials(profile.name || "Member")}</span>
              </div>
              <div className={styles.avatarInfo}>
                <span className={styles.avatarLabel}>Profile Avatar</span>
                <span className={styles.avatarSub}>
                  Generated from your full name initials.
                </span>
              </div>
            </div>

            <div className={styles.fieldGrid}>
              <div className={styles.fieldFull}>
                <label>Full Name *</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Bivash Kumar"
                  required
                />
              </div>

              <div className={styles.fieldFull}>
                <label>Headline</label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) =>
                    setProfile({ ...profile, headline: e.target.value })
                  }
                  placeholder="e.g. Systems & AI Researcher · Member at Advait Collective"
                />
              </div>

              <div className={styles.fieldHalf}>
                <label>Year</label>
                <input
                  type="text"
                  value={profile.year}
                  onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                  placeholder="e.g. 3rd Year"
                />
              </div>

              <div className={styles.fieldHalf}>
                <label>Section</label>
                <input
                  type="text"
                  value={profile.section}
                  onChange={(e) =>
                    setProfile({ ...profile, section: e.target.value })
                  }
                  placeholder="e.g. Section B"
                />
              </div>

              <div className={styles.fieldFull}>
                <label>Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) =>
                    setProfile({ ...profile, department: e.target.value })
                  }
                  placeholder="e.g. Computer Science & Engineering"
                />
              </div>
            </div>
          </section>

          {/* ── SECTION 2: ABOUT / BIO ────────────────────────────────────── */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>About</h2>
            <p className={styles.sectionDesc}>
              Write a short summary about yourself, what you are building, research interests, and goals.
            </p>

            <div className={styles.fieldFull}>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="A short bio: interests, goals, what you build..."
              />
            </div>
          </section>

          {/* ── SECTION 3: SKILLS & TECH STACK ────────────────────────────── */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Skills &amp; Tech Stack</h2>
            <p className={styles.sectionDesc}>
              Add technologies, languages, and frameworks you work with.
            </p>

            <div className={styles.tagsContainer}>
              {profile.techTags.map((tag) => (
                <span key={tag} className={styles.tagPill}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className={styles.removeTagBtn}
                    title="Remove skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className={styles.addTagInputRow}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a skill and press Enter..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={styles.addTagBtn}
              >
                + Add
              </button>
            </div>

            <div className={styles.quickTagsGroup}>
              <span className={styles.quickTagsLabel}>Quick suggestions:</span>
              {["Next.js", "Rust", "Python", "PyTorch", "Docker", "TypeScript", "CUDA", "Go"].map(
                (qt) => (
                  <button
                    type="button"
                    key={qt}
                    onClick={() => handleAddQuickTag(qt)}
                    className={styles.quickTagBtn}
                  >
                    + {qt}
                  </button>
                )
              )}
            </div>
          </section>

          {/* ── SECTION 4: PROJECTS (LinkedIn Featured / Projects) ─────────── */}
          <section className={styles.card}>
            <div className={styles.cardTitleRow}>
              <div>
                <h2 className={styles.sectionTitle}>Projects</h2>
                <p className={styles.sectionDesc}>
                  Showcase projects and repositories you have created or contributed to.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProject(!showAddProject)}
                className={styles.addItemBtn}
              >
                {showAddProject ? "Cancel" : "+ Add Project"}
              </button>
            </div>

            {/* Current Projects List */}
            <div className={styles.itemsList}>
              {profile.projects.map((proj) => (
                <div key={proj.id} className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <div className={styles.itemTitleGroup}>
                      <span className={styles.itemName}>{proj.name}</span>
                      <span className={styles.itemBadge}>{proj.type}</span>
                    </div>
                    {proj.desc && <p className={styles.itemSummary}>{proj.desc}</p>}
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.itemExternalLink}
                    >
                      {proj.link} ↗
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(proj.id)}
                    className={styles.itemDeleteBtn}
                    title="Remove project"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Inline Add Project Form */}
            {showAddProject && (
              <div className={styles.inlineFormBox}>
                <h3 className={styles.inlineFormHeading}>New Project</h3>
                <div className={styles.fieldGrid}>
                  <div className={styles.fieldHalf}>
                    <label>Project Name *</label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                      placeholder="e.g. AetherSwarm Engine"
                      required
                    />
                  </div>

                  <div className={styles.fieldHalf}>
                    <label>Project Type</label>
                    <select
                      value={newProject.type}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          type: e.target.value as "Open source" | "Individual" | "Group",
                        })
                      }
                    >
                      <option value="Individual">Individual</option>
                      <option value="Open source">Open source</option>
                      <option value="Group">Group</option>
                    </select>
                  </div>

                  <div className={styles.fieldFull}>
                    <label>GitHub or Project Link</label>
                    <input
                      type="url"
                      value={newProject.link}
                      onChange={(e) =>
                        setNewProject({ ...newProject, link: e.target.value })
                      }
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className={styles.fieldFull}>
                    <label>Short Description</label>
                    <input
                      type="text"
                      value={newProject.desc}
                      onChange={(e) =>
                        setNewProject({ ...newProject, desc: e.target.value })
                      }
                      placeholder="e.g. Distributed multi-agent framework for edge nodes."
                    />
                  </div>
                </div>

                <div className={styles.inlineFormActions}>
                  <button
                    type="button"
                    onClick={() => setShowAddProject(false)}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddProjectSubmit}
                    className={styles.saveBtn}
                  >
                    Add Project
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ── SECTION 5: CERTIFICATES & LICENSES ─────────────────────────── */}
          <section className={styles.card}>
            <div className={styles.cardTitleRow}>
              <div>
                <h2 className={styles.sectionTitle}>Certificates</h2>
                <p className={styles.sectionDesc}>
                  Add certifications, hackathon awards, and verified achievements.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCert(!showAddCert)}
                className={styles.addItemBtn}
              >
                {showAddCert ? "Cancel" : "+ Add Certificate"}
              </button>
            </div>

            <div className={styles.itemsList}>
              {profile.certificates.map((cert) => (
                <div key={cert.id} className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.itemName}>{cert.name}</span>
                    <span className={styles.itemSubtext}>
                      {cert.issuer ? `${cert.issuer} · ` : ""}
                      {cert.year}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCert(cert.id)}
                    className={styles.itemDeleteBtn}
                    title="Remove certificate"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Inline Add Certificate Form */}
            {showAddCert && (
              <div className={styles.inlineFormBox}>
                <h3 className={styles.inlineFormHeading}>New Certificate</h3>
                <div className={styles.fieldGrid}>
                  <div className={styles.fieldHalf}>
                    <label>Certificate Title *</label>
                    <input
                      type="text"
                      value={newCert.name}
                      onChange={(e) =>
                        setNewCert({ ...newCert, name: e.target.value })
                      }
                      placeholder="e.g. AWS Certified Solutions Architect"
                      required
                    />
                  </div>

                  <div className={styles.fieldHalf}>
                    <label>Year</label>
                    <input
                      type="text"
                      value={newCert.year}
                      onChange={(e) =>
                        setNewCert({ ...newCert, year: e.target.value })
                      }
                      placeholder="2026"
                    />
                  </div>

                  <div className={styles.fieldFull}>
                    <label>Issuing Organization</label>
                    <input
                      type="text"
                      value={newCert.issuer}
                      onChange={(e) =>
                        setNewCert({ ...newCert, issuer: e.target.value })
                      }
                      placeholder="e.g. Amazon Web Services / Advait"
                    />
                  </div>
                </div>

                <div className={styles.inlineFormActions}>
                  <button
                    type="button"
                    onClick={() => setShowAddCert(false)}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCertSubmit}
                    className={styles.saveBtn}
                  >
                    Add Certificate
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ── SECTION 6: CONTACT & WEB LINKS ────────────────────────────── */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Contact &amp; Links</h2>
            <p className={styles.sectionDesc}>
              Provide social channels and links where members can find your work.
            </p>

            <div className={styles.fieldGrid}>
              <div className={styles.fieldHalf}>
                <label>GitHub Profile</label>
                <input
                  type="url"
                  value={profile.github}
                  onChange={(e) =>
                    setProfile({ ...profile, github: e.target.value })
                  }
                  placeholder="https://github.com/username"
                />
              </div>

              <div className={styles.fieldHalf}>
                <label>LinkedIn Profile</label>
                <input
                  type="url"
                  value={profile.linkedin}
                  onChange={(e) =>
                    setProfile({ ...profile, linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className={styles.fieldFull}>
                <label>Portfolio / Personal Website</label>
                <input
                  type="url"
                  value={profile.portfolio}
                  onChange={(e) =>
                    setProfile({ ...profile, portfolio: e.target.value })
                  }
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </section>

          {/* ── STICKY BOTTOM ACTIONS (FLOATING PILL) ────────────────────── */}
          <div className={styles.stickyBottomBar}>
            <div className={styles.stickyInner}>
              <div className={styles.noticeGroup}>
                <span className={styles.noticeDot} />
                <span className={styles.unsavedNotice}>
                  Save your changes before leaving
                </span>
              </div>
              <div className={styles.stickyActions}>
                <Link href="/dashboard" className={styles.cancelBtn}>
                  Cancel
                </Link>
                <button type="submit" className={styles.saveBtn}>
                  {saveSuccess ? "Saved" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
