import { db } from "@/lib/db";
import { users, projects, posts, resources, pointsEntries } from "@/db/schema";
import { count, eq, sql } from "drizzle-orm";

export async function getAdminStats() {
  const [userCount] = await db.select({ count: count(users.id) }).from(users);
  const [projectCount] = await db.select({ count: count(projects.id) }).from(projects);
  const [postCount] = await db.select({ count: count(posts.id) }).from(posts);
  
  const [pendingResourceCount] = await db
    .select({ count: count(resources.id) })
    .from(resources)
    .where(eq(resources.status, "pending"));

  const [pendingProjectCount] = await db
    .select({ count: count(projects.id) })
    .from(projects)
    .where(eq(projects.status, "pending"));

  const [pendingPostCount] = await db
    .select({ count: count(posts.id) })
    .from(posts)
    .where(eq(posts.status, "pending"));

  const [pointsTotal] = await db
    .select({ total: sql<number>`coalesce(sum(${pointsEntries.points}), 0)::int` })
    .from(pointsEntries);

  const pendingApprovals =
    Number(pendingResourceCount.count) +
    Number(pendingProjectCount.count) +
    Number(pendingPostCount.count);

  return {
    totalMembers: Number(userCount.count),
    totalProjects: Number(projectCount.count),
    totalPosts: Number(postCount.count),
    pendingApprovals,
    pendingBreakdown: {
      resources: Number(pendingResourceCount.count),
      projects: Number(pendingProjectCount.count),
      posts: Number(pendingPostCount.count),
    },
    totalPointsAwarded: Number(pointsTotal.total),
  };
}

export async function awardPoints(adminId: string, userId: string, points: number, reason: string) {
  const [entry] = await db
    .insert(pointsEntries)
    .values({
      userId,
      points,
      reason,
      sourceType: "admin",
      awardedBy: adminId,
    })
    .returning();

  return entry;
}
