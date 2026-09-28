"use client";

import { motion } from "framer-motion";
import { PickupRequest } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

const steps = [
  { key: "New", labelKey: "trackingNew" as const, api: "requested" },
  { key: "Accepted", labelKey: "trackingAccepted" as const, api: "assigned" },
  { key: "Collected", labelKey: "trackingCollected" as const, api: "collected" },
  { key: "Verified", labelKey: "trackingVerified" as const, api: "verified" },
];

export function LivePickupTracker({ pickup }: { pickup: PickupRequest }) {
  const { t } = useI18n();
  const idx = steps.findIndex((s) => s.key === pickup.status);
  const history = pickup.statusHistory || [];

  return (
    <div className="mt-3 rounded-2xl border border-emerald-100 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {t("liveTracking")}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="h-1.5 w-1.5 rounded-full bg-red-500"
          />
          {t("liveNow")}
        </span>
      </div>
      <div className="relative flex justify-between gap-1">
        <div className="absolute left-4 right-4 top-4 h-0.5 bg-emerald-100" />
        <motion.div
          className="absolute left-4 top-4 h-0.5 bg-emerald-500"
          initial={{ width: 0 }}
          animate={{
            width: idx <= 0 ? "0%" : `${(idx / (steps.length - 1)) * 100}%`,
          }}
          style={{ maxWidth: "calc(100% - 2rem)" }}
        />
        {steps.map((step, i) => {
          const done = i <= idx;
          const active = i === idx;
          const hist = history.find((h) => h.status === step.api);
          return (
            <div
              key={step.key}
              className="relative z-10 flex min-w-0 flex-1 flex-col items-center text-center"
            >
              <motion.span
                animate={active ? { scale: [1, 1.15, 1] } : {}}
                transition={{ repeat: active ? Infinity : 0, duration: 1.5 }}
                className={`grid h-8 w-8 place-items-center rounded-full text-[10px] font-black ${
                  done
                    ? "bg-forest text-lime shadow-md"
                    : "border-2 border-emerald-100 bg-white text-slate-400"
                }`}
              >
                {i + 1}
              </motion.span>
              <span
                className={`mt-1.5 line-clamp-2 text-[9px] font-bold leading-tight ${
                  done ? "text-emerald-800" : "text-slate-400"
                }`}
              >
                {t(step.labelKey)}
              </span>
              {hist?.at && (
                <span className="mt-0.5 text-[8px] text-slate-400">
                  {new Intl.DateTimeFormat(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "numeric",
                    month: "short",
                  }).format(new Date(hist.at))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
