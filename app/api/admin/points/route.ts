import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { awardPoints } from "@/lib/services/admin";
import { z } from "zod";

const awardPointsSchema = z.object({
  userId: z.string().uuid(),
  points: z.number().int(),
  reason: z.string().min(3).max(200),
});

export async function POST(req: Request) {
  try {
    const admin = await requireRole("admin");
    const body = await req.json();

    const result = awardPointsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, points, reason } = result.data;
    const entry = await awardPoints(admin.userId, userId, points, reason);

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    console.error("Award points error:", err);
    return NextResponse.json({ error: "Failed to award points" }, { status: 500 });
  }
}
