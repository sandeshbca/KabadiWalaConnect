"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ClickableImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("kc-lightbox", { detail: { src, alt } }),
        )
      }
      className="block overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
    >
      <img src={src} alt={alt} className={className} />
    </button>
  );
}

export function ImageLightboxHost() {
  const [open, setOpen] = useState<{ src: string; alt: string } | null>(null);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ src: string; alt: string }>).detail;
      setOpen(detail);
    };
    window.addEventListener("kc-lightbox", handler);
    return () => window.removeEventListener("kc-lightbox", handler);
  }, []);
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
        onClick={() => setOpen(null)}
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
          onClick={() => setOpen(null)}
        >
          <X size={22} />
        </button>
        <img
          src={open.src}
          alt={open.alt}
          className="max-h-[90vh] max-w-full rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}
