import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import {
  LayoutDashboard, FolderKanban, Tags, Images, Building2, FileText, MessageSquare, Share2, Search, LogOut,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/media", label: "Media Library", icon: Images },
  { href: "/admin/brands", label: "Brands", icon: Building2 },
  { href: "/admin/content", label: "Website Content", icon: FileText },
  { href: "/admin/contact", label: "Contact Settings", icon: MessageSquare },
  { href: "/admin/social", label: "Social Links", icon: Share2 },
  { href: "/admin/seo", label: "SEO Settings", icon: Search },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();

  // Login page uses this layout but should render stand-alone.
  // We detect by absence of session and let the route render; middleware already enforces redirect.
  if (!user) {
    // The /admin/login page handles its own UI (no sidebar). If somehow here without a session, redirect.
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-64 shrink-0 border-r hairline min-h-screen sticky top-0 hidden md:flex md:flex-col">
        <div className="px-6 py-6 border-b hairline">
          <Link href="/admin" className="font-display text-xl tracking-tight">TJ · Admin</Link>
        </div>
        <nav className="flex-1 py-4">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 px-6 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5"
            >
              <n.icon size={16} />
              {n.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="p-4 border-t hairline">
          <button className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white">
            <LogOut size={14} /> Sign out
          </button>
        </form>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="md:hidden sticky top-0 z-10 bg-black border-b hairline px-4 py-3 flex items-center gap-4 overflow-x-auto">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-[10px] tracking-[0.2em] uppercase text-white/60 hover:text-white whitespace-nowrap">
              {n.label}
            </Link>
          ))}
        </div>
        <div className="p-6 md:p-10 max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
