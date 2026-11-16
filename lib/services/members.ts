import { db } from "@/lib/db";
import { users, divisions, pointsEntries } from "@/db/schema";
import { sql, eq, desc, and } from "drizzle-orm";

export async function getMembersByDivision(divisionSlug?: string) {
  const conditions = [];

  if (divisionSlug && divisionSlug !== "all") {
    conditions.push(eq(divisions.slug, divisionSlug));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
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
    .orderBy(desc(users.isLeader), desc(users.isDivisionLead), users.name);

  return result;
}
