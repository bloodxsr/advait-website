import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = new Map([
      ["image/jpeg", "jpg"],
      ["image/png", "png"],
      ["image/webp", "webp"],
    ]);
    const extension = allowedTypes.get(file.type);

    if (!extension) {
      return NextResponse.json({ error: "Only JPEG, PNG, and WebP images are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileId = crypto.randomUUID();
    const key = `uploads/${session.userId}/${Date.now()}-${fileId}.${extension}`;

    const uploaded = await uploadFile(buffer, key, file.type);

    return NextResponse.json({ url: uploaded.publicUrl, path: uploaded.path }, { status: 201 });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized. Please sign in to upload images." }, { status: 401 });
    }
    console.error("Direct upload error:", err);
    return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 });
  }
}
