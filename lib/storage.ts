import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  }
);

export async function signUpload(key: string) {
  const { data, error } = await supabase.storage
    .from("media")
    .createSignedUploadUrl(key);

  if (error) throw error;

  const { data: pub } = supabase.storage.from("media").getPublicUrl(key);

  return { path: data.path, token: data.token, publicUrl: pub.publicUrl };
}

export async function uploadFile(buffer: Buffer, key: string, contentType: string) {
  const { error } = await supabase.storage
    .from("media")
    .upload(key, buffer, {
      contentType,
      upsert: true,
    });

  if (error) throw error;

  const { data: pub } = supabase.storage.from("media").getPublicUrl(key);
  return { path: key, publicUrl: pub.publicUrl };
}
