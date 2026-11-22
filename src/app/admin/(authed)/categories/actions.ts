"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return sb;
}

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/categories");
}

export async function upsertCategory(formData: FormData) {
  const sb = await requireAdmin();
  const id = String(formData.get("id") || "") || null;
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const slug = String(formData.get("slug") || "").trim() || slugify(name);
  const payload = {
    name,
    slug,
    description: String(formData.get("description") || "") || null,
    sort_order: Number(formData.get("sort_order") || 0),
    published: formData.get("published") === "on",
    show_in_nav: formData.get("show_in_nav") === "on",
  };
  if (id) await sb.from("categories").update(payload).eq("id", id);
  else await sb.from("categories").insert(payload);
  revalidateAll();
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const sb = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  // Detach projects first (set null)
  await sb.from("projects").update({ category_id: null }).eq("category_id", id);
  await sb.from("categories").delete().eq("id", id);
  revalidateAll();
  redirect("/admin/categories");
}
