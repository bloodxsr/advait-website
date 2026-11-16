import { db } from "@/lib/db";
import { users, pointsEntries, projects, projectMembers, divisions } from "@/db/schema";
import { sql, eq, desc, ilike, and, arrayContains } from "drizzle-orm";

export interface LeaderboardFilter {
  q?: string;
  year?: string;
  tech?: string;
  limit?: number;
}

export async function getLeaderboard(filters: LeaderboardFilter = {}) {
  const { q, year, tech, limit = 50 } = filters;

  const conditions = [];

  if (q && q.trim()) {
    conditions.push(ilike(users.name, `%${q.trim()}%`));
  }

  if (year && year !== "All" && year.trim()) {
    conditions.push(eq(users.year, year.trim()));
  }

  if (tech && tech !== "All" && tech.trim()) {
    conditions.push(arrayContains(users.techStack, [tech.trim()]));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Query users with their total points and division info
  const membersWithPoints = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      headline: users.headline,
      year: users.year,
      section: users.section,
      department: users.department,
      avatarUrl: users.avatarUrl,
      techStack: users.techStack,
      github: users.github,
      linkedin: users.linkedin,
      portfolio: users.portfolio,
      divisionName: divisions.name,
      divisionSlug: divisions.slug,
      isDivisionLead: users.isDivisionLead,
      isLeader: users.isLeader,
      totalPoints: sql<number>`coalesce(sum(${pointsEntries.points}), 0)::int`,
    })
    .from(users)
    .leftJoin(divisions, eq(users.divisionId, divisions.id))
    .leftJoin(pointsEntries, eq(users.id, pointsEntries.userId))
    .where(whereClause)
    .groupBy(users.id, divisions.name, divisions.slug)
    .orderBy(desc(sql`coalesce(sum(${pointsEntries.points}), 0)`), users.name)
    .limit(limit);

  // Fetch project counts for each member
  const memberIds = membersWithPoints.map((m) => m.id);
  const projectCounts = memberIds.length > 0
    ? await db
        .select({
          userId: projectMembers.userId,
          count: sql<number>`count(${projectMembers.id})::int`,
        })
        .from(projectMembers)
        .where(sql`${projectMembers.userId} IN ${memberIds}`)
        .groupBy(projectMembers.userId)
    : [];

  const projectCountMap = new Map<string, number>();
  projectCounts.forEach((pc) => projectCountMap.set(pc.userId, pc.count));

  // Format with ranks
  return membersWithPoints.map((member, index) => ({
    ...member,
    rank: `#${String(index + 1).padStart(2, "0")}`,
    projectCount: projectCountMap.get(member.id) || 0,
  }));
}
