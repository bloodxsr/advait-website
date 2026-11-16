import { db } from "@/lib/db";
import { papers } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getPapers() {
  return await db
    .select()
    .from(papers)
    .orderBy(desc(papers.createdAt));
}
