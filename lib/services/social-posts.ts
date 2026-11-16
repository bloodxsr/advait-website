import { db } from "@/lib/db";
import { socialPosts, users, divisions } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export interface CreateSocialPostInput {
  title: string;
  caption?: string;
  type: "photo" | "gallery" | "news";
  imageUrls: string[];
  divisionId?: string;
}

export async function getSocialPosts(type?: string, divisionSlug?: string, limit = 50, offset = 0) {
  const conditions = [];

  if (type && type !== "all") {
    conditions.push(eq(socialPosts.type, type));
  }

  if (divisionSlug && divisionSlug !== "all") {
    conditions.push(eq(divisions.slug, divisionSlug));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return await db
    .select({
      id: socialPosts.id,
      title: socialPosts.title,
      caption: socialPosts.caption,
      type: socialPosts.type,
      imageUrls: socialPosts.imageUrls,
      divisionId: socialPosts.divisionId,
      divisionName: divisions.name,
      divisionSlug: divisions.slug,
      authorName: users.name,
      authorAvatar: users.avatarUrl,
      createdAt: socialPosts.createdAt,
    })
    .from(socialPosts)
    .leftJoin(divisions, eq(socialPosts.divisionId, divisions.id))
    .leftJoin(users, eq(socialPosts.authorId, users.id))
    .where(whereClause)
    .orderBy(desc(socialPosts.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createSocialPost(authorId: string, input: CreateSocialPostInput) {
  const [created] = await db
    .insert(socialPosts)
    .values({
      title: input.title,
      caption: input.caption || null,
      type: input.type,
      imageUrls: input.imageUrls,
      divisionId: input.divisionId || null,
      authorId,
    })
    .returning();

  return created;
}

export async function deleteSocialPost(id: string) {
  const [deleted] = await db
    .delete(socialPosts)
    .where(eq(socialPosts.id, id))
    .returning();

  return deleted || null;
}
