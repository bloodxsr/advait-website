import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/services/leaderboard";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const year = searchParams.get("year") || undefined;
    const tech = searchParams.get("tech") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;

    const data = await getLeaderboard({ q, year, tech, limit });
    return NextResponse.json({ leaderboard: data });
  } catch (err: any) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
