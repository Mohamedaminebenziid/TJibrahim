import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Btn } from "@/components/admin/Toolbar";

async function counts() {
  const sb = await createClient();
  const [projects, pub, cats, brands, media] = await Promise.all([
    sb.from("projects").select("id", { count: "exact", head: true }),
    sb.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
    sb.from("categories").select("id", { count: "exact", head: true }),
    sb.from("brands").select("id", { count: "exact", head: true }),
    sb.from("media").select("id", { count: "exact", head: true }),
  ]);
  return {
    projects: projects.count ?? 0,
    published: pub.count ?? 0,
    categories: cats.count ?? 0,
    brands: brands.count ?? 0,
    media: media.count ?? 0,
  };
}

export default async function AdminOverview() {
  const c = await counts();
  const stats = [
    { label: "Projects", value: c.projects, href: "/admin/projects" },
    { label: "Published", value: c.published, href: "/admin/projects" },
    { label: "Categories", value: c.categories, href: "/admin/categories" },
    { label: "Brands", value: c.brands, href: "/admin/brands" },
    { label: "Media files", value: c.media, href: "/admin/media" },
  ];
  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Manage your portfolio content."
        action={<Btn href="/admin/projects/new" variant="solid">+ New project</Btn>}
      />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="border hairline p-6 hover:bg-white/5 transition">
            <div className="font-display text-5xl tracking-tight">{s.value}</div>
            <div className="mt-2 text-[10px] tracking-[0.25em] uppercase text-white/50">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-14">
        <h2 className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-4">Quick actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Btn href="/admin/projects/new">New project</Btn>
          <Btn href="/admin/categories">Manage categories</Btn>
          <Btn href="/admin/brands">Manage brands</Btn>
          <Btn href="/admin/media">Upload media</Btn>
          <Btn href="/admin/content">Edit website text</Btn>
          <Btn href="/admin/contact">Contact & WhatsApp</Btn>
        </div>
      </div>
    </>
  );
}
