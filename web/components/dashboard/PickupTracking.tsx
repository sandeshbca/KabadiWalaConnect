"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { PickupRequest } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

const steps = [
  { key: "New", labelKey: "trackingNew" as const },
  { key: "Accepted", labelKey: "trackingAccepted" as const },
  { key: "Collected", labelKey: "trackingCollected" as const },
  { key: "Verified", labelKey: "trackingVerified" as const },
];

export function PickupTracking({ pickup }: { pickup: PickupRequest }) {
  const { t } = useI18n();
  const idx = steps.findIndex((s) => s.key === pickup.status);
  return (
    <ol className="mt-3 flex flex-wrap gap-2">
      {steps.map((step, i) => {
        const done = i <= idx;
        return (
          <li
            key={step.key}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
              done
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {done ? <CheckCircle2 size={12} /> : <Circle size={12} />}
            {t(step.labelKey)}
          </li>
        );
      })}
    </ol>
  );
}
