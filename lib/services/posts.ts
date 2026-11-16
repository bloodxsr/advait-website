import { db } from "@/lib/db";
import { posts, users, subtopics, pointsEntries } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { z } from "zod";
import type { createPostSchema } from "@/lib/validators/posts";

export async function getPosts(subtopicSlug?: string, status = "approved", limit = 50) {
  const conditions = [];

  // Public users only see approved posts
  if (status && status !== "all") {
    conditions.push(eq(posts.status, status));
  }

  if (subtopicSlug && subtopicSlug !== "all") {
    conditions.push(eq(subtopics.slug, subtopicSlug));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      bodyMd: posts.bodyMd,
      coverImageUrl: posts.coverImageUrl,
      readTime: posts.readTime,
      status: posts.status,
      reviewNote: posts.reviewNote,
      createdAt: posts.createdAt,
      subtopicId: subtopics.id,
      subtopicName: subtopics.name,
      subtopicSlug: subtopics.slug,
      authorId: users.id,
      authorName: users.name,
      authorEmail: users.email,
      authorAvatar: users.avatarUrl,
      authorRole: users.headline,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(subtopics, eq(posts.subtopicId, subtopics.id))
    .where(whereClause)
    .orderBy(desc(posts.createdAt))
    .limit(limit);
}

export async function getPostBySlug(slug: string) {
  const [post] = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      bodyMd: posts.bodyMd,
      coverImageUrl: posts.coverImageUrl,
      readTime: posts.readTime,
      status: posts.status,
      createdAt: posts.createdAt,
      subtopicName: subtopics.name,
      subtopicSlug: subtopics.slug,
      authorId: users.id,
      authorName: users.name,
      authorAvatar: users.avatarUrl,
      authorHeadline: users.headline,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(subtopics, eq(posts.subtopicId, subtopics.id))
    .where(eq(posts.slug, slug))
    .limit(1);

  return post || null;
}

export async function getPendingPosts() {
  return await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      bodyMd: posts.bodyMd,
      coverImageUrl: posts.coverImageUrl,
      readTime: posts.readTime,
      status: posts.status,
      createdAt: posts.createdAt,
      subtopicId: subtopics.id,
      subtopicName: subtopics.name,
      subtopicSlug: subtopics.slug,
      authorId: users.id,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(subtopics, eq(posts.subtopicId, subtopics.id))
    .where(eq(posts.status, "pending"))
    .orderBy(desc(posts.createdAt));
}

export async function createPost(
  authorId: string,
  input: z.infer<typeof createPostSchema>,
  isAdmin = false
) {
  const status = isAdmin ? "approved" : "pending";

  // Generate unique slug
  const baseSlug = input.title
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
    .slice(0, 60);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  return await db.transaction(async (tx) => {
    const [newPost] = await tx
      .insert(posts)
      .values({
        slug,
        title: input.title,
        excerpt: input.excerpt || null,
        bodyMd: input.bodyMd,
        coverImageUrl: input.coverImageUrl || null,
        subtopicId: input.subtopicId || null,
        authorId,
        readTime: input.readTime || "5 min read",
        status,
      })
      .returning();

    // If published by admin, award 25 points immediately
    if (status === "approved") {
      await tx.insert(pointsEntries).values({
        userId: authorId,
        points: 25,
        reason: `Published Hall of Flames dispatch: "${input.title}"`,
        sourceType: "post",
        sourceId: newPost.id,
      });
    }

    return newPost;
  });
}

export async function reviewPost(
  adminId: string,
  postId: string,
  input: { decision: "approved" | "rejected"; note?: string }
) {
  return await db.transaction(async (tx) => {
    const [row] = await tx
      .update(posts)
      .set({
        status: input.decision,
        reviewedBy: adminId,
        reviewNote: input.note || null,
        reviewedAt: new Date(),
      })
      .where(and(eq(posts.id, postId), eq(posts.status, "pending")))
      .returning();

    if (!row) {
      throw new Error("ALREADY_REVIEWED");
    }

    // Award 25 points when approved
    if (input.decision === "approved") {
      await tx
        .insert(pointsEntries)
        .values({
          userId: row.authorId,
          points: 25,
          reason: `Hall of Flames dispatch approved & published: "${row.title}"`,
          sourceType: "post",
          sourceId: row.id,
          awardedBy: adminId,
        })
        .onConflictDoNothing();
    }

    return row;
  });
}

export async function deletePost(idOrSlug: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  const condition = isUuid ? eq(posts.id, idOrSlug) : eq(posts.slug, idOrSlug);

  const [deleted] = await db
    .delete(posts)
    .where(condition)
    .returning();

  return deleted || null;
}
