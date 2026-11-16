import { NextResponse } from "next/server";
import { deleteSocialPost } from "@/lib/services/social-posts";
import { requireRole } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("admin");
    const { id } = await params;

    const deleted = await deleteSocialPost(id);
    if (!deleted) {
      return NextResponse.json({ error: "Social post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    console.error("Delete social post error:", err);
    return NextResponse.json({ error: "Failed to delete social post" }, { status: 500 });
  }
}
