import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Btn, Field } from "@/components/admin/Toolbar";
import { createProject, deleteProject } from "./actions";

export default async function ProjectsAdmin() {
  const sb = await createClient();
  const { data } = await sb
    .from("projects")
    .select("id,title,slug,cover_url,published,featured,year,sort_order, categories(name)")
    .order("sort_order")
    .order("created_at", { ascending: false });
  type Row = {
    id: string; title: string; slug: string; cover_url: string | null;
    published: boolean; featured: boolean; year: number | null; sort_order: number;
    categories: { name: string } | { name: string }[] | null;
  };
  const items = ((data ?? []) as unknown as Row[]).map((r) => ({
    ...r,
    categories: Array.isArray(r.categories) ? r.categories[0] ?? null : r.categories,
  }));

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Create, edit and publish portfolio projects."
        action={null}
      />
      <section className="border hairline p-6 mb-10">
        <form action={createProject} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[260px]">
            <Field label="New project title" name="title" required />
          </div>
          <div className="w-full md:w-72">
            <Field label="Slug (optional)" name="slug" hint="Auto-generated if empty" />
          </div>
          <Btn type="submit" variant="solid">Create & edit</Btn>
        </form>
      </section>

      {items.length === 0 ? (
        <div className="py-20 text-center text-black/40 text-sm tracking-[0.2em] uppercase border hairline">
          No projects yet. Create your first one above.
        </div>
      ) : (
        <div className="divide-y divide-white/10 border hairline">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="relative h-14 w-20 shrink-0 bg-neutral-100">
                {p.cover_url && <Image src={p.cover_url} alt={p.title} fill className="object-cover" sizes="80px" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-xl truncate">{p.title}</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-black/40 truncate">
                  /{p.slug} {p.categories?.name ? `· ${p.categories.name}` : ""} {p.year ? `· ${p.year}` : ""}
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2">
                {p.featured && <span className="text-[9px] tracking-[0.25em] uppercase border hairline px-2 py-0.5">Featured</span>}
                <span className={`text-[9px] tracking-[0.25em] uppercase px-2 py-0.5 ${p.published ? "bg-white text-black" : "border hairline"}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
              <Link href={`/admin/projects/${p.id}`} className="text-[11px] tracking-[0.25em] uppercase border hairline px-3 py-2 hover:bg-black hover:text-white">Edit</Link>
              {p.published && (
                <Link href={`/projects/${p.slug}`} target="_blank" className="text-[11px] tracking-[0.25em] uppercase text-black/60 hover:text-black">View</Link>
              )}
              <form action={deleteProject}>
                <input type="hidden" name="id" value={p.id} />
                <button className="text-[11px] tracking-[0.25em] uppercase text-red-300 hover:text-red-200">Delete</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
