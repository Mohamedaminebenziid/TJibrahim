export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  sort_order: number;
  published: boolean;
  show_in_nav: boolean;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  sort_order: number;
  published: boolean;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  cover_url: string | null;
  thumb_url: string | null;
  youtube_url: string | null;
  video_url: string | null;
  year: number | null;
  project_date: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectMedia = {
  id: string;
  project_id: string;
  url: string;
  type: "image" | "video" | "youtube";
  caption: string | null;
  alt: string | null;
  sort_order: number;
};

export type SiteContent = Record<string, unknown>;

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  label: string | null;
  sort_order: number;
  published: boolean;
};
