"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxItem = { url: string; type?: "image" | "video"; caption?: string | null; alt?: string | null };

export default function Lightbox({ items }: { items: LightboxItem[] }) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(() => setI((v) => (v - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setI((v) => (v + 1) % items.length), [items.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {items.map((m, idx) => (
          <button
            key={idx}
            onClick={() => { setI(idx); setOpen(true); }}
            className="group relative aspect-[4/3] overflow-hidden bg-neutral-900"
          >
            {m.type === "video" ? (
              <video src={m.url} muted className="h-full w-full object-cover" />
            ) : (
              <Image
                src={m.url}
                alt={m.alt ?? ""}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={close}
          >
            <button onClick={close} className="absolute top-5 right-5 text-white/80 hover:text-white p-2" aria-label="Close">
              <X size={24} />
            </button>
            {items.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 md:left-8 text-white/60 hover:text-white p-2" aria-label="Previous">
                  <ChevronLeft size={32} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 md:right-8 text-white/60 hover:text-white p-2" aria-label="Next">
                  <ChevronRight size={32} />
                </button>
              </>
            )}
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-[92vw] max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {items[i].type === "video" ? (
                <video src={items[i].url} controls autoPlay className="max-h-[85vh] max-w-full" />
              ) : (
                <Image
                  src={items[i].url}
                  alt={items[i].alt ?? ""}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              )}
            </motion.div>
            {items[i].caption && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] uppercase text-white/60">
                {items[i].caption}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
