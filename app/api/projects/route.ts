import { NextResponse } from "next/server";
import { getProjects, createProject } from "@/lib/services/projects";
import { requireUser } from "@/lib/auth";
import { createProjectSchema } from "@/lib/validators/projects";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const subtopic = searchParams.get("subtopic") || undefined;
    const division = searchParams.get("division") || undefined;
    const status = searchParams.get("status") || "approved";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;

    const data = await getProjects({ type, subtopic, division, status, limit });
    return NextResponse.json({ projects: data });
  } catch (err: any) {
    console.error("Get projects error:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const body = await req.json();

    const result = createProjectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const project = await createProject(session.userId, result.data, session.role === "admin");
    return NextResponse.json({ project }, { status: 201 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create project error:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
