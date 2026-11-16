import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getPendingResources } from "@/lib/services/resources";

export async function GET() {
  try {
    await requireRole("admin");
    const pending = await getPendingResources();
    return NextResponse.json({ resources: pending });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    console.error("Get pending resources error:", err);
    return NextResponse.json({ error: "Failed to fetch pending resources" }, { status: 500 });
  }
}
