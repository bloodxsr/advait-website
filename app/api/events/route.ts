import { NextResponse } from "next/server";
import { getEvents, createEvent } from "@/lib/services/events";
import { requireRole } from "@/lib/auth";
import { createEventSchema } from "@/lib/validators/events";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kind = searchParams.get("kind") || undefined;

    const data = await getEvents(kind);
    return NextResponse.json({ events: data });
  } catch (err: any) {
    console.error("Get events error:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireRole("admin");
    const body = await req.json();

    const result = createEventSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const event = await createEvent(result.data);
    return NextResponse.json({ event }, { status: 201 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    console.error("Create event error:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
