import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/services/leaderboard";
import { parseLimit } from "@/lib/query";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const year = searchParams.get("year") || undefined;
    const tech = searchParams.get("tech") || undefined;
    const limit = parseLimit(searchParams.get("limit"));

    const data = await getLeaderboard({ q, year, tech, limit });
    return NextResponse.json({ leaderboard: data });
  } catch (err: any) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
