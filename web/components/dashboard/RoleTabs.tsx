import Link from "next/link";
import { Recycle, Route, ShieldCheck, UserRound } from "lucide-react";
import { Role, roleRoutes } from "@/lib/types";
const icons = {
  Citizen: UserRound,
  Collector: Route,
  Recycler: Recycle,
  Admin: ShieldCheck,
};
export function RoleTabs({ active }: { active: Role }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {(Object.keys(roleRoutes) as Role[]).map((role) => {
        const Icon = icons[role];
        return (
          <Link
            href={roleRoutes[role]}
            key={role}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${active === role ? "bg-forest text-white" : "border border-emerald-100 bg-white text-emerald-800"}`}
          >
            <Icon size={15} />
            {role}
          </Link>
        );
      })}
    </div>
  );
}

