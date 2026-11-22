import Reveal from "@/components/site/Reveal";
import { getContent, getSocialLinks } from "@/lib/content";
import { waLink } from "@/lib/utils";

export const revalidate = 60;

export default async function ContactPage() {
  const [{ contact }, socials] = await Promise.all([getContent(), getSocialLinks()]);
  const wa = contact.whatsapp_number ? waLink(contact.whatsapp_number, contact.whatsapp_message) : null;

  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-10 pt-32 md:pt-40 pb-24">
      <Reveal>
        <div className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-4">Contact</div>
        <h1 className="font-display text-6xl md:text-[10rem] leading-[0.9] tracking-tight">
          {contact.heading}
        </h1>
        <p className="mt-8 max-w-xl text-white/70 text-lg">{contact.intro}</p>
      </Reveal>

      <div className="mt-16 grid md:grid-cols-2 gap-10">
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="group border hairline p-8 md:p-10 flex items-center justify-between hover:bg-white hover:text-black transition-colors"
          >
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 group-hover:text-black/50 mb-2">WhatsApp</div>
              <div className="font-display text-3xl md:text-5xl tracking-tight">Message on WhatsApp</div>
            </div>
            <span className="text-2xl">→</span>
          </a>
        )}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="group border hairline p-8 md:p-10 flex items-center justify-between hover:bg-white hover:text-black transition-colors"
          >
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 group-hover:text-black/50 mb-2">Email</div>
              <div className="font-display text-3xl md:text-5xl tracking-tight break-all">{contact.email}</div>
            </div>
            <span className="text-2xl">→</span>
          </a>
        )}
      </div>

      {socials.length > 0 && (
        <div className="mt-20 border-t hairline pt-10">
          <div className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-6">Elsewhere</div>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-3xl md:text-4xl tracking-tight text-white/70 hover:text-white"
              >
                {s.label || s.platform}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
