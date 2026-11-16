import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { reviewProject } from "@/lib/services/projects";
import { reviewPost } from "@/lib/services/posts";
import { reviewResource } from "@/lib/services/resources";
import { reviewItemSchema } from "@/lib/validators/approvals";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const admin = await requireRole("admin");
    const { type, id } = await params;
    const body = await req.json();

    const result = reviewItemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    let updatedItem: any = null;

    if (type === "projects") {
      updatedItem = await reviewProject(admin.userId, id, result.data);
    } else if (type === "posts") {
      updatedItem = await reviewPost(admin.userId, id, result.data);
    } else if (type === "resources") {
      updatedItem = await reviewResource(admin.userId, id, result.data);
    } else {
      return NextResponse.json(
        { error: `Invalid approval type: ${type}. Must be 'projects', 'posts', or 'resources'.` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    if (err.message === "ALREADY_REVIEWED") {
      return NextResponse.json({ error: "Item has already been reviewed" }, { status: 409 });
    }
    console.error("Review approval error:", err);
    return NextResponse.json({ error: "Failed to process review" }, { status: 500 });
  }
}
