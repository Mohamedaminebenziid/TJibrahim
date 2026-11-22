import { createClient } from "@/lib/supabase/server";
import { PageHeader, Btn, Field, Checkbox } from "@/components/admin/Toolbar";
import { upsertSocial, deleteSocial } from "../content/actions";
import type { SocialLink } from "@/lib/types";

export default async function SocialPage() {
  const sb = await createClient();
  const { data } = await sb.from("social_links").select("*").order("sort_order");
  const items = (data ?? []) as SocialLink[];
  return (
    <>
      <PageHeader title="Social Links" subtitle="Instagram and other links shown in the footer and contact page." />
      <div className="grid lg:grid-cols-2 gap-10">
        <section>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-4">New link</h2>
          <form action={upsertSocial} className="space-y-4 border hairline p-6">
            <Field label="Platform (e.g. Instagram)" name="platform" required />
            <Field label="URL" name="url" type="url" required />
            <Field label="Label (optional)" name="label" />
            <Field label="Sort order" name="sort_order" type="number" defaultValue={items.length * 10} />
            <Checkbox label="Published" name="published" defaultChecked />
            <Btn type="submit" variant="solid">Add link</Btn>
          </form>
        </section>
        <section>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-4">All links ({items.length})</h2>
          <div className="space-y-3">
            {items.length === 0 && <div className="text-sm text-white/40 border hairline p-6">No links yet.</div>}
            {items.map((s) => (
              <details key={s.id} className="border hairline">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer">
                  <div>
                    <div className="font-display text-lg">{s.platform}</div>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-white/40 truncate max-w-md">{s.url}</div>
                  </div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/50">{s.published ? "On" : "Off"}</span>
                </summary>
                <form action={upsertSocial} className="p-4 border-t hairline space-y-3">
                  <input type="hidden" name="id" value={s.id} />
                  <Field label="Platform" name="platform" defaultValue={s.platform} required />
                  <Field label="URL" name="url" defaultValue={s.url} required />
                  <Field label="Label" name="label" defaultValue={s.label ?? ""} />
                  <Field label="Sort order" name="sort_order" type="number" defaultValue={s.sort_order} />
                  <Checkbox label="Published" name="published" defaultChecked={s.published} />
                  <Btn type="submit" variant="solid">Save</Btn>
                </form>
                <form action={deleteSocial} className="p-4 border-t hairline">
                  <input type="hidden" name="id" value={s.id} />
                  <Btn type="submit" variant="danger">Delete</Btn>
                </form>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
