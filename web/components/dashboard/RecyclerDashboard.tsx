"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ImageIcon, MapPin, PackageSearch } from "lucide-react";
import { AnalyticsOverview, InventoryListing } from "@/lib/types";
import { Card, Tag } from "@/components/ui";
import { ClickableImage } from "@/components/ui/ImageLightbox";

export function RecyclerDashboard({
  listings,
  reserve,
  busyId,
  analytics,
}: {
  listings: InventoryListing[];
  reserve: (id: string) => void;
  busyId?: string;
  analytics?: AnalyticsOverview;
}) {
  const available = listings.filter((listing) => listing.status === "Available");
  const chartData = (analytics?.monthly || []).map((v, i) => ({
    day: ["M", "T", "W", "T", "F", "S", "S"][i],
    kg: v,
  }));
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <Card className="p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">
            Supply analysis
          </p>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="kg"
                  stroke="#064e3b"
                  fill="#a7f3d0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 border-t border-emerald-100 pt-4 text-center text-sm">
            <span>
              <b className="text-forest">{analytics?.recycledKg || 0} kg</b>
              <small className="block text-slate-500">tracked</small>
            </span>
            <span>
              <b className="text-forest">{available.length}</b>
              <small className="block text-slate-500">available lots</small>
            </span>
            <span>
              <b className="text-forest">{analytics?.collectors || 0}</b>
              <small className="block text-slate-500">collectors</small>
            </span>
          </div>
        </Card>
        <Card className="flex flex-col justify-between bg-forest p-6 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-lime">
            <PackageSearch size={20} />
          </span>
          <div>
            <h2 className="mt-2 text-3xl font-black">{available.length} lots</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-100">
              Reserve material from nearby verified collectors.
            </p>
          </div>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-emerald-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-lg font-black text-forest">Collector stock</h2>
          </div>
          <Tag>Live</Tag>
        </div>
        <div className="divide-y divide-slate-100">
          {listings.length ? (
            listings.map((listing) => (
              <div
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:px-6"
                key={listing.id}
              >
                {listing.imageUrl ? (
                  <ClickableImage
                    src={listing.imageUrl}
                    alt={listing.material}
                    className="h-24 w-full rounded-xl object-cover sm:w-28"
                  />
                ) : (
                  <span className="grid h-24 w-full place-items-center rounded-xl bg-emerald-50 text-emerald-600 sm:w-28">
                    <ImageIcon size={23} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <b className="text-sm text-forest">{listing.material}</b>
                    <StockTag status={listing.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {listing.weight} · {listing.price} · {listing.seller}
                  </p>
                  {listing.description && (
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {listing.description}
                    </p>
                  )}
                  <p className="mt-1 flex items-center gap-1 text-xs text-emerald-700">
                    <MapPin size={13} />
                    {listing.area}
                  </p>
                </div>
                {listing.status === "Available" ? (
                  <button
                    disabled={busyId === listing.id}
                    onClick={() => reserve(listing.id)}
                    className="shrink-0 rounded-xl bg-forest px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#064c3b] disabled:opacity-60"
                  >
                    {busyId === listing.id ? "Reserving…" : "Reserve lot"}
                  </button>
                ) : (
                  <StockTag status={listing.status} />
                )}
              </div>
            ))
          ) : (
            <p className="p-8 text-center text-sm text-slate-500">
              No available stock yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

function StockTag({ status }: { status: InventoryListing["status"] }) {
  return <Tag tone={status === "Available" ? "green" : "gold"}>{status}</Tag>;
}
