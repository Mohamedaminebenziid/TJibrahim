import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Btn, Field, Checkbox } from "@/components/admin/Toolbar";
import FileInput from "@/components/admin/FileInput";
import { upsertBrand, deleteBrand } from "./actions";
import type { Brand } from "@/lib/types";

export default async function BrandsAdmin() {
  const sb = await createClient();
  const { data } = await sb.from("brands").select("*").order("sort_order");
  const items = (data ?? []) as Brand[];

  return (
    <>
      <PageHeader title="Brands" subtitle="Clients and brand collaborators." />
      <div className="grid lg:grid-cols-2 gap-10">
        <section>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-black/50 mb-4">New brand</h2>
          <form action={upsertBrand} className="space-y-4 border hairline p-6" encType="multipart/form-data">
            <Field label="Name" name="name" required />
            <Field label="Slug" name="slug" hint="Auto-generated if empty." />
            <Field label="Website URL" name="website_url" type="url" />
            <Field label="Description" name="description" textarea rows={2} />
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-black/50 mb-2">Logo</div>
              <FileInput name="logo_file" accept="image/*" multiple={false} label="Choose logo" />
              <div className="mt-2 text-[10px] text-black/40">Transparent PNG or SVG recommended.</div>
            </div>
            <Field label="Sort order" name="sort_order" type="number" defaultValue={items.length * 10} />
            <Checkbox label="Published" name="published" defaultChecked />
            <Btn type="submit" variant="solid">Create brand</Btn>
          </form>
        </section>

        <section>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-black/50 mb-4">All brands ({items.length})</h2>
          <div className="space-y-3">
            {items.length === 0 && <div className="text-sm text-black/40 border hairline p-6">No brands yet.</div>}
            {items.map((b) => (
              <details key={b.id} className="border hairline">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {b.logo_url && (
                      <div className="relative h-8 w-16 shrink-0">
                        <Image src={b.logo_url} alt={b.name} fill className="object-contain" />
                      </div>
                    )}
                    <span className="font-display text-xl tracking-tight truncate">{b.name}</span>
                  </div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-black/50">{b.published ? "Published" : "Hidden"}</span>
                </summary>
                <form action={upsertBrand} className="space-y-4 p-4 border-t hairline" encType="multipart/form-data">
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="logo_url" value={b.logo_url ?? ""} />
                  <Field label="Name" name="name" defaultValue={b.name} required />
                  <Field label="Slug" name="slug" defaultValue={b.slug} required />
                  <Field label="Website URL" name="website_url" type="url" defaultValue={b.website_url ?? ""} />
                  <Field label="Description" name="description" defaultValue={b.description ?? ""} textarea rows={2} />
                  <div>
                    <div className="text-[10px] tracking-[0.25em] uppercase text-black/50 mb-2">Replace logo</div>
                    <FileInput name="logo_file" accept="image/*" multiple={false} label="Choose new logo" />
                  </div>
                  <Field label="Sort order" name="sort_order" type="number" defaultValue={b.sort_order} />
                  <Checkbox label="Published" name="published" defaultChecked={b.published} />
                  <Btn type="submit" variant="solid">Save</Btn>
                </form>
                <form action={deleteBrand} className="p-4 border-t hairline">
                  <input type="hidden" name="id" value={b.id} />
                  <Btn type="submit" variant="danger">Delete brand</Btn>
                </form>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
