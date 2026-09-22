"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  LayoutDashboard,
  Leaf,
  LineChart,
  MapPin,
  Recycle,
  ScanLine,
  Star,
  Wallet,
} from "lucide-react";
import { Role } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Item = {
  id: string;
  href?: string;
  icon: typeof Leaf;
  label: string;
  action?: () => void;
};

export function DashboardSidebar({
  role,
  section,
  onSection,
  onScan,
}: {
  role: Role;
  section: string;
  onSection: (id: string) => void;
  onScan: () => void;
}) {
  const { t } = useI18n();
  const pathname = usePathname();
  const items: Item[] = [
    {
      id: "home",
      icon: LayoutDashboard,
      label: "Home",
      action: () => onSection("home"),
    },
    {
      id: "tracker",
      icon: MapPin,
      label: t("pickupTracker"),
      action: () => onSection("tracker"),
    },
    {
      id: "history",
      icon: History,
      label: t("history"),
      action: () => onSection("history"),
    },
    {
      id: "market",
      href: "/market",
      icon: LineChart,
      label: t("marketRates"),
    },
    {
      id: "impact",
      href: "/green-impact",
      icon: Leaf,
      label: t("greenImpact"),
    },
    {
      id: "scan",
      icon: ScanLine,
      label: t("aiScan"),
      action: onScan,
    },
  ];
  if (role === "Citizen" || role === "Recycler") {
    items.splice(3, 0, {
      id: "nearby",
      icon: Recycle,
      label: t("nearbyCollectors"),
      action: () => onSection("nearby"),
    });
  }
  if (role === "Collector") {
    items.splice(4, 0, {
      id: "earnings",
      icon: Wallet,
      label: "Earnings",
      action: () => onSection("earnings"),
    });
    items.push({
      id: "feedback",
      icon: Star,
      label: t("feedback"),
      action: () => onSection("feedback"),
    });
  }
  if (role === "Citizen") {
    items.push({
      id: "feedback",
      icon: Star,
      label: t("feedback"),
      action: () => onSection("feedback"),
    });
  }

  return (
    <aside className="flex shrink-0 flex-row gap-2 overflow-x-auto pb-2 xl:w-16 xl:flex-col xl:overflow-visible xl:pb-0">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === pathname ||
          (!item.href && section === item.id);
        const className = `group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
          active
            ? "bg-forest text-lime shadow-md"
            : "border border-emerald-100 bg-white text-emerald-800 hover:bg-emerald-50"
        }`;
        const tip = (
          <span className="pointer-events-none absolute left-full z-20 ml-2 hidden whitespace-nowrap rounded-lg bg-forest px-2 py-1 text-[11px] font-bold text-white opacity-0 transition group-hover:opacity-100 xl:block">
            {item.label}
          </span>
        );
        if (item.href) {
          return (
            <Link key={item.id} href={item.href} className={className} title={item.label}>
              <Icon size={20} />
              {tip}
            </Link>
          );
        }
        return (
          <button
            key={item.id}
            type="button"
            title={item.label}
            onClick={item.action}
            className={className}
          >
            <Icon size={20} />
            {tip}
          </button>
        );
      })}
    </aside>
  );
}
