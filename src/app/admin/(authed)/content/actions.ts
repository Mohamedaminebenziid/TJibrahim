"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return sb;
}

export async function saveContent(key: string, value: unknown) {
  const sb = await requireAdmin();
  await sb.from("site_content").upsert({ key, value, updated_at: new Date().toISOString() });
  revalidatePath("/", "layout");
}

export async function saveSiteText(formData: FormData) {
  const key = String(formData.get("__key") || "");
  if (!key) return;
  const value: Record<string, unknown> = {};
  for (const [k, v] of formData.entries()) {
    if (k.startsWith("__")) continue;
    if (k.endsWith("[]")) {
      const base = k.slice(0, -2);
      const arr = (value[base] as string[]) || [];
      arr.push(String(v));
      value[base] = arr;
    } else {
      value[k] = typeof v === "string" ? v : "";
    }
  }
  await saveContent(key, value);
  revalidatePath("/admin/content");
  revalidatePath("/admin/contact");
  revalidatePath("/admin/seo");
}

export async function saveStats(formData: FormData) {
  const labels = formData.getAll("stat_label").map(String);
  const values = formData.getAll("stat_value").map(String);
  const specialties = String(formData.get("specialties") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const value = {
    heading: String(formData.get("heading") || "About"),
    bio: String(formData.get("bio") || ""),
    specialties,
    stats: labels.map((label, i) => ({ label, value: values[i] ?? "" })).filter((s) => s.label),
  };
  await saveContent("about", value);
  revalidatePath("/admin/content");
}

// ---- Social links ----
export async function upsertSocial(formData: FormData) {
  const sb = await requireAdmin();
  const id = String(formData.get("id") || "") || null;
  const payload = {
    platform: String(formData.get("platform") || "").trim(),
    url: String(formData.get("url") || "").trim(),
    label: String(formData.get("label") || "") || null,
    sort_order: Number(formData.get("sort_order") || 0),
    published: formData.get("published") === "on",
  };
  if (!payload.platform || !payload.url) return;
  if (id) await sb.from("social_links").update(payload).eq("id", id);
  else await sb.from("social_links").insert(payload);
  revalidatePath("/", "layout");
  revalidatePath("/admin/social");
}

export async function deleteSocial(formData: FormData) {
  const sb = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await sb.from("social_links").delete().eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/social");
}
