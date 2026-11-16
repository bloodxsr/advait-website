import { db } from "@/lib/db";
import { divisions, users } from "@/db/schema";
import { asc, count, eq } from "drizzle-orm";

export async function getDivisionsWithCounts() {
  const allDivisions = await db
    .select({
      id: divisions.id,
      name: divisions.name,
      slug: divisions.slug,
      badge: divisions.badge,
      desc: divisions.desc,
      order: divisions.order,
    })
    .from(divisions)
    .orderBy(asc(divisions.order));

  // Get member counts per division
  const memberCounts = await db
    .select({
      divisionId: users.divisionId,
      count: count(users.id),
    })
    .from(users)
    .groupBy(users.divisionId);

  const countMap = new Map<string, number>();
  memberCounts.forEach((m) => {
    if (m.divisionId) countMap.set(m.divisionId, Number(m.count));
  });

  return allDivisions.map((d) => ({
    ...d,
    memberCount: countMap.get(d.id) || 0,
  }));
}
