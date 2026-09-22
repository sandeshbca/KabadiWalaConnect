"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LineChart, LogOut, Recycle, UserRound } from "lucide-react";
import { Role, SessionUser, roleRoutes } from "@/lib/types";

export function AppNavigation({ role, notice, user }: { role: Role; notice?: string; user?: SessionUser }) {
  const router = useRouter();
  const signOut = () => {
    sessionStorage.removeItem("kc_token");
    sessionStorage.removeItem("kc_user");
    router.replace("/");
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-emerald-950/5 bg-white/95 px-5 py-3 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-lime"><Recycle size={20} /></span><span><b className="block leading-4 text-forest">KabadiConnect</b><small className="text-[11px] text-slate-500">India&apos;s circular network</small></span></Link>
        {notice && <p className="hidden max-w-md items-center gap-2 truncate text-xs font-semibold text-emerald-700 md:flex"><i className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-500" />{notice}</p>}
        <div className="flex items-center gap-2">
          {role !== "Citizen" && <Link href="/market" className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 sm:flex"><LineChart size={16} /> Market rates</Link>}
          <Link href={roleRoutes[role]} className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-forest transition hover:bg-emerald-100"><UserRound size={16} /><span className="hidden max-w-28 truncate sm:inline">{user?.name || role}</span></Link>
          <button onClick={signOut} className="rounded-xl p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600" title="Log out" aria-label="Log out"><LogOut size={17} /></button>
        </div>
      </div>
    </nav>
  );
}
