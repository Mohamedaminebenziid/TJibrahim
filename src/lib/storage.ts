import "server-only";
import { createAdminClient } from "./supabase/admin";

const BUCKET = "media";

export async function uploadFile(file: File, folder = "uploads"): Promise<{ url: string; path: string }> {
  if (!file || file.size === 0) throw new Error("Empty file");
  const admin = createAdminClient();
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from(BUCKET).upload(path, buf, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteObjectByPath(path: string) {
  if (!path) return;
  const admin = createAdminClient();
  await admin.storage.from(BUCKET).remove([path]);
}
