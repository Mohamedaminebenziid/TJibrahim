"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadFile } from "@/lib/storage";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return sb;
}

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/brands");
}

export async function upsertBrand(formData: FormData) {
  const sb = await requireAdmin();
  const id = String(formData.get("id") || "") || null;
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const slug = String(formData.get("slug") || "").trim() || slugify(name);
  let logo_url = String(formData.get("logo_url") || "") || null;
  const file = formData.get("logo_file") as File | null;
  if (file && file.size > 0) {
    const r = await uploadFile(file, "brands");
    logo_url = r.url;
    await sb.from("media").insert({ url: r.url, path: r.path, filename: file.name, size_bytes: file.size, type: "image" });
  }
  const payload = {
    name,
    slug,
    logo_url,
    website_url: String(formData.get("website_url") || "") || null,
    description: String(formData.get("description") || "") || null,
    sort_order: Number(formData.get("sort_order") || 0),
    published: formData.get("published") === "on",
  };
  if (id) await sb.from("brands").update(payload).eq("id", id);
  else await sb.from("brands").insert(payload);
  revalidateAll();
  redirect("/admin/brands");
}

export async function deleteBrand(formData: FormData) {
  const sb = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await sb.from("brands").delete().eq("id", id);
  revalidateAll();
  redirect("/admin/brands");
}
