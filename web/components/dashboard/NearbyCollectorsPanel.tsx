"use client";

import { MapPin, Phone, Star } from "lucide-react";
import { NearbyCollector } from "@/lib/types";
import { Card } from "@/components/ui";
import { MapLink } from "@/components/ui/MapLink";
import { useI18n } from "@/lib/i18n";

export function NearbyCollectorsPanel({
  collectors,
  recyclers,
}: {
  collectors: NearbyCollector[];
  recyclers: NearbyCollector[];
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <PartnerList title={t("nearbyCollectors")} items={collectors} />
      <PartnerList title={t("nearbyRecyclers")} items={recyclers} />
    </div>
  );
}

function PartnerList({
  title,
  items,
}: {
  title: string;
  items: NearbyCollector[];
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-emerald-100 p-5">
        <h2 className="text-lg font-black text-forest">{title}</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {items.length ? (
          items.map((c) => (
            <div key={c.id} className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <b className="text-sm text-forest">{c.name}</b>
                {c.ratingCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star size={12} fill="currentColor" /> {c.ratingAvg} (
                    {c.ratingCount})
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                <Phone size={12} /> {c.phone}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-700">
                <MapPin size={12} /> {c.area} ·{" "}
                {c.distanceKm < 9000 ? `${c.distanceKm} km` : "—"}
              </p>
              <MapLink address={c.area} lat={c.lat} lng={c.lng} compact />
            </div>
          ))
        ) : (
          <p className="p-6 text-center text-sm text-slate-500">No partners found.</p>
        )}
      </div>
    </Card>
  );
}
