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
import { CollectorStats, PickupRequest } from "@/lib/types";
import { Card, Tag } from "@/components/ui";
import { ClickableImage } from "@/components/ui/ImageLightbox";

export function CollectorDashboard({
  requests,
  updateStatus,
  addStock,
  busyId,
  stats,
}: {
  requests: PickupRequest[];
  updateStatus: (
    id: string,
    status: "Accepted" | "Collected" | "Verified",
  ) => void;
  addStock: () => void;
  busyId?: string;
  stats?: CollectorStats;
}) {
  const newCount = requests.filter((request) => request.status === "New").length;
  const chartData = (stats?.monthly || []).map((v, i) => ({
    day: ["M", "T", "W", "T", "F", "S", "S"][i],
    earnings: v,
    kg: Math.round(v / 12),
  }));
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickStat label="New requests" value={String(newCount)} detail="Waiting to be accepted" />
        <QuickStat
          label="Earnings"
          value={`₹${stats?.earnings ?? 0}`}
          detail={`${stats?.collectedKg ?? 0} kg collected`}
        />
        <QuickStat
          label="Sold to recyclers"
          value={`${stats?.soldKg ?? 0} kg`}
          detail={`₹${stats?.soldValue ?? 0} value`}
        />
      </div>
      <Card className="p-5">
        <p className="text-xs font-bold uppercase text-emerald-600">Weekly earnings</p>
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
        <div className="flex flex-col gap-3 border-b border-emerald-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">
              Live pickup queue
            </p>
            <h2 className="mt-1 text-lg font-black text-forest">Citizen requests</h2>
          </div>
          <Tag>{newCount} new</Tag>
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
                  <div className="flex flex-wrap items-center gap-2">
                    <RequestTag status={request.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{request.waste}</p>
                  {request.citizen && (
                    <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs">
                      <p className="font-bold text-forest">Sender details</p>
                      <p className="mt-1 flex items-center gap-1">
                        <User size={12} /> {request.citizen.name}
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone size={12} /> {request.citizen.phone}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin size={12} /> {request.citizen.address}
                      </p>
                    </div>
                  )}
                  {request.description && (
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {request.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-emerald-700">{request.time}</p>
                </div>
                <Action
                  request={request}
                  busy={busyId === request.id}
                  updateStatus={updateStatus}
                />
              </div>
            ))
          ) : (
            <p className="p-8 text-center text-sm text-slate-500">
              No requests in your route right now.
            </p>
          )}
        </div>
      </Card>
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-black text-forest">Publish collected material</h2>
          <p className="mt-1 text-sm text-slate-500">
            Recyclers see your stock with contact and location.
          </p>
        </div>
        <button
          onClick={addStock}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-forest transition hover:bg-emerald-100"
        >
          <PackagePlus size={17} /> Add stock
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
}: {
  request: PickupRequest;
  busy: boolean;
  updateStatus: (
    id: string,
    status: "Accepted" | "Collected" | "Verified",
  ) => void;
}) {
  if (request.status === "Verified")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
        <CheckCheck size={16} /> Complete
      </span>
    );
  const next =
    request.status === "New"
      ? (["Accept", "Accepted"] as const)
      : request.status === "Accepted"
        ? (["Mark collected", "Collected"] as const)
        : (["Verify pickup", "Verified"] as const);
  return (
    <button
      disabled={busy}
      onClick={() => updateStatus(request.id, next[1])}
      className="shrink-0 rounded-xl bg-forest px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-[#064c3b] disabled:opacity-60"
    >
      {busy ? "Saving…" : next[0]}
    </button>
  );
}
