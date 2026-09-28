"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { googleMapsUrl } from "@/lib/maps";
import { useI18n } from "@/lib/i18n";

export function MapLink({
  address,
  lat,
  lng,
  compact,
}: {
  address: string;
  lat?: number;
  lng?: number;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const href = googleMapsUrl(address, lat, lng);
  if (compact) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
      >
        <MapPin size={13} /> {t("openInMaps")}
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-2 rounded-xl bg-forest px-3 py-2 text-xs font-bold text-white hover:bg-[#064c3b]"
    >
      <ExternalLink size={14} /> {t("openInMaps")}
    </a>
  );
}
