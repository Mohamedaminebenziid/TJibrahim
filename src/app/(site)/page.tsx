import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/site/Hero";
import Reveal from "@/components/site/Reveal";
import { getBrands, getCategories, getContent, getProjects } from "@/lib/content";
import { youtubeThumbnail } from "@/lib/utils";

export default async function HomePage() {
  const [content, categories, featured, brands] = await Promise.all([
    getContent(),
    getCategories({ navOnly: true }),
    getProjects({ featured: true, limit: 4 }),
    getBrands(),
  ]);
  const projects = featured.length > 0 ? featured : await getProjects({ limit: 4 });

  return (
    <>
      <Hero
        name={content.hero.name}
        role={content.hero.role}
        tagline={content.hero.tagline}
        cta={content.hero.cta}
        videoSrc={content.hero.video_url || "/hero.mp4"}
      />

      {/* About preview */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 py-24 md:py-36">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4 text-[11px] tracking-[0.3em] uppercase text-white/50">
            {content.about.heading}
          </div>
          <Reveal className="md:col-span-8">
            <p className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
              {content.about.bio}
            </p>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-xs tracking-[0.2em] uppercase text-white/60">
              {content.about.specialties.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase border-b hairline hover:border-white pb-1"
            >
              More about me <span>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured work */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24 md:pb-36">
        <Reveal className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-3">
              {content.work.heading}
            </div>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight">Featured projects</h2>
          </div>
          <Link href="/work" className="hidden md:inline-block text-xs tracking-[0.25em] uppercase border-b hairline hover:border-white pb-1">
            All work →
          </Link>
        </Reveal>

        {projects.length === 0 ? (
          <div className="py-24 text-center text-white/40 text-sm tracking-[0.2em] uppercase border hairline">
            New projects coming soon.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => {
              const img = p.cover_url || p.thumb_url || youtubeThumbnail(p.youtube_url);
              return (
                <Reveal key={p.id} delay={i * 0.05}>
                  <Link href={`/projects/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                      {img ? (
                        <Image
                          src={img}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1200ms]"
                        />
                      ) : (
                        <div className="h-full w-full bg-neutral-800" />
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <h3 className="font-display text-2xl md:text-3xl tracking-tight">{p.title}</h3>
                      <span className="text-[10px] tracking-[0.25em] uppercase text-white/50">{p.year ?? ""}</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* Categories strip */}
      {categories.length > 0 && (
        <section className="border-y hairline">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-10 flex flex-wrap items-center gap-x-10 gap-y-4 text-xs tracking-[0.3em] uppercase text-white/70">
            <span className="text-white/40">Explore</span>
            {categories.map((c) => (
              <Link key={c.id} href={`/work/${c.slug}`} className="hover:text-white">
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-6 md:px-10 py-24 md:py-36">
          <Reveal>
            <div className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-3">
              {content.brands.heading}
            </div>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight">{content.brands.intro}</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 items-center">
            {brands.map((b) => (
              <div key={b.id} className="relative h-16 opacity-60 hover:opacity-100 transition">
                {b.logo_url ? (
                  <Image src={b.logo_url} alt={b.name} fill className="object-contain invert brightness-200" />
                ) : (
                  <div className="text-center text-white/80 text-sm">{b.name}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact teaser */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 py-24 md:py-36 border-t hairline">
        <Reveal>
          <div className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-4">Contact</div>
          <h2 className="font-display text-5xl md:text-8xl tracking-tight leading-[0.95]">
            {content.contact.heading}
          </h2>
          <p className="mt-6 max-w-xl text-white/70">{content.contact.intro}</p>
          <Link href="/contact" className="mt-10 inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase border-b hairline hover:border-white pb-1">
            Get in touch →
          </Link>
        </Reveal>
      </section>
    </>
  );
}
