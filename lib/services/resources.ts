import { db } from "@/lib/db";
import { resources, users, pointsEntries } from "@/db/schema";
import { eq, desc, or, and } from "drizzle-orm";
import type { z } from "zod";
import type { createResourceSchema, reviewResourceSchema } from "@/lib/validators/resources";

export async function getResources(currentUserId?: string) {
  // Public users see 'approved' only.
  // Logged-in users see all 'approved' PLUS their own submissions (pending or rejected).
  let whereClause;
  if (currentUserId) {
    whereClause = or(
      eq(resources.status, "approved"),
      eq(resources.submittedBy, currentUserId)
    );
  } else {
    whereClause = eq(resources.status, "approved");
  }

  return await db
    .select({
      id: resources.id,
      title: resources.title,
      description: resources.description,
      link: resources.link,
      category: resources.category,
      tags: resources.tags,
      status: resources.status,
      reviewNote: resources.reviewNote,
      createdAt: resources.createdAt,
      submitterName: users.name,
      submitterAvatar: users.avatarUrl,
    })
    .from(resources)
    .leftJoin(users, eq(resources.submittedBy, users.id))
    .where(whereClause)
    .orderBy(desc(resources.createdAt));
}

export async function getPendingResources() {
  return await db
    .select({
      id: resources.id,
      title: resources.title,
      description: resources.description,
      link: resources.link,
      category: resources.category,
      tags: resources.tags,
      status: resources.status,
      createdAt: resources.createdAt,
      submitterId: users.id,
      submitterName: users.name,
      submitterEmail: users.email,
    })
    .from(resources)
    .leftJoin(users, eq(resources.submittedBy, users.id))
    .where(eq(resources.status, "pending"))
    .orderBy(desc(resources.createdAt));
}

export async function submitResource(
  userId: string,
  input: z.infer<typeof createResourceSchema>,
  isAdmin = false
) {
  const status = isAdmin ? "approved" : "pending";

  return await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(resources)
      .values({
        title: input.title,
        description: input.description || null,
        link: input.link,
        category: input.category || "General",
        tags: input.tags || [],
        status,
        submittedBy: userId,
      })
      .returning();

    if (status === "approved") {
      await tx.insert(pointsEntries).values({
        userId,
        points: 3,
        reason: `Added library resource: "${input.title}"`,
        sourceType: "resource",
        sourceId: created.id,
      });
    }

    return created;
  });
}

export async function deleteResource(id: string) {
  const [deleted] = await db
    .delete(resources)
    .where(eq(resources.id, id))
    .returning();

  return deleted || null;
}

export async function reviewResource(
  adminId: string,
  resourceId: string,
  input: z.infer<typeof reviewResourceSchema>
) {
  return await db.transaction(async (tx) => {
    // Atomic update guarded by status = 'pending'
    const [row] = await tx
      .update(resources)
      .set({
        status: input.decision,
        reviewedBy: adminId,
        reviewNote: input.note || null,
        reviewedAt: new Date(),
      })
      .where(and(eq(resources.id, resourceId), eq(resources.status, "pending")))
      .returning();

    if (!row) {
      throw new Error("ALREADY_REVIEWED");
    }

    // If approved, award 3 points to the submitter
    if (input.decision === "approved") {
      await tx
        .insert(pointsEntries)
        .values({
          userId: row.submittedBy,
          points: 3,
          reason: `Educational resource approved: "${row.title}"`,
          sourceType: "resource",
          sourceId: row.id,
          awardedBy: adminId,
        })
        .onConflictDoNothing();
    }

    return row;
  });
}
