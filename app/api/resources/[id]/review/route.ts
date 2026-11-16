import { NextResponse } from "next/server";
import { reviewResource } from "@/lib/services/resources";
import { requireRole } from "@/lib/auth";
import { reviewResourceSchema } from "@/lib/validators/resources";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireRole("admin");
    const { id } = await params;
    const body = await req.json();

    const result = reviewResourceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await reviewResource(admin.userId, id, result.data);
    return NextResponse.json({ resource: updated });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    if (err.message === "ALREADY_REVIEWED") {
      return NextResponse.json({ error: "Resource has already been reviewed" }, { status: 409 });
    }
    console.error("Review resource error:", err);
    return NextResponse.json({ error: "Failed to review resource" }, { status: 500 });
  }
}
