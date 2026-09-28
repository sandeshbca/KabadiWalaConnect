export type Role =
  | "Citizen"
  | "Collector"
  | "Recycler"
  | "ScrapUncle Dealer"
  | "Admin";

export type ApiRole = "citizen" | "collector" | "recycler" | "dealer" | "admin";

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
  lat?: number;
  lng?: number;
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
  lat?: number;
  lng?: number;
  inventoryListed?: boolean;
  statusHistory?: { status: string; at: string }[];
  serviceType?: string;
  pickupMode?: "household" | "business" | "industrial";
  recurring?: "once" | "weekly" | "monthly";
  verificationCode?: string;
  verificationStatus?: "pending" | "verified";
  weighedKg?: number;
  weightSource?: "digital" | "iot";
  couponCode?: string;
  couponBonus?: number;
  invoiceNumber?: string;
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
  buyer?: ContactInfo;
  lat?: number;
  lng?: number;
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
  localityRates?: {
    locality: string;
    pricePerKg: number;
    trend?: "up" | "down" | "stable";
    updatedAt?: string;
  }[];
};

export type WalletData = {
  balance: number;
  rewardPoints: number;
  referralCode: string;
  referralCount: number;
  coupons: { code: string; title: string; value: number; active: boolean }[];
};

export type DigitalInvoice = {
  id: string;
  invoiceNumber: string;
  material: string;
  weightKg: number;
  amount: number;
  paymentMethod: "cash" | "upi";
  status: string;
  createdAt?: string;
  serviceType?: string;
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
  lat?: number;
  lng?: number;
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
  "ScrapUncle Dealer": "/dashboard/dealer",
  Admin: "/dashboard/admin",
};

export const apiRoles: Record<ApiRole, Role> = {
  citizen: "Citizen",
  collector: "Collector",
  recycler: "Recycler",
  dealer: "ScrapUncle Dealer",
  admin: "Admin",
};

export const roleContent: Record<
  Role,
  { title: string; subtitle: string; action: string; metric: string }
> = {
  Citizen: {
    title: "Your waste can create real value.",
    subtitle: "Schedule pickup, track live, get paid.",
    action: "Schedule pickup",
    metric: "Your impact",
  },
  Collector: {
    title: "Smarter routes, more profit.",
    subtitle: "Maps, collect, assign to recyclers.",
    action: "View queue",
    metric: "Route progress",
  },
  Recycler: {
    title: "Reliable material supply.",
    subtitle: "Reserve nearby collector stock.",
    action: "Browse material",
    metric: "Live supply",
  },
  "ScrapUncle Dealer": {
    title: "Doorstep operations, verified.",
    subtitle: "Run QR-verified pickups, certified weighing and instant settlements.",
    action: "Open operations",
    metric: "ScrapUncle operations",
  },
  Admin: {
    title: "Trusted circular city.",
    subtitle: "Manage network and prices.",
    action: "Manage team",
    metric: "Network health",
  },
};
