import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getPendingProjects } from "@/lib/services/projects";
import { getPendingPosts } from "@/lib/services/posts";
import { getPendingResources } from "@/lib/services/resources";

export async function GET() {
  try {
    await requireRole("admin");

    const [projects, posts, resources] = await Promise.all([
      getPendingProjects(),
      getPendingPosts(),
      getPendingResources(),
    ]);

    const totalPending = projects.length + posts.length + resources.length;

    return NextResponse.json({
      summary: {
        totalPending,
        pendingProjects: projects.length,
        pendingPosts: posts.length,
        pendingResources: resources.length,
      },
      projects,
      posts,
      resources,
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    console.error("Get pending approvals error:", err);
    return NextResponse.json({ error: "Failed to fetch approvals" }, { status: 500 });
  }
}
