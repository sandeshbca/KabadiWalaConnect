"use client";

import { AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  Leaf,
  Recycle,
  Upload,
} from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { AppNavigation } from "@/components/dashboard/AppNavigation";
import { CitizenDashboard } from "@/components/dashboard/CitizenDashboard";
import { CollectorDashboard } from "@/components/dashboard/CollectorDashboard";
import { MapPanel } from "@/components/dashboard/MapPanel";
import { RecyclerDashboard } from "@/components/dashboard/RecyclerDashboard";
import { RoleTabs } from "@/components/dashboard/RoleTabs";
import { Card, Modal } from "@/components/ui";
import {
  AnalyticsOverview,
  apiRoles,
  InventoryListing,
  MarketPrice,
  PickupRequest,
  Role,
  roleContent,
  roleRoutes,
  SessionUser,
} from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ApiPickup = {
  _id: string;
  name?: string;
  material: string;
  weightKg?: number;
  description?: string;
  imageUrl?: string;
  address: string;
  status: "requested" | "assigned" | "collected" | "verified";
  scheduledFor?: string;
  createdAt?: string;
  userId?: { name?: string };
};

type ApiInventory = {
  _id: string;
  material: string;
  weightKg: number;
  pricePerKg?: number;
  description?: string;
  imageUrl?: string;
  location?: { area?: string };
  collectorName?: string;
  collectorId?: { name?: string };
  status: "available" | "reserved" | "collected";
};

const pickupStatus: Record<ApiPickup["status"], PickupRequest["status"]> = {
  requested: "New",
  assigned: "Accepted",
  collected: "Collected",
  verified: "Verified",
};

const inventoryStatus: Record<
  ApiInventory["status"],
  InventoryListing["status"]
> = {
  available: "Available",
  reserved: "Reserved",
  collected: "Collected",
};

const reversePickupStatus = {
  Accepted: "assigned",
  Collected: "collected",
  Verified: "verified",
} as const;

export function DashboardShell({ role }: { role: Role }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [user, setUser] = useState<SessionUser>();
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("Connecting to your secure workspace…");
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [listings, setListings] = useState<InventoryListing[]>([]);
  const [team, setTeam] = useState<SessionUser[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview>();
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [pickupOpen, setPickupOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [scan, setScan] = useState<string>();
  const [busyId, setBusyId] = useState("");
  const [saving, setSaving] = useState(false);
  const content = roleContent[role];

  const authorizedFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const response = await fetch(`${API}${path}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(data.message || "Unable to complete that action.");
      return data;
    },
    [token],
  );

  const loadWorkspace = useCallback(async () => {
    if (!token) return;
    try {
      const jobs: Promise<void>[] = [];
      if (role === "Citizen" || role === "Collector") {
        jobs.push(
          authorizedFetch("/api/pickups").then((items: ApiPickup[]) =>
            setRequests(items.map(toPickup)),
          ),
        );
      }
      if (role === "Recycler") {
        jobs.push(
          authorizedFetch("/api/inventory").then((items: ApiInventory[]) =>
            setListings(items.map(toInventory)),
          ),
        );
      }
      if (role === "Recycler" || role === "Admin") {
        jobs.push(
          authorizedFetch("/api/analytics/overview").then(
            (data: AnalyticsOverview) => setAnalytics(data),
          ),
        );
      }
      if (role === "Admin") {
        jobs.push(
          authorizedFetch("/api/admin/team").then((items: SessionUser[]) =>
            setTeam(items),
          ),
        );
        jobs.push(
          authorizedFetch("/api/market/prices").then((items: MarketPrice[]) =>
            setMarketPrices(items),
          ),
        );
      }
      await Promise.all(jobs);
      setNotice("Your workspace is synced and up to date");
    } catch (reason) {
      setNotice(
        "Live connection unavailable — please refresh after the API is running",
      );
      setError(messageOf(reason));
    }
  }, [authorizedFetch, role, token]);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("kc_token");
    if (!savedToken) {
      router.replace("/login");
      return;
    }
    const checkSession = async () => {
      try {
        const response = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(result.message || "Your session has expired.");
        const signedInRole =
          apiRoles[result.user.role as keyof typeof apiRoles];
        if (!signedInRole)
          throw new Error("Your account role is not supported.");
        if (signedInRole !== role) {
          router.replace(roleRoutes[signedInRole]);
          return;
        }
        sessionStorage.setItem("kc_user", JSON.stringify(result.user));
        setToken(savedToken);
        setUser(result.user);
        setReady(true);
      } catch {
        sessionStorage.removeItem("kc_token");
        sessionStorage.removeItem("kc_user");
        router.replace("/login");
      }
    };
    void checkSession();
  }, [role, router]);

  useEffect(() => {
    if (ready) void loadWorkspace();
  }, [loadWorkspace, ready]);

  useEffect(() => {
    if (!token) return;
    const socket = io(API, { auth: { token }, reconnectionAttempts: 3 });
    socket.on("system:ready", (event: { message: string }) =>
      setNotice(event.message),
    );
    const refresh = (message: string) => {
      setNotice(message);
      void loadWorkspace();
    };
    socket.on("pickup:created", () =>
      refresh("A pickup request was added to the live network"),
    );
    socket.on("pickup:updated", () => refresh("Pickup status updated"));
    socket.on("inventory:listed", () =>
      refresh("New collector stock is now available"),
    );
    socket.on("inventory:updated", () =>
      refresh("Marketplace stock was updated"),
    );
    socket.on("team:updated", () => refresh("Team access was updated"));
    socket.on("market:updated", () => refresh("Market rates were updated"));
    return () => {
      socket.disconnect();
    };
  }, [loadWorkspace, token]);

  const bookPickup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const payload = new FormData();
    payload.append("material", String(data.get("material")));
    payload.append("weightKg", String(data.get("weight")));
    payload.append("address", String(data.get("area")));
    payload.append("description", String(data.get("description") || ""));
    if (data.get("scheduledFor"))
      payload.append("scheduledFor", String(data.get("scheduledFor")));
    appendImage(payload, data.get("image"));
    try {
      await authorizedFetch("/api/pickups", { method: "POST", body: payload });
      setPickupOpen(false);
      setNotice("Pickup request sent to nearby collectors");
      await loadWorkspace();
    } catch (reason) {
      setError(messageOf(reason));
    } finally {
      setSaving(false);
    }
  };

  const updatePickup = async (
    id: string,
    status: "Accepted" | "Collected" | "Verified",
  ) => {
    setBusyId(id);
    setError("");
    try {
      await authorizedFetch(`/api/pickups/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: reversePickupStatus[status] }),
      });
      setNotice(`Pickup marked as ${status.toLowerCase()}`);
      await loadWorkspace();
    } catch (reason) {
      setError(messageOf(reason));
    } finally {
      setBusyId("");
    }
  };

  const listStock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const payload = new FormData();
    payload.append("material", String(data.get("material")));
    payload.append("weightKg", String(data.get("weight")));
    payload.append("pricePerKg", String(data.get("price")));
    payload.append(
      "location",
      JSON.stringify({ area: String(data.get("area")) }),
    );
    payload.append("description", String(data.get("description") || ""));
    appendImage(payload, data.get("image"));
    try {
      await authorizedFetch("/api/inventory", {
        method: "POST",
        body: payload,
      });
      setStockOpen(false);
      setNotice("Stock published to verified recyclers");
    } catch (reason) {
      setError(messageOf(reason));
    } finally {
      setSaving(false);
    }
  };

  const reserveInventory = async (id: string) => {
    setBusyId(id);
    setError("");
    try {
      await authorizedFetch(`/api/inventory/${id}/reserve`, { method: "POST" });
      setNotice("Material reserved — the collector has been notified");
      await loadWorkspace();
    } catch (reason) {
      setError(messageOf(reason));
    } finally {
      setBusyId("");
    }
  };

  const updateMember = async (
    member: SessionUser,
    changes: { verified?: boolean; active?: boolean },
  ) => {
    setBusyId(member.id);
    setError("");
    try {
      await authorizedFetch(`/api/admin/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      setNotice(`${member.name}'s access was updated`);
      await loadWorkspace();
    } catch (reason) {
      setError(messageOf(reason));
    } finally {
      setBusyId("");
    }
  };

  const updateMarketPrice = async (
    price: MarketPrice,
    changes: { pricePerKg?: number; trend?: MarketPrice["trend"] },
  ) => {
    setBusyId(price.id);
    setError("");
    try {
      await authorizedFetch(`/api/market/prices/${price.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      setNotice(`${price.material} market rate was updated`);
      await loadWorkspace();
    } catch (reason) {
      setError(messageOf(reason));
    } finally {
      setBusyId("");
    }
  };

  const identify = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setScan("Analysing photo…");
    setError("");
    const data = new FormData();
    data.append("image", file);
    try {
      const result = await authorizedFetch("/api/scans/analyze", {
        method: "POST",
        body: data,
      });
      setScan(`${result.material} · ${result.confidence}% confidence`);
    } catch (reason) {
      setScan(undefined);
      setError(messageOf(reason));
    }
  };

  const primary = () => {
    if (role === "Citizen") setPickupOpen(true);
    else
      document
        .getElementById(
          role === "Admin" ? "admin-panel" : `${role.toLowerCase()}-panel`,
        )
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!ready) return <Loading />;

  const metric = sideMetric(role, requests, listings, analytics, team);
  return (
    <main className="min-h-screen bg-[#f5faf7] text-slate-900">
      <AppNavigation role={role} notice={notice} user={user} />
      <header className="relative overflow-hidden border-b border-emerald-100 bg-[#eaf8ef]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-7 px-5 py-10 md:px-8 md:py-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={14} />
              {content.eyebrow.toUpperCase()}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.045em] text-forest md:text-6xl">
              {content.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {content.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={primary}
              className="inline-flex items-center gap-2 rounded-2xl bg-forest px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#064c3b]"
            >
              {content.action}
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setScanOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-5 py-3.5 text-sm font-bold text-forest transition hover:bg-emerald-50"
            >
              <Bot size={18} />
              AI waste scan
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-9">
        <RoleTabs active={role} />
        {error && <ErrorBanner error={error} />}
        <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_340px]">
          <div
            id={
              role === "Collector"
                ? "collector-panel"
                : role === "Recycler"
                  ? "recycler-panel"
                  : role === "Admin"
                    ? "admin-panel"
                    : undefined
            }
          >
            {role === "Citizen" && (
              <CitizenDashboard
                pickups={requests}
                bookPickup={() => setPickupOpen(true)}
              />
            )}
            {role === "Collector" && (
              <CollectorDashboard
                requests={requests}
                updateStatus={updatePickup}
                addStock={() => setStockOpen(true)}
                busyId={busyId}
              />
            )}
            {role === "Recycler" && (
              <RecyclerDashboard
                listings={listings}
                reserve={reserveInventory}
                busyId={busyId}
                analytics={analytics}
              />
            )}
            {role === "Admin" && (
              <AdminDashboard
                team={team}
                analytics={analytics}
                marketPrices={marketPrices}
                busyMemberId={busyId}
                updateMember={updateMember}
                updateMarketPrice={updateMarketPrice}
              />
            )}
          </div>
          <DashboardAside
            role={role}
            contentMetric={content.metric}
            metric={metric}
            notice={notice}
            openScanner={() => setScanOpen(true)}
          />
        </div>
      </section>

      <AnimatePresence>
        {pickupOpen && (
          <Modal close={() => setPickupOpen(false)}>
            <ModalTitle
              title="Schedule a nearby pickup"
              detail="Share the material, weight, photo and any special collection notes."
            />
            <form onSubmit={bookPickup} className="mt-6 space-y-3">
              <Field
                name="material"
                placeholder="Material, e.g. plastic bottles"
              />
              <Field
                name="weight"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Approximate weight in kg"
              />
              <Field name="area" placeholder="Pickup address or area" />
              <TextArea
                name="description"
                placeholder="Additional details, quantity condition or pickup instructions"
              />
              <ImageField label="Add a photo of the material" />
              <label className="block text-xs font-bold text-slate-600">
                Preferred pickup time
                <input
                  name="scheduledFor"
                  type="datetime-local"
                  className="field mt-1.5 rounded-xl border-slate-200"
                />
              </label>
              <SubmitButton saving={saving} label="Send pickup request" />
            </form>
          </Modal>
        )}
        {stockOpen && (
          <Modal close={() => setStockOpen(false)}>
            <ModalTitle
              title="Publish collected material"
              detail="Complete details and a clear photo help recyclers reserve your stock faster."
            />
            <form onSubmit={listStock} className="mt-6 space-y-3">
              <Field name="material" placeholder="Material, e.g. PET plastic" />
              <Field
                name="weight"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Weight in kg"
              />
              <Field
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Your price per kg (₹)"
              />
              <Field name="area" placeholder="Store location or area" />
              <TextArea
                name="description"
                placeholder="Grade, condition, moisture, packaging or other details"
              />
              <ImageField label="Add a photo of the stock" />
              <SubmitButton saving={saving} label="Publish to recyclers" />
            </form>
          </Modal>
        )}
        {scanOpen && (
          <Modal
            close={() => {
              setScanOpen(false);
              setScan(undefined);
            }}
          >
            <ModalTitle
              title="AI waste identification"
              detail="Upload a clear photo for a quick material classification."
            />
            {scan ? (
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <b className="text-forest">{scan}</b>
                <p className="mt-2 text-sm text-emerald-800">
                  Keep the material clean and dry before collection.
                </p>
              </div>
            ) : (
              <label className="mt-6 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50 p-8 text-center transition hover:border-emerald-400">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                  <Upload size={22} />
                </span>
                <b className="mt-4 text-sm text-forest">Upload a waste photo</b>
                <p className="mt-1 text-xs text-slate-500">
                  JPG and PNG files up to 8 MB
                </p>
                <input
                  onChange={identify}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </label>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </main>
  );
}

function DashboardAside({
  role,
  contentMetric,
  metric,
  notice,
  openScanner,
}: {
  role: Role;
  contentMetric: string;
  metric: { value: string; detail: string };
  notice: string;
  openScanner: () => void;
}) {
  return (
    <aside className="space-y-5">
      <Card className="overflow-hidden bg-forest p-6 text-white shadow-[0_18px_50px_rgba(6,47,37,.16)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-200">
              {contentMetric}
            </p>
            <b className="mt-2 block text-4xl font-black tracking-tight">
              {metric.value}
            </b>
            <p className="mt-2 text-sm text-emerald-100">{metric.detail}</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-lime">
            {role === "Admin" ? (
              <Activity size={21} />
            ) : role === "Recycler" ? (
              <Recycle size={21} />
            ) : (
              <Leaf size={21} />
            )}
          </span>
        </div>
        <p className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-semibold text-emerald-100">
          <CheckCircle2 size={15} className="text-lime" />
          Verified, tracked and transparent
        </p>
      </Card>
      <MapPanel role={role} />
      <Card className="p-5">
        <div className="flex gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <Bell size={18} />
          </span>
          <div>
            <b className="text-sm text-forest">Live activity</b>
            <p className="mt-1 text-xs leading-5 text-slate-500">{notice}</p>
            <p className="mt-2 text-[11px] font-semibold text-emerald-600">
              LIVE NETWORK
            </p>
          </div>
        </div>
      </Card>
      <button
        onClick={openScanner}
        className="w-full rounded-2xl border border-emerald-100 bg-white p-4 text-left transition hover:bg-emerald-50"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-forest">
          <Bot size={18} className="text-emerald-600" /> Need help identifying
          waste?
        </span>
        <span className="mt-1 block text-xs text-slate-500">
          Upload a photo for a quick material classification.
        </span>
      </button>
    </aside>
  );
}

function toPickup(item: ApiPickup): PickupRequest {
  return {
    id: item._id,
    name: item.userId?.name || item.name || "Citizen",
    waste: `${item.material}${item.weightKg ? ` · ${item.weightKg} kg` : ""}`,
    weightKg: item.weightKg,
    description: item.description,
    imageUrl: assetUrl(item.imageUrl),
    area: item.address,
    time: item.scheduledFor
      ? new Intl.DateTimeFormat("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(item.scheduledFor))
      : item.createdAt
        ? `Requested ${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(item.createdAt))}`
        : "Requested recently",
    status: pickupStatus[item.status],
  };
}

function toInventory(item: ApiInventory): InventoryListing {
  return {
    id: item._id,
    material: item.material,
    weight: `${item.weightKg} kg`,
    price: item.pricePerKg ? `₹${item.pricePerKg}/kg` : "Price on request",
    description: item.description,
    imageUrl: assetUrl(item.imageUrl),
    area: item.location?.area || "Location not set",
    seller:
      item.collectorId?.name || item.collectorName || "Verified collector",
    status: inventoryStatus[item.status],
  };
}

function assetUrl(value?: string) {
  return value
    ? value.startsWith("http")
      ? value
      : `${API}${value}`
    : undefined;
}
function appendImage(data: FormData, candidate: FormDataEntryValue | null) {
  if (candidate instanceof File && candidate.size)
    data.append("image", candidate);
}
function sideMetric(
  role: Role,
  requests: PickupRequest[],
  listings: InventoryListing[],
  analytics?: AnalyticsOverview,
  team: SessionUser[] = [],
) {
  if (role === "Citizen")
    return { value: `${requests.length}`, detail: "pickup requests tracked" };
  if (role === "Collector")
    return {
      value: `${requests.filter((request) => request.status !== "Verified").length}`,
      detail: "open stops on your route",
    };
  if (role === "Recycler")
    return {
      value: `${listings.filter((item) => item.status === "Available").length}`,
      detail: "lots ready to reserve",
    };
  return {
    value: `${team.filter((member) => member.active !== false).length}`,
    detail: `${analytics?.collectors || 0} collectors in network`,
  };
}
function messageOf(reason: unknown) {
  return reason instanceof Error
    ? reason.message
    : "Unable to complete that action.";
}
function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5faf7]">
      <div className="text-center">
        <span className="mx-auto block h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
        <p className="mt-4 text-sm font-semibold text-forest">
          Loading your secure workspace…
        </p>
      </div>
    </main>
  );
}
function ErrorBanner({ error }: { error: string }) {
  return (
    <div
      role="alert"
      className="mt-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
    >
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <div>
        <b>Action needs attention</b>
        <p className="mt-0.5">{error}</p>
      </div>
    </div>
  );
}
function ModalTitle({ title, detail }: { title: string; detail: string }) {
  return (
    <>
      <h2 className="pr-7 text-2xl font-black tracking-tight text-forest">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
    </>
  );
}
function Field({
  name,
  placeholder,
  type = "text",
  min,
  step,
}: {
  name: string;
  placeholder: string;
  type?: string;
  min?: string;
  step?: string;
}) {
  return (
    <input
      required
      name={name}
      type={type}
      min={min}
      step={step}
      placeholder={placeholder}
      className="field rounded-xl border-slate-200 px-4 py-3 text-sm transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
    />
  );
}
function TextArea({
  name,
  placeholder,
}: {
  name: string;
  placeholder: string;
}) {
  return (
    <textarea
      name={name}
      rows={3}
      placeholder={placeholder}
      className="field resize-y rounded-xl border-slate-200 px-4 py-3 text-sm transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
    />
  );
}
function ImageField({ label }: { label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 transition hover:border-emerald-400">
      <Upload size={17} />
      <span>
        <b className="block">{label}</b>
        <small className="text-emerald-700">
          Optional · JPG or PNG · max 5 MB
        </small>
      </span>
      <input
        name="image"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />
    </label>
  );
}
function SubmitButton({ saving, label }: { saving: boolean; label: string }) {
  return (
    <button
      disabled={saving}
      className="mt-2 w-full rounded-xl bg-forest p-3.5 text-sm font-bold text-white transition hover:bg-[#064c3b] disabled:opacity-60"
    >
      {saving ? "Saving…" : label}
    </button>
  );
}
