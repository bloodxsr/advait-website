import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { signUpload } from "@/lib/storage";
import { z } from "zod";
import crypto from "crypto";

const uploadSignSchema = z.object({
  kind: z.enum(["avatar", "post-cover", "event"]),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z.number().max(5 * 1024 * 1024, "File size limit is 5 MB"),
});

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const body = await req.json();

    const result = uploadSignSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { kind, contentType } = result.data;

    // 'event' uploads require admin role
    if (kind === "event" && session.role !== "admin") {
      return NextResponse.json({ error: "Admin role required for event uploads" }, { status: 403 });
    }

    const ext = contentType.split("/")[1] || "webp";
    const fileId = crypto.randomUUID();

    let key: string;
    if (kind === "avatar") {
      key = `avatars/${session.userId}/${fileId}.${ext}`;
    } else if (kind === "post-cover") {
      key = `posts/${session.userId}/${fileId}.${ext}`;
    } else {
      key = `events/${fileId}.${ext}`;
    }

    const signed = await signUpload(key);
    return NextResponse.json(signed);
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Sign upload error:", err);
    return NextResponse.json({ error: "Failed to create signed upload URL" }, { status: 500 });
  }
}
