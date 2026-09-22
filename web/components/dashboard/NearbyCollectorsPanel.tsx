"use client";

import { MapPin, Phone, Star } from "lucide-react";
import { NearbyCollector } from "@/lib/types";
import { Card } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export function NearbyCollectorsPanel({
  collectors,
}: {
  collectors: NearbyCollector[];
}) {
  const { t } = useI18n();
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-emerald-100 p-5">
        <h2 className="text-lg font-black text-forest">{t("nearbyCollectors")}</h2>
        <p className="mt-1 text-xs text-slate-500">
          Verified collectors sorted by distance from your saved location.
        </p>
      </div>
      <div className="divide-y divide-slate-100">
        {collectors.length ? (
          collectors.map((c) => (
            <div key={c.id} className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <b className="text-sm text-forest">{c.name}</b>
                {c.ratingCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star size={12} fill="currentColor" /> {c.ratingAvg} ({c.ratingCount})
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                <Phone size={12} /> {c.phone}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-700">
                <MapPin size={12} /> {c.area} · {c.distanceKm < 9000 ? `${c.distanceKm} km` : "Distance N/A"}
              </p>
            </div>
          ))
        ) : (
          <p className="p-6 text-center text-sm text-slate-500">
            No verified collectors found yet. Set your area in profile location.
          </p>
        )}
      </div>
    </Card>
  );
}
