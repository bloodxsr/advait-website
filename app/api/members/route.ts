import { NextResponse } from "next/server";
import { getMembersByDivision } from "@/lib/services/members";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const division = searchParams.get("division") || undefined;

    const members = await getMembersByDivision(division);
    return NextResponse.json({ members });
  } catch (err: any) {
    console.error("Members error:", err);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
