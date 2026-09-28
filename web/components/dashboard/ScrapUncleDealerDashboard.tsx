"use client";

import {
  BadgeCheck,
  Building2,
  CheckCheck,
  CircleDollarSign,
  Clock3,
  Cpu,
  FileCheck2,
  Gauge,
  MapPin,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Truck,
} from "lucide-react";
import { Card, Tag } from "@/components/ui";
import {
  AnalyticsOverview,
  CollectorStats,
  MarketPrice,
  PickupRequest,
} from "@/lib/types";
import { SERVICE_LABELS, SERVICE_OPTIONS } from "@/lib/scrapCatalog";
import { LivePickupTracker } from "@/components/dashboard/LivePickupTracker";
import { MapLink } from "@/components/ui/MapLink";

export function ScrapUncleDealerDashboard({
  requests,
  stats,
  busyId,
  updateStatus,
  recordWeight,
  verifyPickup,
  assignToRecycler,
  marketPrices,
  updateLocalityRate,
  analytics,
}: {
  requests: PickupRequest[];
  stats?: CollectorStats;
  busyId?: string;
  updateStatus: (id: string, status: "Accepted" | "Collected") => void;
  recordWeight: (pickup: PickupRequest, source: "digital" | "iot") => void;
  verifyPickup: (pickup: PickupRequest) => void;
  assignToRecycler: (id: string) => void;
  marketPrices: MarketPrice[];
  updateLocalityRate: (price: MarketPrice) => void;
  analytics?: AnalyticsOverview;
}) {
  const active = requests.filter((item) => item.status !== "Verified");
  const certified = requests.filter(
    (item) => item.weighedKg || item.weightSource,
  ).length;
  const settled = requests.filter(
    (item) => item.paymentStatus === "paid",
  ).length;

  return (
    <div className="space-y-6" id="dealer-panel">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<Truck size={18} />}
          label="Active pickups"
          value={String(active.length)}
          detail="Live route queue"
        />
        <Metric
          icon={<Gauge size={18} />}
          label="Certified weights"
          value={String(certified)}
          detail="Digital / IoT tickets"
        />
        <Metric
          icon={<CircleDollarSign size={18} />}
          label="Instant settlements"
          value={String(settled)}
          detail={`₹${stats?.earnings || 0} processed`}
        />
        <Metric
          icon={<Building2 size={18} />}
          label="Business recovered"
          value={`${stats?.collectedKg || 0} kg`}
          detail="B2B & household flow"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-emerald-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">
              ScrapUncle live operations
            </p>
            <h2 className="mt-1 text-lg font-black text-forest">
              QR-verified pickup queue
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Accept → certified weigh → collect → scan QR/OTP → instant payment
              + invoice.
            </p>
          </div>
          <Tag tone="green">Live tracking on</Tag>
        </div>
        <div className="divide-y divide-slate-100">
          {requests.length ? (
            requests.map((pickup) => (
              <PickupRow
                key={pickup.id}
                pickup={pickup}
                busy={busyId === pickup.id}
                updateStatus={updateStatus}
                recordWeight={recordWeight}
                verifyPickup={verifyPickup}
                assignToRecycler={assignToRecycler}
              />
            ))
          ) : (
            <p className="p-8 text-center text-sm text-slate-500">
              No pickup requests in this route yet.
            </p>
          )}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <Card className="p-6">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">
            Business & compliance desk
          </p>
          <h2 className="mt-1 text-lg font-black text-forest">
            Bookable ScrapUncle services
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {SERVICE_OPTIONS.map((service) => (
              <div
                key={service.value}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"
              >
                <b className="text-sm text-forest">{service.label}</b>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {service.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3 text-xs font-semibold text-emerald-800">
            <Feature
              icon={<FileCheck2 size={15} />}
              text="EPR & CSR evidence"
            />
            <Feature
              icon={<ShieldCheck size={15} />}
              text="Data-destruction certificates"
            />
            <Feature
              icon={<BadgeCheck size={15} />}
              text="Vehicle scrapping assistance"
            />
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">
            Locality rate desk
          </p>
          <h2 className="mt-1 text-lg font-black text-forest">
            Update a local live rate
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Dealer updates broadcast instantly; pickup estimates use the
            matching locality rate.
          </p>
          <div className="mt-5 space-y-2">
            {marketPrices.slice(0, 6).map((price) => (
              <button
                key={price.id}
                onClick={() => updateLocalityRate(price)}
                className="flex w-full items-center justify-between rounded-xl border border-emerald-100 px-3 py-2.5 text-left text-sm hover:bg-emerald-50"
              >
                <span className="font-bold text-forest">{price.material}</span>
                <span className="text-emerald-700">₹{price.pricePerKg}/kg</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">
              Business sustainability analytics
            </p>
            <h2 className="mt-1 text-lg font-black text-forest">
              Report-ready recovery snapshot
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Use verified weights, invoices and material flow to support EPR,
              CSR and zero-waste reports.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat
              value={`${analytics?.recycledKg || 0} kg`}
              label="recovered"
            />
            <Stat value={`${analytics?.co2Kg || 0} kg`} label="CO₂ avoided" />
            <Stat value={String(analytics?.pickups || 0)} label="tracked" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function PickupRow({
  pickup,
  busy,
  updateStatus,
  recordWeight,
  verifyPickup,
  assignToRecycler,
}: {
  pickup: PickupRequest;
  busy: boolean;
  updateStatus: (id: string, status: "Accepted" | "Collected") => void;
  recordWeight: (pickup: PickupRequest, source: "digital" | "iot") => void;
  verifyPickup: (pickup: PickupRequest) => void;
  assignToRecycler: (id: string) => void;
}) {
  const isNew = pickup.status === "New";
  const accepted = pickup.status === "Accepted";
  const collected = pickup.status === "Collected";
  const verified = pickup.status === "Verified";
  return (
    <div className="p-5 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <b className="text-base text-forest">{pickup.waste}</b>
            <Tag tone={verified ? "green" : "gold"}>{pickup.status}</Tag>
            {pickup.pickupMode && <Tag>{pickup.pickupMode}</Tag>}
            {pickup.recurring && pickup.recurring !== "once" && (
              <Tag>{pickup.recurring}</Tag>
            )}
          </div>
          <p className="mt-1 text-xs font-semibold text-emerald-700">
            {SERVICE_LABELS[pickup.serviceType || "scrap_pickup"] ||
              "Doorstep scrap pickup"}
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <MapPin size={13} /> {pickup.area}
          </p>
          <MapLink
            address={pickup.area}
            lat={pickup.lat}
            lng={pickup.lng}
            compact
          />
          <LivePickupTracker pickup={pickup} />
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
              <b>QR / OTP:</b>{" "}
              {pickup.verificationCode || "Generated after booking"}
            </span>
            {pickup.weighedKg ? (
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-emerald-800">
                <b>
                  {pickup.weightSource === "iot" ? "IoT" : "Digital"} weight:
                </b>{" "}
                {pickup.weighedKg} kg
              </span>
            ) : (
              <span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-amber-800">
                Weight pending
              </span>
            )}
            {pickup.estimatedAmount != null && (
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-emerald-800">
                <b>Settlement:</b> ₹{pickup.estimatedAmount} ·{" "}
                {pickup.paymentMethod?.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 lg:w-52 lg:flex-col">
          {isNew && (
            <Action
              busy={busy}
              icon={<Clock3 size={15} />}
              label="Accept live pickup"
              onClick={() => updateStatus(pickup.id, "Accepted")}
            />
          )}
          {accepted && (
            <>
              <Action
                busy={busy}
                icon={<Gauge size={15} />}
                label="Digital weigh"
                onClick={() => recordWeight(pickup, "digital")}
                muted
              />
              <Action
                busy={busy}
                icon={<Cpu size={15} />}
                label="IoT weigh"
                onClick={() => recordWeight(pickup, "iot")}
                muted
              />
              <Action
                busy={busy}
                icon={<Truck size={15} />}
                label="Mark collected"
                onClick={() => updateStatus(pickup.id, "Collected")}
              />
            </>
          )}
          {collected && (
            <>
              <Action
                busy={busy}
                icon={<ScanLine size={15} />}
                label="Scan QR / enter OTP"
                onClick={() => verifyPickup(pickup)}
              />
              <Action
                busy={busy}
                icon={<Gauge size={15} />}
                label="Correct certified weight"
                onClick={() => recordWeight(pickup, "digital")}
                muted
              />
            </>
          )}
          {verified && (
            <>
              <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700">
                <CheckCheck size={15} /> Paid + invoiced
              </span>
              {!pickup.inventoryListed && (
                <Action
                  busy={busy}
                  icon={<ReceiptText size={15} />}
                  label="List for recycler"
                  onClick={() => assignToRecycler(pickup.id)}
                  muted
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Action({
  icon,
  label,
  onClick,
  busy,
  muted = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  busy: boolean;
  muted?: boolean;
}) {
  return (
    <button
      disabled={busy}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold disabled:opacity-50 ${muted ? "border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50" : "bg-forest text-white hover:bg-[#064c3b]"}`}
    >
      {icon}
      {busy ? "Saving…" : label}
    </button>
  );
}
function Metric({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="p-5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </span>
      <p className="mt-3 text-xs font-bold uppercase tracking-[.12em] text-slate-400">
        {label}
      </p>
      <b className="mt-1 block text-2xl font-black text-forest">{value}</b>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </Card>
  );
}
function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3">
      {icon}
      {text}
    </span>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="min-w-20 rounded-xl bg-emerald-50 px-3 py-2">
      <b className="block text-sm text-forest">{value}</b>
      <small className="text-[10px] text-slate-500">{label}</small>
    </span>
  );
}
