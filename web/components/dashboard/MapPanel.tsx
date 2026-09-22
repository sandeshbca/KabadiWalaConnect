"use client";
import { LocateFixed, MapPin } from "lucide-react";
import { useState } from "react";
import { Role } from "@/lib/types";
import { Card } from "@/components/ui";

export function MapPanel({ role }: { role: Role }) {
  const [src, setSrc] = useState(
    "https://maps.google.com/maps?q=Koramangala%20Bengaluru&z=13&output=embed",
  );
  const locate = () =>
    navigator.geolocation?.getCurrentPosition((p) =>
      setSrc(
        `https://maps.google.com/maps?q=${p.coords.latitude},${p.coords.longitude}&z=14&output=embed`,
      ),
    );
  const heading =
    role === "Citizen"
      ? "Nearby verified collectors"
      : role === "Collector"
        ? "Requests near your route"
        : "Network location";
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <div>
          <b className="text-sm text-forest">{heading}</b>
          <p className="mt-1 text-xs text-slate-500">Google Maps • Bengaluru</p>
        </div>
        <button
          onClick={locate}
          className="flex items-center gap-1 rounded-xl bg-mint px-3 py-2 text-xs font-bold text-forest"
        >
          <LocateFixed size={14} />
          Locate me
        </button>
      </div>
      <iframe
        title="Google Maps location"
        src={src}
        className="h-60 w-full border-0"
        loading="lazy"
      />
      <p className="flex gap-2 p-4 text-xs text-slate-500">
        <MapPin size={15} className="text-emerald-600" />
        Use your live location for pickups and delivery routes.
      </p>
    </Card>
  );
}
