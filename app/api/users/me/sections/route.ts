import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getUserSections, createSection } from "@/lib/services/users";
import { profileSectionSchema } from "@/lib/validators/users";

export async function GET() {
  try {
    const session = await requireUser();
    const sections = await getUserSections(session.userId);
    return NextResponse.json({ sections });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch sections" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const body = await req.json();

    const result = profileSectionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const section = await createSection(session.userId, result.data);
    return NextResponse.json({ section }, { status: 201 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create section" }, { status: 500 });
  }
}
