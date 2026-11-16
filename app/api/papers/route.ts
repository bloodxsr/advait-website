import { NextResponse } from "next/server";
import { getPapers } from "@/lib/services/papers";

export async function GET() {
  try {
    const data = await getPapers();
    return NextResponse.json({ papers: data });
  } catch (err: any) {
    console.error("Get papers error:", err);
    return NextResponse.json({ error: "Failed to fetch papers" }, { status: 500 });
  }
}
