"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-emerald-950/5 bg-white shadow-card ${className}`}
    >
      {children}
    </section>
  );
}
export function Tag({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: "green" | "gold";
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${tone === "green" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
    >
      {children}
    </span>
  );
}
export function Modal({
  children,
  close,
}: {
  children: ReactNode;
  close: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-forest/50 p-4"
    >
      <motion.div
        initial={{ y: 16, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <button
          onClick={close}
          className="absolute right-4 top-4 p-2 text-slate-500"
          aria-label="Close"
        >
          <X size={19} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
