import { db } from "@/lib/db";
import { projects, projectMembers, users, divisions, subtopics, pointsEntries } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { z } from "zod";
import type { createProjectSchema } from "@/lib/validators/projects";

export interface ProjectFilter {
  type?: string;
  subtopic?: string;
  division?: string;
  status?: string;
  limit?: number;
}

export async function getProjects(filter: ProjectFilter = {}) {
  const { type, subtopic, division, status = "approved", limit = 100 } = filter;
  const conditions = [];

  // Unless 'all' is specifically requested by admin, only show approved projects publicly
  if (status && status !== "all") {
    conditions.push(eq(projects.status, status));
  }

  if (type && type !== "all") {
    conditions.push(eq(projects.type, type));
  }

  if (division && division !== "all") {
    conditions.push(eq(divisions.slug, division));
  }

  if (subtopic && subtopic !== "all") {
    conditions.push(eq(subtopics.slug, subtopic));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const projectList = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      type: projects.type,
      link: projects.link,
      status: projects.status,
      reviewNote: projects.reviewNote,
      createdAt: projects.createdAt,
      divisionId: divisions.id,
      divisionName: divisions.name,
      divisionSlug: divisions.slug,
      subtopicName: subtopics.name,
      leadId: users.id,
      leadName: users.name,
      leadAvatar: users.avatarUrl,
      leadEmail: users.email,
    })
    .from(projects)
    .leftJoin(divisions, eq(projects.divisionId, divisions.id))
    .leftJoin(subtopics, eq(projects.subtopicId, subtopics.id))
    .leftJoin(users, eq(projects.leadId, users.id))
    .where(whereClause)
    .orderBy(desc(projects.createdAt))
    .limit(limit);

  return projectList;
}

export async function getPendingProjects() {
  return await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      type: projects.type,
      link: projects.link,
      status: projects.status,
      createdAt: projects.createdAt,
      divisionId: divisions.id,
      divisionName: divisions.name,
      divisionSlug: divisions.slug,
      subtopicName: subtopics.name,
      leadId: users.id,
      leadName: users.name,
      leadEmail: users.email,
    })
    .from(projects)
    .leftJoin(divisions, eq(projects.divisionId, divisions.id))
    .leftJoin(subtopics, eq(projects.subtopicId, subtopics.id))
    .leftJoin(users, eq(projects.leadId, users.id))
    .where(eq(projects.status, "pending"))
    .orderBy(desc(projects.createdAt));
}

export async function createProject(
  userId: string,
  input: z.infer<typeof createProjectSchema>,
  isAdmin = false
) {
  const status = isAdmin ? "approved" : "pending";

  return await db.transaction(async (tx) => {
    const [project] = await tx
      .insert(projects)
      .values({
        name: input.name,
        description: input.description || null,
        type: input.type,
        link: input.link,
        subtopicId: input.subtopicId || null,
        divisionId: input.divisionId || null,
        leadId: userId,
        status,
      })
      .returning();

    // Add creator as lead member
    await tx.insert(projectMembers).values({
      projectId: project.id,
      userId,
      role: "Lead",
    });

    // If approved immediately (admin creation), award karma points
    if (status === "approved") {
      await tx.insert(pointsEntries).values({
        userId,
        points: 15,
        reason: `Published project: "${input.name}"`,
        sourceType: "project",
        sourceId: project.id,
      });
    }

    return project;
  });
}

export async function reviewProject(
  adminId: string,
  projectId: string,
  input: { decision: "approved" | "rejected"; note?: string }
) {
  return await db.transaction(async (tx) => {
    const [row] = await tx
      .update(projects)
      .set({
        status: input.decision,
        reviewedBy: adminId,
        reviewNote: input.note || null,
        reviewedAt: new Date(),
      })
      .where(and(eq(projects.id, projectId), eq(projects.status, "pending")))
      .returning();

    if (!row) {
      throw new Error("ALREADY_REVIEWED");
    }

    // When approved, award 15 points to the author
    if (input.decision === "approved" && row.leadId) {
      await tx
        .insert(pointsEntries)
        .values({
          userId: row.leadId,
          points: 15,
          reason: `Project approved and published: "${row.name}"`,
          sourceType: "project",
          sourceId: row.id,
          awardedBy: adminId,
        })
        .onConflictDoNothing();
    }

    return row;
  });
}

export async function deleteProject(id: string) {
  const [deleted] = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning();

  return deleted || null;
}
