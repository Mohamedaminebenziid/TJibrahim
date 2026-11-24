import Link from "next/link";
import { DEFAULT_CONTENT } from "@/lib/content";
import type { SocialLink } from "@/lib/types";

export default function Footer({
  content,
  socials,
}: {
  content: typeof DEFAULT_CONTENT;
  socials: SocialLink[];
}) {
  return (
    <footer className="border-t hairline mt-24">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="font-display text-3xl tracking-tight">TJ Ibrahim</div>
          <p className="mt-3 text-sm text-black/60 max-w-xs">{content.hero.tagline}</p>
        </div>
        <div className="text-sm">
          <div className="text-black/50 uppercase tracking-[0.2em] text-[11px] mb-3">Navigate</div>
          <ul className="space-y-2">
            <li><Link href="/work" className="hover:text-black text-black/70">Work</Link></li>
            <li><Link href="/about" className="hover:text-black text-black/70">About</Link></li>
            <li><Link href="/brands" className="hover:text-black text-black/70">Brands</Link></li>
            <li><Link href="/contact" className="hover:text-black text-black/70">Contact</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="text-black/50 uppercase tracking-[0.2em] text-[11px] mb-3">Elsewhere</div>
          <ul className="space-y-2">
            {socials.length === 0 && content.contact.email && (
              <li><a href={`mailto:${content.contact.email}`} className="hover:text-black text-black/70">{content.contact.email}</a></li>
            )}
            {socials.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-black text-black/70">
                  {s.label || s.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t hairline">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-6 text-xs text-black/40 flex flex-col md:flex-row md:justify-between gap-2">
          <span>{content.footer.text}</span>
          <span>Crafted with care.</span>
        </div>
      </div>
    </footer>
  );
}
