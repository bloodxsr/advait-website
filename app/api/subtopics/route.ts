import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subtopics } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(subtopics).orderBy(asc(subtopics.name));
    return NextResponse.json({ subtopics: list });
  } catch (err: any) {
    console.error("Get subtopics error:", err);
    return NextResponse.json({ error: "Failed to fetch subtopics" }, { status: 500 });
  }
}
