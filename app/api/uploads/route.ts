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

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "jpg";
    const fileId = crypto.randomUUID();
    const key = `uploads/${session.userId}/${Date.now()}-${fileId}.${ext}`;

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
