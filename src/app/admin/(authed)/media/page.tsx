import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Btn, Field } from "@/components/admin/Toolbar";
import { uploadMedia, updateMedia, deleteMedia } from "./actions";

type Media = {
  id: string; url: string; path: string | null; type: string;
  filename: string | null; size_bytes: number | null; alt: string | null; created_at: string;
};

function pretty(bytes: number | null) {
  if (!bytes) return "";
  const u = ["B", "KB", "MB", "GB"];
  let n = bytes, i = 0;
  while (n > 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(1)} ${u[i]}`;
}

export default async function MediaPage({ searchParams }: PageProps<"/admin/media">) {
  const sp = await searchParams;
  const q = typeof sp?.q === "string" ? sp.q : "";
  const sb = await createClient();
  let query = sb.from("media").select("*").order("created_at", { ascending: false });
  if (q) query = query.ilike("filename", `%${q}%`);
  const { data } = await query;
  const items = (data ?? []) as Media[];

  return (
    <>
      <PageHeader title="Media Library" subtitle="Upload, preview and reuse photos and videos." />
      <section className="border hairline p-6 mb-10">
        <form action={uploadMedia} encType="multipart/form-data" className="space-y-4">
          <div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2">Files</div>
            <input type="file" name="files" accept="image/*,video/*" multiple className="text-sm text-white/80" />
            <div className="mt-2 text-[10px] text-white/40">Images and videos supported. Max per file depends on your Supabase plan.</div>
          </div>
          <Field label="Alt text (applied to all)" name="alt" placeholder="Descriptive alt text" />
          <Btn type="submit" variant="solid">Upload</Btn>
        </form>
      </section>

      <form className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by filename..."
          className="w-full md:w-80 bg-transparent border hairline focus:border-white outline-none px-3 py-2 text-sm"
        />
      </form>

      {items.length === 0 ? (
        <div className="py-20 text-center text-white/40 text-sm tracking-[0.2em] uppercase border hairline">
          No media yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((m) => (
            <div key={m.id} className="border hairline group">
              <div className="relative aspect-square bg-neutral-900">
                {m.type === "video" ? (
                  <video src={m.url} muted className="h-full w-full object-cover" />
                ) : (
                  <Image src={m.url} alt={m.alt ?? ""} fill className="object-cover" sizes="25vw" />
                )}
              </div>
              <div className="p-3 text-[10px] text-white/60 space-y-2">
                <div className="truncate" title={m.filename ?? ""}>{m.filename}</div>
                <div className="flex justify-between text-white/40">
                  <span>{m.type}</span>
                  <span>{pretty(m.size_bytes)}</span>
                </div>
                <form action={updateMedia} className="space-y-2">
                  <input type="hidden" name="id" value={m.id} />
                  <input
                    name="alt"
                    defaultValue={m.alt ?? ""}
                    placeholder="alt text"
                    className="w-full bg-transparent border hairline focus:border-white outline-none px-2 py-1 text-xs"
                  />
                  <button className="text-[10px] tracking-[0.25em] uppercase text-white/70 hover:text-white">Save alt</button>
                </form>
                <div className="flex justify-between items-center pt-1">
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white">open</a>
                  <form action={deleteMedia}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="path" value={m.path ?? ""} />
                    <button className="text-red-300 hover:text-red-200 text-[10px] tracking-[0.25em] uppercase">Delete</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
