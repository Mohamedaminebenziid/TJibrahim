"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, deleteObjectByPath } from "@/lib/storage";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return sb;
}

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/projects");
}

export async function createProject(formData: FormData) {
  const sb = await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  const slug = String(formData.get("slug") || "").trim() || slugify(title);
  const { data, error } = await sb
    .from("projects")
    .insert({ title, slug, published: false })
    .select("id")
    .single();
  if (error || !data) redirect(`/admin/projects?error=${encodeURIComponent(error?.message ?? "")}`);
  revalidateAll();
  redirect(`/admin/projects/${data!.id}`);
}

export async function updateProject(formData: FormData) {
  const sb = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim() || slugify(title);
  const tags = String(formData.get("tags") || "")
    .split(",").map((s) => s.trim()).filter(Boolean);

  let cover_url = String(formData.get("cover_url") || "") || null;
  const coverFile = formData.get("cover_file") as File | null;
  if (coverFile && coverFile.size > 0) {
    const r = await uploadFile(coverFile, `projects/${id}`);
    cover_url = r.url;
    await sb.from("media").insert({ url: r.url, path: r.path, filename: coverFile.name, size_bytes: coverFile.size, type: "image" });
  }

  const payload = {
    title,
    slug,
    description: String(formData.get("description") || "") || null,
    category_id: String(formData.get("category_id") || "") || null,
    cover_url,
    youtube_url: String(formData.get("youtube_url") || "") || null,
    video_url: String(formData.get("video_url") || "") || null,
    year: formData.get("year") ? Number(formData.get("year")) : null,
    project_date: String(formData.get("project_date") || "") || null,
    tags,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
    seo_title: String(formData.get("seo_title") || "") || null,
    seo_description: String(formData.get("seo_description") || "") || null,
  };
  await sb.from("projects").update(payload).eq("id", id);

  // Brands link
  const brandIds = formData.getAll("brand_ids").map(String).filter(Boolean);
  await sb.from("project_brands").delete().eq("project_id", id);
  if (brandIds.length) {
    await sb.from("project_brands").insert(brandIds.map((brand_id) => ({ project_id: id, brand_id })));
  }

  revalidateAll();
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath(`/projects/${slug}`);
}

export async function deleteProject(formData: FormData) {
  const sb = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await sb.from("projects").delete().eq("id", id);
  revalidateAll();
  redirect("/admin/projects");
}

export async function addProjectMedia(formData: FormData) {
  const sb = await requireAdmin();
  const projectId = String(formData.get("project_id") || "");
  if (!projectId) return;
  const files = formData.getAll("files") as File[];
  let i = 0;
  for (const f of files) {
    if (!f || f.size === 0) continue;
    const kind = f.type.startsWith("video") ? "video" : "image";
    const r = await uploadFile(f, `projects/${projectId}`);
    await sb.from("project_media").insert({
      project_id: projectId, url: r.url, type: kind,
      caption: null, alt: null, sort_order: Date.now() + i,
    });
    await sb.from("media").insert({
      url: r.url, path: r.path, type: kind, filename: f.name, size_bytes: f.size,
    });
    i++;
  }
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function deleteProjectMedia(formData: FormData) {
  const sb = await requireAdmin();
  const id = String(formData.get("id") || "");
  const projectId = String(formData.get("project_id") || "");
  if (!id) return;
  const { data: m } = await sb.from("project_media").select("url").eq("id", id).single();
  await sb.from("project_media").delete().eq("id", id);
  // Also try to remove the matching storage object by looking up media table
  if (m?.url) {
    const { data: md } = await sb.from("media").select("id,path").eq("url", m.url).maybeSingle();
    if (md?.path) {
      await deleteObjectByPath(md.path);
      await sb.from("media").delete().eq("id", md.id);
    }
  }
  revalidatePath(`/admin/projects/${projectId}`);
}
