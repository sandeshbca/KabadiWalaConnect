"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CheckCheck,
  ImageIcon,
  MapPin,
  PackagePlus,
  Phone,
  Route,
  User,
} from "lucide-react";
import { CollectorStats, InventoryListing, PickupRequest } from "@/lib/types";
import { Card, Tag } from "@/components/ui";
import { ClickableImage } from "@/components/ui/ImageLightbox";
import { MapLink } from "@/components/ui/MapLink";
import { useI18n } from "@/lib/i18n";

export function CollectorDashboard({
  requests,
  updateStatus,
  addStock,
  busyId,
  stats,
  assignToRecycler,
  myStock,
  verifyPickup,
}: {
  requests: PickupRequest[];
  updateStatus: (
    id: string,
    status: "Accepted" | "Collected" | "Verified",
  ) => void;
  addStock: () => void;
  busyId?: string;
  stats?: CollectorStats;
  assignToRecycler: (id: string) => void;
  myStock?: InventoryListing[];
  verifyPickup: (pickup: PickupRequest) => void;
}) {
  const { t } = useI18n();
  const newCount = requests.filter((request) => request.status === "New").length;
  const chartData = (stats?.monthly || []).map((v, i) => ({
    day: ["M", "T", "W", "T", "F", "S", "S"][i],
    earnings: v,
  }));
  const reserved = myStock?.filter((s) => s.status === "Reserved") || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickStat label={t("newPickup")} value={String(newCount)} detail="—" />
        <QuickStat
          label={t("earnings")}
          value={`₹${stats?.earnings ?? 0}`}
          detail={`${stats?.collectedKg ?? 0} kg`}
        />
        <QuickStat
          label={t("publishStock")}
          value={`${stats?.soldKg ?? 0} kg`}
          detail={`₹${stats?.soldValue ?? 0}`}
        />
      </div>
      <Card className="p-5">
        <p className="text-xs font-bold uppercase text-emerald-600">{t("earnings")}</p>
        <div className="mt-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="earnings" fill="#064e3b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b border-emerald-100 p-5 sm:px-6">
          <h2 className="text-lg font-black text-forest">Citizen pickups</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {requests.length ? (
            requests.map((request) => (
              <div
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:px-6"
                key={request.id}
              >
                {request.imageUrl ? (
                  <ClickableImage
                    src={request.imageUrl}
                    alt={request.waste}
                    className="h-20 w-full rounded-xl object-cover sm:w-24"
                  />
                ) : (
                  <span className="grid h-20 w-full place-items-center rounded-xl bg-emerald-50 text-emerald-600 sm:w-24">
                    <ImageIcon size={22} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <RequestTag status={request.status} />
                  <p className="mt-1 text-sm text-slate-700">{request.waste}</p>
                  {request.citizen && (
                    <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs">
                      <p className="font-bold text-forest">{t("senderDetails")}</p>
                      <p className="mt-1 flex items-center gap-1">
                        <User size={12} /> {request.citizen.name}
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone size={12} /> {request.citizen.phone}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin size={12} /> {request.citizen.address}
                      </p>
                      <MapLink
                        address={request.citizen.address}
                        lat={request.citizen.lat ?? request.lat}
                        lng={request.citizen.lng ?? request.lng}
                      />
                    </div>
                  )}
                  <p className="mt-1 text-xs text-emerald-700">{request.time}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <Action
                    request={request}
                    busy={busyId === request.id}
                    updateStatus={updateStatus}
                    verifyPickup={verifyPickup}
                    t={t}
                  />
                  {(request.status === "Collected" ||
                    request.status === "Verified") &&
                    !request.inventoryListed && (
                      <button
                        type="button"
                        disabled={busyId === request.id}
                        onClick={() => assignToRecycler(request.id)}
                        className="rounded-xl bg-lime px-3 py-2.5 text-xs font-bold text-forest hover:bg-[#d7ff91] disabled:opacity-60"
                      >
                        {t("assignToRecycler")}
                      </button>
                    )}
                  {request.inventoryListed && (
                    <span className="text-center text-[10px] font-bold text-emerald-700">
                      {t("alreadyAssignedStock")}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="p-8 text-center text-sm text-slate-500">{t("noPickups")}</p>
          )}
        </div>
      </Card>
      {reserved.length > 0 && (
        <Card className="overflow-hidden">
          <div className="border-b border-emerald-100 p-5">
            <h2 className="font-black text-forest">{t("nearbyRecyclers")} — reserved</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {reserved.map((item) => (
              <div key={item.id} className="p-4 text-sm">
                <b>{item.material}</b> · {item.weight}
                {item.buyer && (
                  <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs">
                    <p className="font-bold">{item.buyer.name}</p>
                    <p>{item.buyer.phone}</p>
                    <p>{item.buyer.address}</p>
                    <MapLink
                      address={item.buyer.address}
                      lat={item.buyer.lat}
                      lng={item.buyer.lng}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <h2 className="text-lg font-black text-forest">{t("publishStock")}</h2>
        <button
          onClick={addStock}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-forest transition hover:bg-emerald-100"
        >
          <PackagePlus size={17} /> {t("publishStock")}
        </button>
      </Card>
    </div>
  );
}

function QuickStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="p-5">
      <Route size={18} className="text-emerald-600" />
      <p className="mt-3 text-xs font-bold uppercase tracking-[.12em] text-slate-400">
        {label}
      </p>
      <b className="mt-1 block text-3xl font-black tracking-tight text-forest">
        {value}
      </b>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </Card>
  );
}
function RequestTag({ status }: { status: PickupRequest["status"] }) {
  return <Tag tone={status === "New" ? "green" : "gold"}>{status}</Tag>;
}
function Action({
  request,
  busy,
  updateStatus,
  verifyPickup,
  t,
}: {
  request: PickupRequest;
  busy: boolean;
  updateStatus: (
    id: string,
    status: "Accepted" | "Collected" | "Verified",
  ) => void;
  verifyPickup: (pickup: PickupRequest) => void;
  t: (key: import("@/lib/translations").TKey) => string;
}) {
  if (request.status === "Verified")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
        <CheckCheck size={16} /> {t("complete")}
      </span>
    );
  const next =
    request.status === "New"
      ? (["accept", "Accepted"] as const)
      : request.status === "Accepted"
        ? (["markCollected", "Collected"] as const)
        : (["verifyPickup", "Verified"] as const);
  const labelKey = next[0] as import("@/lib/translations").TKey;
  return (
    <button
      disabled={busy}
      onClick={() => next[1] === "Verified" ? verifyPickup(request) : updateStatus(request.id, next[1])}
      className="shrink-0 rounded-xl bg-forest px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#064c3b] disabled:opacity-60"
    >
      {busy ? t("saving") : t(labelKey)}
    </button>
  );
}
