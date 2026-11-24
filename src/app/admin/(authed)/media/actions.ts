"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, deleteObjectByPath } from "@/lib/storage";

async function requireAdmin() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return sb;
}

export async function uploadMedia(formData: FormData) {
  const sb = await requireAdmin();
  const files = formData.getAll("files") as File[];
  const valid = files.filter((f) => f && f.size > 0);
  if (valid.length === 0) {
    redirect("/admin/media?error=" + encodeURIComponent("No files selected"));
  }
  let uploaded = 0;
  try {
    for (const f of valid) {
      const kind = f.type.startsWith("video") ? "video" : "image";
      const r = await uploadFile(f, kind === "video" ? "videos" : "images");
      await sb.from("media").insert({
        url: r.url, path: r.path, type: kind,
        filename: f.name, size_bytes: f.size,
        alt: String(formData.get("alt") || "") || null,
      });
      uploaded++;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    revalidatePath("/admin/media");
    redirect(`/admin/media?error=${encodeURIComponent(msg)}&uploaded=${uploaded}`);
  }
  revalidatePath("/admin/media");
  redirect(`/admin/media?ok=${uploaded}`);
}

export async function updateMedia(formData: FormData) {
  const sb = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await sb.from("media").update({ alt: String(formData.get("alt") || "") || null }).eq("id", id);
  revalidatePath("/admin/media");
}

export async function deleteMedia(formData: FormData) {
  const sb = await requireAdmin();
  const id = String(formData.get("id") || "");
  const path = String(formData.get("path") || "");
  if (!id) return;
  if (path) await deleteObjectByPath(path);
  await sb.from("media").delete().eq("id", id);
  revalidatePath("/admin/media");
  redirect("/admin/media");
}
