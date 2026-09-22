"use client";

import { motion } from "framer-motion";
import { CalendarClock, ImageIcon, MapPin, Phone, Plus, User } from "lucide-react";
import { PickupRequest } from "@/lib/types";
import { Card, Tag } from "@/components/ui";
import { ClickableImage } from "@/components/ui/ImageLightbox";
import { PickupTracking } from "@/components/dashboard/PickupTracking";
import { useI18n } from "@/lib/i18n";

export function CitizenDashboard({
  pickups,
  bookPickup,
}: {
  pickups: PickupRequest[];
  bookPickup: () => void;
}) {
  const { t } = useI18n();
  const bars = [35, 50, 45, 70, 60, 82, 96];
  const recycled = pickups
    .filter((p) => p.status === "Verified")
    .reduce((s, p) => s + (p.weightKg || 0), 0);
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">
                Impact analysis
              </p>
              <h2 className="mt-1 text-lg font-black text-forest">
                Your recycling trend
              </h2>
            </div>
          </div>
          <div className="mt-6 flex h-28 items-end gap-2">
            {bars.map((height, index) => (
              <motion.i
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                key={index}
                className={`block flex-1 rounded-t-lg ${index === 6 ? "bg-lime" : "bg-emerald-200"}`}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 border-t border-emerald-100 pt-4 text-center text-sm">
            <span>
              <b className="text-forest">{Math.round(recycled)} kg</b>
              <small className="block text-slate-500">recycled</small>
            </span>
            <span>
              <b className="text-forest">{Math.round(recycled * 2.4)} kg</b>
              <small className="block text-slate-500">CO₂ saved</small>
            </span>
            <span>
              <b className="text-forest">{pickups.length}</b>
              <small className="block text-slate-500">pickups</small>
            </span>
          </div>
        </Card>
        <Card className="flex flex-col justify-between bg-forest p-6 text-white">
          <div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-lime">
              <CalendarClock size={20} />
            </span>
            <h2 className="mt-5 text-xl font-black">{t("schedulePickup")}</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-100">
              Add photo, weight and payment method. Price is estimated from live market rates.
            </p>
          </div>
          <button
            onClick={bookPickup}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-forest transition hover:bg-[#d7ff91]"
          >
            <Plus size={16} /> {t("schedulePickup")}
          </button>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-emerald-100 p-5 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">
              {t("pickupTracker")}
            </p>
            <h2 className="mt-1 text-lg font-black text-forest">Your requests</h2>
          </div>
          <button
            onClick={bookPickup}
            className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
          >
            New pickup
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {pickups.length ? (
            pickups.map((pickup) => (
              <div className="flex gap-4 p-5 sm:px-6" key={pickup.id}>
                {pickup.imageUrl ? (
                  <ClickableImage
                    src={pickup.imageUrl}
                    alt={pickup.waste}
                    className="h-16 w-16 shrink-0 object-cover"
                  />
                ) : (
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ImageIcon size={21} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <b className="text-sm text-forest">{pickup.waste}</b>
                    <PickupTag status={pickup.status} />
                  </div>
                  <PickupTracking pickup={pickup} />
                  <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={13} className="text-emerald-600" />
                    {pickup.area}
                  </p>
                  {pickup.estimatedAmount != null && (
                    <p className="mt-1 text-xs font-bold text-emerald-700">
                      {t("estimatedValue")}: ₹{pickup.estimatedAmount} ·{" "}
                      {pickup.paymentMethod?.toUpperCase()}
                    </p>
                  )}
                  {pickup.collector && pickup.status !== "New" && (
                    <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs">
                      <p className="font-bold text-forest">Assigned collector</p>
                      <p className="mt-1 flex items-center gap-1">
                        <User size={12} /> {pickup.collector.name}
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone size={12} /> {pickup.collector.phone}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin size={12} /> {pickup.collector.address}
                      </p>
                    </div>
                  )}
                  {pickup.description && (
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {pickup.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    {pickup.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-8 text-center text-sm text-slate-500">
              No pickup requests yet. Schedule one when your dry waste is ready.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

function PickupTag({ status }: { status: PickupRequest["status"] }) {
  return <Tag tone={status === "Verified" ? "green" : "gold"}>{status}</Tag>;
}
