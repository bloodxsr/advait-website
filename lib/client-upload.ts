import { supabaseBrowser } from "@/lib/supabase-browser";

export type SignedUploadKind = "avatar" | "post-cover" | "event" | "photo" | "gallery";

export async function uploadWithSignedUrl(file: File, kind: SignedUploadKind): Promise<string> {
  const response = await fetch("/api/uploads/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, contentType: file.type, size: file.size }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Could not authorize image upload");
  }

  const { error } = await supabaseBrowser.storage
    .from("media")
    .uploadToSignedUrl(payload.path, payload.token, file);

  if (error) {
    throw new Error(error.message || "Image upload failed");
  }

  return payload.publicUrl;
}
