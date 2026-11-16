import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getAdminStats } from "@/lib/services/admin";

export async function GET() {
  try {
    await requireRole("admin");
    const stats = await getAdminStats();
    return NextResponse.json({ stats });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    console.error("Get admin stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
