import "server-only";
import { createReadClient } from "./supabase/server";
import type { Brand, Category, Project, ProjectMedia, SocialLink } from "./types";

export const DEFAULT_CONTENT = {
  hero: {
    name: "TJ IBRAHIM",
    role: "Content Creator / Photographer / Video Editor",
    tagline: "Crafting cinematic stories through light, motion and emotion.",
    cta: "View work",
  },
  about: {
    heading: "About",
    bio: "I'm a passionate Content Creator, Photographer & Video Editor with 6+ years of professional experience capturing compelling visuals that help brands and individuals tell their story across digital platforms.",
    specialties: ["Photography", "Videography", "Content Creation", "Video Editing"],
    stats: [
      { label: "Years", value: "6+" },
      { label: "Projects", value: "—" },
      { label: "Clients", value: "—" },
    ],
  },
  work: {
    heading: "Selected work",
    intro: "A curated selection of recent projects across brands, events and personal stories.",
  },
  brands: {
    heading: "Brands & collaborators",
    intro: "Trusted by teams that care about craft.",
  },
  contact: {
    heading: "Let's create something",
    intro: "Available for commissions, collaborations and creative direction.",
    email: "",
    whatsapp_number: "",
    whatsapp_message: "Hello TJ, I would like to discuss a creative project with you.",
  },
  footer: { text: "© TJ Ibrahim. All rights reserved." },
  seo: {
    title: "TJ Ibrahim — Content Creator, Photographer & Video Editor",
    description: "The portfolio of TJ Ibrahim — cinematic photography, videography and content for brands.",
    og_image: "",
  },
};

type ContentKey = keyof typeof DEFAULT_CONTENT;
type ContentShape = { [K in ContentKey]: typeof DEFAULT_CONTENT[K] };

function envConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getContent(): Promise<ContentShape> {
  if (!envConfigured()) return DEFAULT_CONTENT;
  try {
    const sb = await createReadClient();
    const { data } = await sb.from("site_content").select("key,value");
    const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) as Partial<ContentShape>;
    return { ...DEFAULT_CONTENT, ...map } as ContentShape;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function getCategories(opts: { navOnly?: boolean } = {}): Promise<Category[]> {
  if (!envConfigured()) return [];
  try {
    const sb = await createReadClient();
    let q = sb.from("categories").select("*").eq("published", true).order("sort_order");
    if (opts.navOnly) q = q.eq("show_in_nav", true);
    const { data } = await q;
    return (data ?? []) as Category[];
  } catch {
    return [];
  }
}

export async function getProjects(opts: { categorySlug?: string; featured?: boolean; limit?: number } = {}): Promise<Project[]> {
  if (!envConfigured()) return [];
  try {
    const sb = await createReadClient();
    let q = sb.from("projects").select("*, categories!inner(slug)").eq("published", true);
    if (opts.featured) q = q.eq("featured", true);
    if (opts.categorySlug) q = q.eq("categories.slug", opts.categorySlug);
    q = q.order("sort_order").order("created_at", { ascending: false });
    if (opts.limit) q = q.limit(opts.limit);
    const { data } = await q;
    return (data ?? []) as unknown as Project[];
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<{ project: Project; media: ProjectMedia[]; brands: Brand[] } | null> {
  if (!envConfigured()) return null;
  try {
    const sb = await createReadClient();
    const { data: project } = await sb.from("projects").select("*").eq("slug", slug).eq("published", true).maybeSingle();
    if (!project) return null;
    const [{ data: media }, { data: pb }] = await Promise.all([
      sb.from("project_media").select("*").eq("project_id", project.id).order("sort_order"),
      sb.from("project_brands").select("brand_id, brands(*)").eq("project_id", project.id),
    ]);
    const brands = (pb ?? []).map((r: { brands: Brand | Brand[] | null }) => Array.isArray(r.brands) ? r.brands[0] : r.brands).filter(Boolean) as Brand[];
    return { project: project as Project, media: (media ?? []) as ProjectMedia[], brands };
  } catch {
    return null;
  }
}

export async function getBrands(): Promise<Brand[]> {
  if (!envConfigured()) return [];
  try {
    const sb = await createReadClient();
    const { data } = await sb.from("brands").select("*").eq("published", true).order("sort_order");
    return (data ?? []) as Brand[];
  } catch {
    return [];
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  if (!envConfigured()) return [];
  try {
    const sb = await createReadClient();
    const { data } = await sb.from("social_links").select("*").eq("published", true).order("sort_order");
    return (data ?? []) as SocialLink[];
  } catch {
    return [];
  }
}
