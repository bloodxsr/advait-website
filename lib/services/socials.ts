import { db } from "@/lib/db";
import { socialLinks } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getSocialLinks() {
  return await db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.active, true))
    .orderBy(asc(socialLinks.order));
}
