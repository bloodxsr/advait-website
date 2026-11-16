import { NextResponse } from "next/server";
import { getDivisionsWithCounts } from "@/lib/services/divisions";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const data = await getDivisionsWithCounts();
    return NextResponse.json({ divisions: data });
  } catch (err: any) {
    console.error("Get divisions error:", err);
    return NextResponse.json({ error: "Failed to fetch divisions" }, { status: 500 });
  }
}
