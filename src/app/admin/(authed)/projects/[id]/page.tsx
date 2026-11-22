import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Btn, Field, Checkbox } from "@/components/admin/Toolbar";
import { updateProject, deleteProject, addProjectMedia, deleteProjectMedia } from "../actions";
import type { Brand, Category, Project, ProjectMedia } from "@/lib/types";

export default async function ProjectEdit({ params }: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const sb = await createClient();
  const [{ data: project }, { data: cats }, { data: brands }, { data: media }, { data: pb }] = await Promise.all([
    sb.from("projects").select("*").eq("id", id).maybeSingle(),
    sb.from("categories").select("*").order("sort_order"),
    sb.from("brands").select("*").order("name"),
    sb.from("project_media").select("*").eq("project_id", id).order("sort_order"),
    sb.from("project_brands").select("brand_id").eq("project_id", id),
  ]);
  if (!project) notFound();
  const p = project as Project;
  const categories = (cats ?? []) as Category[];
  const allBrands = (brands ?? []) as Brand[];
  const items = (media ?? []) as ProjectMedia[];
  const linkedBrands = new Set((pb ?? []).map((r) => r.brand_id));

  return (
    <>
      <PageHeader
        title={p.title}
        subtitle={`/${p.slug}`}
        crumbs={[{ href: "/admin/projects", label: "Projects" }, { label: p.title }]}
        action={
          <div className="flex gap-3">
            {p.published && <Btn href={`/projects/${p.slug}`}>Preview</Btn>}
          </div>
        }
      />

      <form action={updateProject} className="grid lg:grid-cols-3 gap-10" encType="multipart/form-data">
        <input type="hidden" name="id" value={p.id} />
        <input type="hidden" name="cover_url" value={p.cover_url ?? ""} />

        <div className="lg:col-span-2 space-y-5">
          <Field label="Title" name="title" defaultValue={p.title} required />
          <Field label="Slug" name="slug" defaultValue={p.slug} required />
          <Field label="Description" name="description" defaultValue={p.description ?? ""} textarea rows={6} />
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="YouTube URL" name="youtube_url" defaultValue={p.youtube_url ?? ""} placeholder="https://youtu.be/..." />
            <Field label="Hosted video URL" name="video_url" defaultValue={p.video_url ?? ""} placeholder="https://..." />
          </div>
          <Field label="Tags (comma separated)" name="tags" defaultValue={p.tags.join(", ")} />
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Year" name="year" type="number" defaultValue={p.year ?? ""} />
            <Field label="Project date" name="project_date" type="date" defaultValue={p.project_date ?? ""} />
          </div>
          <details className="border hairline">
            <summary className="px-4 py-3 cursor-pointer text-[11px] tracking-[0.25em] uppercase text-white/70">SEO</summary>
            <div className="p-4 space-y-4">
              <Field label="SEO title" name="seo_title" defaultValue={p.seo_title ?? ""} />
              <Field label="SEO description" name="seo_description" defaultValue={p.seo_description ?? ""} textarea rows={3} />
            </div>
          </details>
        </div>

        <aside className="space-y-5">
          <div className="border hairline p-5 space-y-4">
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2">Status</div>
              <div className="flex flex-col gap-2">
                <Checkbox label="Published" name="published" defaultChecked={p.published} />
                <Checkbox label="Featured on homepage" name="featured" defaultChecked={p.featured} />
              </div>
            </div>
            <Field label="Sort order" name="sort_order" type="number" defaultValue={p.sort_order} />
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2">Category</div>
              <select name="category_id" defaultValue={p.category_id ?? ""} className="w-full bg-black border hairline focus:border-white outline-none px-3 py-2 text-sm">
                <option value="">— None —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2">Brands</div>
              <div className="space-y-1.5 max-h-48 overflow-auto pr-1">
                {allBrands.length === 0 && <div className="text-[11px] text-white/40">No brands yet.</div>}
                {allBrands.map((b) => (
                  <label key={b.id} className="flex items-center gap-2 text-sm text-white/80">
                    <input type="checkbox" name="brand_ids" value={b.id} defaultChecked={linkedBrands.has(b.id)} className="accent-white" />
                    {b.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border hairline p-5">
            <div className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2">Cover image</div>
            {p.cover_url && (
              <div className="relative aspect-video bg-neutral-900 mb-3">
                <Image src={p.cover_url} alt="" fill className="object-cover" sizes="400px" />
              </div>
            )}
            <input type="file" name="cover_file" accept="image/*" className="text-xs text-white/70" />
          </div>

          <Btn type="submit" variant="solid">Save project</Btn>
        </aside>
      </form>

      {/* Gallery management */}
      <section className="mt-16">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-4">Gallery & media</h2>
        <form action={addProjectMedia} encType="multipart/form-data" className="border hairline p-5 mb-6 flex flex-wrap items-end gap-4">
          <input type="hidden" name="project_id" value={p.id} />
          <div className="flex-1">
            <div className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2">Add photos / videos</div>
            <input type="file" name="files" accept="image/*,video/*" multiple className="text-xs text-white/70" />
          </div>
          <Btn type="submit">Upload</Btn>
        </form>
        {items.length === 0 ? (
          <div className="py-12 text-center text-white/40 text-sm tracking-[0.2em] uppercase border hairline">No gallery media yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((m) => (
              <div key={m.id} className="border hairline">
                <div className="relative aspect-square bg-neutral-900">
                  {m.type === "video" ? (
                    <video src={m.url} className="h-full w-full object-cover" muted />
                  ) : (
                    <Image src={m.url} alt={m.alt ?? ""} fill className="object-cover" sizes="25vw" />
                  )}
                </div>
                <form action={deleteProjectMedia} className="p-2 text-right">
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="project_id" value={p.id} />
                  <button className="text-[10px] tracking-[0.25em] uppercase text-red-300 hover:text-red-200">Delete</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-16 border-t hairline pt-8">
        <form action={deleteProject}>
          <input type="hidden" name="id" value={p.id} />
          <Btn type="submit" variant="danger">Delete this project</Btn>
          <p className="mt-2 text-[10px] text-white/40">This also deletes gallery entries. Cannot be undone.</p>
        </form>
      </section>
    </>
  );
}
