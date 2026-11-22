import { createClient } from "@/lib/supabase/server";
import { PageHeader, Btn, Field, Checkbox } from "@/components/admin/Toolbar";
import { upsertCategory, deleteCategory } from "./actions";
import type { Category } from "@/lib/types";

export default async function CategoriesPage() {
  const sb = await createClient();
  const { data } = await sb.from("categories").select("*").order("sort_order");
  const items = (data ?? []) as Category[];

  return (
    <>
      <PageHeader title="Categories" subtitle="Create portfolio categories that appear in navigation and filters." />
      <div className="grid lg:grid-cols-2 gap-10">
        <section>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-4">New category</h2>
          <form action={upsertCategory} className="space-y-4 border hairline p-6">
            <Field label="Name" name="name" required />
            <Field label="Slug (optional)" name="slug" hint="Lowercase, dashes. Auto-generated if empty." />
            <Field label="Description" name="description" textarea rows={3} />
            <Field label="Sort order" name="sort_order" type="number" defaultValue={items.length * 10} />
            <div className="flex gap-6">
              <Checkbox label="Published" name="published" defaultChecked />
              <Checkbox label="Show in nav" name="show_in_nav" defaultChecked />
            </div>
            <Btn type="submit" variant="solid">Create category</Btn>
          </form>
        </section>

        <section>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-4">All categories ({items.length})</h2>
          <div className="space-y-3">
            {items.length === 0 && <div className="text-sm text-white/40 border hairline p-6">No categories yet.</div>}
            {items.map((c) => (
              <details key={c.id} className="border hairline">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer">
                  <div>
                    <span className="font-display text-xl tracking-tight">{c.name}</span>
                    <span className="ml-3 text-[10px] tracking-[0.25em] uppercase text-white/40">/{c.slug}</span>
                  </div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/50">
                    {c.published ? "Published" : "Draft"}
                  </span>
                </summary>
                <form action={upsertCategory} className="space-y-4 p-4 border-t hairline">
                  <input type="hidden" name="id" value={c.id} />
                  <Field label="Name" name="name" defaultValue={c.name} required />
                  <Field label="Slug" name="slug" defaultValue={c.slug} required />
                  <Field label="Description" name="description" defaultValue={c.description ?? ""} textarea rows={2} />
                  <Field label="Sort order" name="sort_order" type="number" defaultValue={c.sort_order} />
                  <div className="flex gap-6">
                    <Checkbox label="Published" name="published" defaultChecked={c.published} />
                    <Checkbox label="Show in nav" name="show_in_nav" defaultChecked={c.show_in_nav} />
                  </div>
                  <div className="flex gap-3">
                    <Btn type="submit" variant="solid">Save</Btn>
                  </div>
                </form>
                <form action={deleteCategory} className="p-4 border-t hairline">
                  <input type="hidden" name="id" value={c.id} />
                  <Btn type="submit" variant="danger">Delete category</Btn>
                  <p className="mt-2 text-[10px] text-white/40">Projects in this category will be kept but unassigned.</p>
                </form>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
