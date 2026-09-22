export type Role = "Citizen" | "Collector" | "Recycler" | "Admin";

export type ApiRole = Lowercase<Role>;

export type SessionUser = {
  id: string;
  name: string;
  phone: string;
  role: ApiRole;
  verified: boolean;
  active?: boolean;
  location?: { area?: string };
};

export type PickupRequest = {
  id: string;
  name: string;
  waste: string;
  weightKg?: number;
  description?: string;
  imageUrl?: string;
  area: string;
  time: string;
  status: "New" | "Accepted" | "Collected" | "Verified";
};

export type InventoryListing = {
  id: string;
  material: string;
  weight: string;
  price: string;
  area: string;
  seller: string;
  description?: string;
  imageUrl?: string;
  status: "Available" | "Reserved" | "Collected";
};

export type AnalyticsOverview = {
  pickups: number;
  recycledKg: number;
  co2Kg: number;
  collectors: number;
  monthly: number[];
  materialBreakdown?: { material: string; weightKg: number }[];
};

export type MarketPrice = {
  id: string;
  material: string;
  pricePerKg: number;
  trend: "up" | "down" | "stable";
  updatedAt?: string;
};

export const roleRoutes: Record<Role, string> = {
  Citizen: "/dashboard/citizen",
  Collector: "/dashboard/collector",
  Recycler: "/dashboard/recycler",
  Admin: "/dashboard/admin",
};

export const apiRoles: Record<ApiRole, Role> = {
  citizen: "Citizen",
  collector: "Collector",
  recycler: "Recycler",
  admin: "Admin",
};

export const roleContent: Record<
  Role,
  { eyebrow: string; title: string; subtitle: string; action: string; metric: string }
> = {
  Citizen: {
    eyebrow: "Citizen workspace",
    title: "Your waste can create real value.",
    subtitle: "Schedule a trusted pickup, track it live, and see the impact of every kilogram you recycle.",
    action: "Schedule pickup",
    metric: "Your impact",
  },
  Collector: {
    eyebrow: "Collector workspace",
    title: "Plan a smarter, more profitable route.",
    subtitle: "Accept nearby pickup requests, update collection progress, and publish verified material in one place.",
    action: "View pickup queue",
    metric: "Route progress",
  },
  Recycler: {
    eyebrow: "Recycler workspace",
    title: "Reliable material supply, when you need it.",
    subtitle: "Reserve verified stock from local collectors and monitor supply trends across the network.",
    action: "Browse material",
    metric: "Live supply",
  },
  Admin: {
    eyebrow: "Operations workspace",
    title: "Build a trusted circular city.",
    subtitle: "Manage your field network, verify partners, and turn live operational data into better decisions.",
    action: "Manage team",
    metric: "Network health",
  },
};
