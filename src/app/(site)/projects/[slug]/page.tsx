import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import Lightbox from "@/components/site/Lightbox";
import YouTubeEmbed from "@/components/site/YouTubeEmbed";
import { getProjectBySlug } from "@/lib/content";
import { youtubeThumbnail } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);
  if (!data) return {};
  const { project } = data;
  return {
    title: project.seo_title || project.title,
    description: project.seo_description || project.description || undefined,
    openGraph: {
      title: project.seo_title || project.title,
      description: project.seo_description || project.description || undefined,
      images: project.cover_url ? [{ url: project.cover_url }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);
  if (!data) notFound();
  const { project, media, brands } = data;

  const heroImg = project.cover_url || youtubeThumbnail(project.youtube_url) || media[0]?.url;
  const images = media.filter((m) => m.type === "image");

  return (
    <article>
      {/* Hero */}
      <div className="relative h-[80svh] w-full overflow-hidden">
        {heroImg ? (
          <Image src={heroImg} alt={project.title} fill priority className="object-cover grayscale-[10%]" sizes="100vw" />
        ) : (
          <div className="h-full w-full bg-neutral-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-10 pb-16 max-w-[1600px] mx-auto">
          <Link href="/work" className="text-[11px] tracking-[0.3em] uppercase text-white/60 hover:text-white mb-6">← Back</Link>
          <div className="text-[11px] tracking-[0.3em] uppercase text-white/70 mb-3">
            {project.year ?? ""}{project.tags?.[0] ? ` · ${project.tags[0]}` : ""}
          </div>
          <h1 className="font-display text-5xl md:text-8xl tracking-tight leading-[0.95] max-w-5xl">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Description + meta */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 py-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4 space-y-8 text-sm">
          {brands.length > 0 && (
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Clients</div>
              <div className="text-white/90">{brands.map((b) => b.name).join(", ")}</div>
            </div>
          )}
          {project.year && (
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Year</div>
              <div className="text-white/90">{project.year}</div>
            </div>
          )}
          {project.tags.length > 0 && (
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span key={t} className="text-[10px] tracking-[0.2em] uppercase border hairline px-2 py-1">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <Reveal className="md:col-span-8">
          {project.description && (
            <p className="font-display text-2xl md:text-4xl leading-[1.2] tracking-tight whitespace-pre-line">
              {project.description}
            </p>
          )}
        </Reveal>
      </section>

      {/* YouTube */}
      {project.youtube_url && (
        <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-20">
          <YouTubeEmbed url={project.youtube_url} title={project.title} />
        </section>
      )}

      {/* Hosted video */}
      {project.video_url && (
        <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-20">
          <video src={project.video_url} controls className="w-full" />
        </section>
      )}

      {/* Gallery */}
      {images.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24">
          <div className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-8">Gallery</div>
          <Lightbox items={images.map((m) => ({ url: m.url, type: "image", caption: m.caption, alt: m.alt }))} />
        </section>
      )}
    </article>
  );
}
