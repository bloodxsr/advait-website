import { NextResponse } from "next/server";
import { getPosts, createPost } from "@/lib/services/posts";
import { requireUser } from "@/lib/auth";
import { createPostSchema } from "@/lib/validators/posts";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subtopic = searchParams.get("subtopic") || undefined;
    const status = searchParams.get("status") || "approved";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 20;

    const data = await getPosts(subtopic, status, limit);
    return NextResponse.json({ posts: data });
  } catch (err: any) {
    console.error("Get posts error:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const body = await req.json();

    const result = createPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const post = await createPost(session.userId, result.data, session.role === "admin");
    return NextResponse.json({ post }, { status: 201 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create post error:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
