import Reveal from "@/components/site/Reveal";
import { getContent } from "@/lib/content";

export const revalidate = 60;

export default async function AboutPage() {
  const { about } = await getContent();
  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-10 pt-32 md:pt-40 pb-24">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4 text-[11px] tracking-[0.3em] uppercase text-white/50">
          {about.heading}
        </div>
        <Reveal className="md:col-span-8">
          <p className="font-display text-3xl md:text-6xl leading-[1.1] tracking-tight whitespace-pre-line">
            {about.bio}
          </p>
        </Reveal>
      </div>

      {about.specialties.length > 0 && (
        <div className="mt-24 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4 text-[11px] tracking-[0.3em] uppercase text-white/50">Specialties</div>
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-4">
            {about.specialties.map((s, i) => (
              <Reveal key={s} delay={i * 0.05} className="flex items-baseline gap-4 border-b hairline py-4">
                <span className="text-xs text-white/40 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-2xl md:text-3xl tracking-tight">{s}</span>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {about.stats.length > 0 && (
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 border-t hairline pt-10">
          {about.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-5xl md:text-7xl tracking-tight">{s.value}</div>
              <div className="mt-2 text-[11px] tracking-[0.25em] uppercase text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
