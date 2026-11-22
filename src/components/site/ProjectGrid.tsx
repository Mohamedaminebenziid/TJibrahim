"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import type { Category, Project } from "@/lib/types";
import { cn, youtubeThumbnail } from "@/lib/utils";

export default function ProjectGrid({
  projects,
  categories,
  initialCategory = "all",
  showFilters = true,
}: {
  projects: Project[];
  categories: Category[];
  initialCategory?: string;
  showFilters?: boolean;
}) {
  const [active, setActive] = useState(initialCategory);
  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category_id === categories.find((c) => c.slug === active)?.id)),
    [active, projects, categories]
  );

  return (
    <div>
      {showFilters && (
        <div className="flex flex-wrap gap-x-6 gap-y-3 mb-10 md:mb-14 text-xs tracking-[0.2em] uppercase">
          <button
            onClick={() => setActive("all")}
            className={cn("text-white/50 hover:text-white transition", active === "all" && "text-white")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.slug)}
              className={cn("text-white/50 hover:text-white transition", active === c.slug && "text-white")}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="popLayout">
        <motion.div
          key={active}
          layout
          className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 auto-rows-[minmax(220px,auto)]"
        >
          {filtered.length === 0 && (
            <div className="col-span-full py-24 text-center text-white/40 text-sm tracking-[0.2em] uppercase">
              No projects yet — check back soon.
            </div>
          )}
          {filtered.map((p, i) => {
            // Asymmetric pattern: alternate spans for editorial feel
            const spanClasses = [
              "md:col-span-4 md:row-span-2",
              "md:col-span-2 md:row-span-1",
              "md:col-span-2 md:row-span-1",
              "md:col-span-3 md:row-span-1",
              "md:col-span-3 md:row-span-2",
              "md:col-span-3 md:row-span-1",
            ];
            const span = spanClasses[i % spanClasses.length];
            const img = p.cover_url || p.thumb_url || youtubeThumbnail(p.youtube_url) || "";
            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className={cn("group relative overflow-hidden bg-neutral-900 min-h-[220px]", span)}
              >
                <Link href={`/projects/${p.slug}`} className="block h-full w-full">
                  {img ? (
                    <Image
                      src={img}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-neutral-800 to-neutral-950" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-95 transition" />
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <div className="text-[10px] tracking-[0.25em] uppercase text-white/70">
                      {p.year ?? ""}{p.tags?.[0] ? ` · ${p.tags[0]}` : ""}
                    </div>
                    <div className="mt-2 font-display text-2xl md:text-4xl leading-none tracking-tight">
                      {p.title}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
