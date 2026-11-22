"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const BASE = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
];
const TAIL = [
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    ...BASE,
    ...categories.map((c) => ({ href: `/work/${c.slug}`, label: c.name.toUpperCase() })),
    ...TAIL,
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled ? "bg-black/70 backdrop-blur-md border-b hairline" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10 h-16 md:h-20">
        <Link href="/" className="font-display text-xl md:text-2xl tracking-tight">
          TJ Ibrahim
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-xs tracking-[0.18em] uppercase">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "relative text-white/70 hover:text-white transition-colors",
                pathname === it.href && "text-white"
              )}
            >
              {it.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-white/90 p-2 -mr-2"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 top-16 bg-black z-40"
          >
            <nav className="flex flex-col px-6 py-8 gap-4 text-2xl font-display">
              {items.map((it, i) => (
                <motion.div
                  key={it.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={it.href} onClick={() => setOpen(false)} className="block py-1 border-b hairline">
                    {it.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
