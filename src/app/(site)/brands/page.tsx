import Image from "next/image";
import Reveal from "@/components/site/Reveal";
import { getBrands, getContent } from "@/lib/content";

export const revalidate = 60;

export default async function BrandsPage() {
  const [{ brands: copy }, brands] = await Promise.all([getContent(), getBrands()]);
  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-10 pt-32 md:pt-40 pb-24">
      <Reveal>
        <div className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-3">{copy.heading}</div>
        <h1 className="font-display text-5xl md:text-8xl tracking-tight leading-[0.95]">{copy.intro}</h1>
      </Reveal>
      {brands.length === 0 ? (
        <div className="mt-20 py-24 text-center text-white/40 text-sm tracking-[0.2em] uppercase border hairline">
          Brand list coming soon.
        </div>
      ) : (
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-10 gap-y-14 items-center">
          {brands.map((b) => {
            const inner = b.logo_url ? (
              <div className="relative h-20 w-full opacity-70 hover:opacity-100 transition">
                <Image src={b.logo_url} alt={b.name} fill className="object-contain invert brightness-200" />
              </div>
            ) : (
              <div className="font-display text-2xl text-white/80 hover:text-white">{b.name}</div>
            );
            return b.website_url ? (
              <a key={b.id} href={b.website_url} target="_blank" rel="noopener noreferrer">{inner}</a>
            ) : (
              <div key={b.id}>{inner}</div>
            );
          })}
        </div>
      )}
    </section>
  );
}
