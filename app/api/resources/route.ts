import { NextResponse } from "next/server";
import { getResources, submitResource } from "@/lib/services/resources";
import { getSession, requireUser } from "@/lib/auth";
import { createResourceSchema } from "@/lib/validators/resources";

export async function GET() {
  try {
    const session = await getSession();
    const data = await getResources(session?.userId);
    return NextResponse.json({ resources: data });
  } catch (err: any) {
    console.error("Get resources error:", err);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const body = await req.json();

    const result = createResourceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const resource = await submitResource(session.userId, result.data, session.role === "admin");
    return NextResponse.json({ resource }, { status: 201 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Submit resource error:", err);
    return NextResponse.json({ error: "Failed to submit resource" }, { status: 500 });
  }
}
