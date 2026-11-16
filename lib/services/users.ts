import { db } from "@/lib/db";
import { users, divisions, pointsEntries, profileSections } from "@/db/schema";
import { eq, sql, asc } from "drizzle-orm";
import type { z } from "zod";
import type { updateProfileSchema, profileSectionSchema } from "@/lib/validators/users";

export async function getUserProfile(userId: string) {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      headline: users.headline,
      year: users.year,
      section: users.section,
      department: users.department,
      bio: users.bio,
      avatarUrl: users.avatarUrl,
      techStack: users.techStack,
      github: users.github,
      linkedin: users.linkedin,
      portfolio: users.portfolio,
      divisionId: users.divisionId,
      divisionName: divisions.name,
      divisionSlug: divisions.slug,
      isDivisionLead: users.isDivisionLead,
      isLeader: users.isLeader,
      createdAt: users.createdAt,
      totalPoints: sql<number>`coalesce(sum(${pointsEntries.points}), 0)::int`,
    })
    .from(users)
    .leftJoin(divisions, eq(users.divisionId, divisions.id))
    .leftJoin(pointsEntries, eq(users.id, pointsEntries.userId))
    .where(eq(users.id, userId))
    .groupBy(users.id, divisions.name, divisions.slug);

  if (!user) return null;

  // Get profile sections
  const sections = await db
    .select()
    .from(profileSections)
    .where(eq(profileSections.userId, userId))
    .orderBy(asc(profileSections.position));

  return {
    ...user,
    sections,
  };
}

export async function updateUserProfile(userId: string, input: z.infer<typeof updateProfileSchema>) {
  const [updated] = await db
    .update(users)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return updated || null;
}

export async function getUserSections(userId: string) {
  return await db
    .select()
    .from(profileSections)
    .where(eq(profileSections.userId, userId))
    .orderBy(asc(profileSections.position));
}

export async function createSection(userId: string, input: z.infer<typeof profileSectionSchema>) {
  const [created] = await db
    .insert(profileSections)
    .values({
      userId,
      type: input.type,
      title: input.title,
      content: input.content,
      position: input.position,
      visible: input.visible,
    })
    .returning();

  return created;
}

export async function updateSection(userId: string, sectionId: string, input: Partial<z.infer<typeof profileSectionSchema>>) {
  const [updated] = await db
    .update(profileSections)
    .set(input)
    .where(sql`${profileSections.id} = ${sectionId} AND ${profileSections.userId} = ${userId}`)
    .returning();

  return updated || null;
}

export async function deleteSection(userId: string, sectionId: string) {
  const [deleted] = await db
    .delete(profileSections)
    .where(sql`${profileSections.id} = ${sectionId} AND ${profileSections.userId} = ${userId}`)
    .returning();

  return deleted || null;
}
