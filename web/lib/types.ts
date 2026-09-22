export type Role = "Citizen" | "Collector" | "Recycler" | "Admin";

export type ApiRole = Lowercase<Role>;

export type SessionUser = {
  id: string;
  name: string;
  phone: string;
  role: ApiRole;
  verified: boolean;
  active?: boolean;
  location?: { area?: string; lat?: number; lng?: number };
  ratingAvg?: number;
  ratingCount?: number;
};

export type ContactInfo = {
  name: string;
  phone: string;
  address: string;
  ratingAvg?: number;
};

export type PickupRequest = {
  id: string;
  name: string;
  phone?: string;
  waste: string;
  material?: string;
  weightKg?: number;
  description?: string;
  imageUrl?: string;
  area: string;
  time: string;
  status: "New" | "Accepted" | "Collected" | "Verified";
  paymentMethod?: "cash" | "upi";
  paymentStatus?: "pending" | "paid";
  estimatedAmount?: number;
  pricePerKg?: number;
  citizen?: ContactInfo;
  collector?: ContactInfo;
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

export type TransactionRow = {
  id: string;
  amount: number;
  method: "cash" | "upi";
  status: string;
  createdAt: string;
  note?: string;
  pickupMaterial?: string;
};

export type NearbyCollector = {
  id: string;
  name: string;
  phone: string;
  area: string;
  distanceKm: number;
  ratingAvg: number;
  ratingCount: number;
};

export type CollectorStats = {
  collectedKg: number;
  soldKg: number;
  soldValue: number;
  earnings: number;
  monthly: number[];
  inventoryCount: number;
};

export type GreenImpactData = {
  recycledKg: number;
  totalKg: number;
  co2Kg: number;
  trees: number;
  waterLiters: number;
  pickups: number;
  materials: { material: string; kg: number }[];
  tip: string;
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
  { title: string; subtitle: string; action: string; metric: string }
> = {
  Citizen: {
    title: "Your waste can create real value.",
    subtitle:
      "Schedule a trusted pickup, track it live, and see the impact of every kilogram you recycle.",
    action: "Schedule pickup",
    metric: "Your impact",
  },
  Collector: {
    title: "Plan a smarter, more profitable route.",
    subtitle:
      "Accept nearby pickup requests, update collection progress, and publish verified material in one place.",
    action: "View pickup queue",
    metric: "Route progress",
  },
  Recycler: {
    title: "Reliable material supply, when you need it.",
    subtitle:
      "Reserve verified stock from local collectors and monitor supply trends across the network.",
    action: "Browse material",
    metric: "Live supply",
  },
  Admin: {
    title: "Build a trusted circular city.",
    subtitle:
      "Manage your field network, verify partners, and turn live operational data into better decisions.",
    action: "Manage team",
    metric: "Network health",
  },
};
