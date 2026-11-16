import { NextResponse } from "next/server";
import { getSocialPosts, createSocialPost } from "@/lib/services/social-posts";
import { requireRole } from "@/lib/auth";
import { createSocialPostSchema } from "@/lib/validators/social-posts";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const division = searchParams.get("division") || undefined;

    const data = await getSocialPosts(type, division);
    return NextResponse.json({ posts: data });
  } catch (err: any) {
    console.error("Get social posts error:", err);
    return NextResponse.json({ error: "Failed to fetch social posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireRole("admin");
    const body = await req.json();

    const result = createSocialPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const post = await createSocialPost(admin.userId, result.data);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    console.error("Create social post error:", err);
    return NextResponse.json({ error: "Failed to create social post" }, { status: 500 });
  }
}
