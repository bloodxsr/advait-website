import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── 01. Divisions ──────────────────────────────────────────
export const divisions = pgTable("divisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // RED, OPS, EVED, Creatives, GameVeda
  badge: text("badge").notNull(),
  desc: text("desc").notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const divisionsRelations = relations(divisions, ({ many }) => ({
  users: many(users),
  projects: many(projects),
}));

// ── 02. Users & Members ────────────────────────────────────
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").default("user").notNull(), // 'user' | 'admin'
    headline: text("headline"),
    year: text("year"), // e.g. "3rd Year"
    section: text("section"), // e.g. "Section B"
    department: text("department"), // e.g. "Computer Science & Engineering"
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    techStack: text("tech_stack").array().notNull().default([]), // text[]
    github: text("github"),
    linkedin: text("linkedin"),
    portfolio: text("portfolio"),
    divisionId: uuid("division_id").references(() => divisions.id, { onDelete: "set null" }),
    isDivisionLead: boolean("is_division_lead").default(false).notNull(),
    isLeader: boolean("is_leader").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_division_idx").on(table.divisionId),
  ]
);

export const usersRelations = relations(users, ({ one, many }) => ({
  division: one(divisions, {
    fields: [users.divisionId],
    references: [divisions.id],
  }),
  profileSections: many(profileSections),
  posts: many(posts),
  projectMemberships: many(projectMembers),
  submittedResources: many(resources),
  pointsEntries: many(pointsEntries),
}));

// ── 03. Profile Sections ───────────────────────────────────
export const profileSections = pgTable(
  "profile_sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    type: text("type").notNull(), // 'about' | 'projects' | 'research' | 'certificates' | 'blog'
    title: text("title").notNull(),
    content: jsonb("content").notNull(), // flexible JSON data structure per type
    position: integer("position").default(0).notNull(),
    visible: boolean("visible").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("profile_sections_user_pos_idx").on(table.userId, table.position),
  ]
);

export const profileSectionsRelations = relations(profileSections, ({ one }) => ({
  user: one(users, {
    fields: [profileSections.userId],
    references: [users.id],
  }),
}));

// ── 04. Subtopics (Categories) ─────────────────────────────
export const subtopics = pgTable(
  "subtopics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    scope: text("scope").notNull(), // 'post' | 'project'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("subtopics_scope_name_idx").on(table.scope, table.name),
  ]
);

export const subtopicsRelations = relations(subtopics, ({ many }) => ({
  posts: many(posts),
  projects: many(projects),
}));

// ── 05. Posts (Hall of Flames) ─────────────────────────────
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    bodyMd: text("body_md").notNull(), // Markdown body
    coverImageUrl: text("cover_image_url"),
    subtopicId: uuid("subtopic_id").references(() => subtopics.id, { onDelete: "set null" }),
    authorId: uuid("author_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    status: text("status").default("pending").notNull(), // 'pending' | 'approved' | 'rejected'
    reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
    reviewNote: text("review_note"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    readTime: text("read_time").default("5 min read"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("posts_status_created_idx").on(table.status, table.createdAt),
    index("posts_subtopic_created_idx").on(table.subtopicId, table.createdAt),
    index("posts_author_idx").on(table.authorId),
  ]
);

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [posts.reviewedBy],
    references: [users.id],
  }),
  subtopic: one(subtopics, {
    fields: [posts.subtopicId],
    references: [subtopics.id],
  }),
}));

// ── 06. Projects ───────────────────────────────────────────
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    type: text("type").notNull(), // 'open_source' | 'individual' | 'group'
    link: text("link").notNull(),
    subtopicId: uuid("subtopic_id").references(() => subtopics.id, { onDelete: "set null" }),
    divisionId: uuid("division_id").references(() => divisions.id, { onDelete: "set null" }),
    leadId: uuid("lead_id").references(() => users.id, { onDelete: "set null" }),
    status: text("status").default("pending").notNull(), // 'pending' | 'approved' | 'rejected'
    reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
    reviewNote: text("review_note"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("projects_status_created_idx").on(table.status, table.createdAt),
    index("projects_type_created_idx").on(table.type, table.createdAt),
    index("projects_division_idx").on(table.divisionId),
  ]
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  subtopic: one(subtopics, {
    fields: [projects.subtopicId],
    references: [subtopics.id],
  }),
  division: one(divisions, {
    fields: [projects.divisionId],
    references: [divisions.id],
  }),
  lead: one(users, {
    fields: [projects.leadId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [projects.reviewedBy],
    references: [users.id],
  }),
  members: many(projectMembers),
}));

export const projectMembers = pgTable(
  "project_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role").default("Contributor").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("project_members_unique_idx").on(table.projectId, table.userId),
    index("project_members_user_idx").on(table.userId),
  ]
);

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

// ── 07. Educational Resources ──────────────────────────────
export const resources = pgTable(
  "resources",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    link: text("link").notNull(),
    category: text("category").default("General").notNull(),
    tags: text("tags").array().notNull().default([]), // text[]
    status: text("status").default("pending").notNull(), // 'pending' | 'approved' | 'rejected'
    submittedBy: uuid("submitted_by")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
    reviewNote: text("review_note"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("resources_status_created_idx").on(table.status, table.createdAt),
    index("resources_submitted_by_idx").on(table.submittedBy),
  ]
);

export const resourcesRelations = relations(resources, ({ one }) => ({
  submitter: one(users, {
    fields: [resources.submittedBy],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [resources.reviewedBy],
    references: [users.id],
  }),
}));

// ── 08. Research Papers ────────────────────────────────────
export const papers = pgTable("papers", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  abstract: text("abstract"),
  url: text("url").notNull(),
  authors: text("authors").notNull(),
  venue: text("venue"),
  tags: text("tags").array().notNull().default([]),
  date: text("date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── 09. Events & News ──────────────────────────────────────
export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    kind: text("kind").default("event").notNull(), // 'event' | 'news' | 'salon'
    imageUrl: text("image_url"),
    location: text("location"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    status: text("status").default("upcoming").notNull(), // 'upcoming' | 'completed' | 'cancelled'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("events_kind_starts_idx").on(table.kind, table.startsAt),
  ]
);

// ── 10. Social Links ───────────────────────────────────────
export const socialLinks = pgTable("social_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  platform: text("platform").notNull().unique(), // instagram, github, twitter, discord, youtube, etc.
  title: text("title").notNull(),
  url: text("url").notNull(),
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── 11. Points Entries (Ledger) ────────────────────────────
export const pointsEntries = pgTable(
  "points_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    points: integer("points").notNull(),
    reason: text("reason").notNull(),
    sourceType: text("source_type").notNull(), // 'project' | 'post' | 'resource' | 'admin' | 'hackathon'
    sourceId: text("source_id"), // e.g. project_id, post_id, resource_id
    awardedBy: uuid("awarded_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("points_entries_user_idx").on(table.userId),
    uniqueIndex("points_entries_source_unique_idx").on(
      table.userId,
      table.sourceType,
      table.sourceId
    ),
  ]
);

export const pointsEntriesRelations = relations(pointsEntries, ({ one }) => ({
  user: one(users, {
    fields: [pointsEntries.userId],
    references: [users.id],
  }),
}));

// ── 12. Advait Social Posts & Photo Galleries ───────────────
export const socialPosts = pgTable(
  "social_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    caption: text("caption"),
    type: text("type").default("photo").notNull(), // 'photo' | 'gallery' | 'news'
    imageUrls: text("image_urls").array().notNull().default([]),
    divisionId: uuid("division_id").references(() => divisions.id, { onDelete: "set null" }),
    authorId: uuid("author_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("social_posts_created_idx").on(table.createdAt),
    index("social_posts_division_idx").on(table.divisionId),
  ]
);

export const socialPostsRelations = relations(socialPosts, ({ one }) => ({
  division: one(divisions, {
    fields: [socialPosts.divisionId],
    references: [divisions.id],
  }),
  author: one(users, {
    fields: [socialPosts.authorId],
    references: [users.id],
  }),
}));
