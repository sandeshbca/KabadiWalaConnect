"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  CheckCircle2,
  PauseCircle,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { AnalyticsOverview, MarketPrice, SessionUser } from "@/lib/types";
import { Card, Tag } from "@/components/ui";

type AdminProps = {
  team: SessionUser[];
  analytics?: AnalyticsOverview;
  marketPrices: MarketPrice[];
  busyMemberId?: string;
  updateMember: (member: SessionUser, changes: { verified?: boolean; active?: boolean }) => void;
  updateMarketPrice: (price: MarketPrice, changes: { pricePerKg?: number; trend?: MarketPrice["trend"] }) => void;
};

export function AdminDashboard({ team, analytics, marketPrices, busyMemberId, updateMember, updateMarketPrice }: AdminProps) {
  const activeTeam = team.filter((member) => member.active !== false).length;
  const pending = team.filter((member) => !member.verified && member.active !== false).length;
  const chartData = (analytics?.monthly || []).map((kg, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    kg,
    pickups: Math.round(kg / 8),
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={<UsersRound size={18} />} label="Active field team" value={String(activeTeam)} detail={`${pending} awaiting verification`} />
        <Metric icon={<ShieldCheck size={18} />} label="Verified partners" value={String(team.filter((member) => member.verified).length)} detail="Access-ready members" />
        <Metric icon={<BarChart3 size={18} />} label="Material tracked" value={`${analytics?.recycledKg || 0} kg`} detail={`${analytics?.pickups || 0} pickups on record`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">Operations analysis</p>
              <h2 className="mt-1 text-lg font-black text-forest">Material movement</h2>
              <p className="mt-1 text-xs text-slate-500">Last seven reporting periods</p>
            </div>
            <Tag>Live data</Tag>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="pickups" fill="#84cc16" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="kg" stroke="#064e3b" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ecfdf5" />
                <XAxis dataKey="day" hide />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="kg" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">Supply mix</p>
          <h2 className="mt-1 text-lg font-black text-forest">Top materials</h2>
          <div className="mt-6 space-y-4">
            {analytics?.materialBreakdown?.length ? analytics.materialBreakdown.map((item, index) => (
              <div key={item.material}>
                <div className="mb-1.5 flex justify-between gap-2 text-xs"><span className="truncate font-semibold text-slate-600">{item.material}</span><b className="text-forest">{item.weightKg} kg</b></div>
                <div className="h-2 overflow-hidden rounded-full bg-emerald-50"><div style={{ width: `${Math.min(100, (item.weightKg / (analytics.materialBreakdown?.[0]?.weightKg || 1)) * 100)}%` }} className={`h-full rounded-full ${["bg-emerald-500", "bg-lime-400", "bg-amber-400", "bg-sky-400", "bg-violet-400"][index]}`} /></div>
              </div>
            )) : <Empty text="Material analytics will appear as collectors publish stock." />}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-emerald-100 p-5 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">Market control</p>
          <h2 className="mt-1 text-lg font-black text-forest">Current reference rates</h2>
          <p className="mt-1 text-xs text-slate-500">Collector and recycler market page updates as soon as you save a rate.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {marketPrices.length ? marketPrices.map((price) => <MarketRateRow key={price.id} price={price} busy={busyMemberId === price.id} update={updateMarketPrice} />) : <div className="p-8"><Empty text="Loading market rates…" /></div>}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-emerald-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">Team control</p>
            <h2 className="mt-1 text-lg font-black text-forest">Collector & recycler management</h2>
            <p className="mt-1 text-xs text-slate-500">Verify new partners or pause access when operationally required.</p>
          </div>
          <Tag tone={pending ? "gold" : "green"}>{pending ? `${pending} pending` : "All reviewed"}</Tag>
        </div>
        <div className="divide-y divide-slate-100">
          {team.length ? team.map((member) => <TeamMember key={member.id} member={member} busy={busyMemberId === member.id} updateMember={updateMember} />) : <div className="p-8"><Empty text="No collectors or recyclers have registered yet." /></div>}
        </div>
      </Card>
    </div>
  );
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <Card className="p-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">{icon}</span><p className="mt-4 text-xs font-bold uppercase tracking-[.12em] text-slate-400">{label}</p><b className="mt-1 block text-2xl font-black tracking-tight text-forest">{value}</b><p className="mt-1 text-xs text-slate-500">{detail}</p></Card>;
}

function MarketRateRow({ price, busy, update }: { price: MarketPrice; busy: boolean; update: (price: MarketPrice, changes: { pricePerKg?: number; trend?: MarketPrice["trend"] }) => void }) {
  const [value, setValue] = useState(String(price.pricePerKg));
  const [trend, setTrend] = useState<MarketPrice["trend"]>(price.trend);
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : BarChart3;
  const save = () => update(price, { pricePerKg: Number(value), trend });
  return <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:px-6"><div className="min-w-0 flex-1"><b className="text-sm text-forest">{price.material}</b><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><TrendIcon size={13} className={trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-slate-400"} /> Last updated {price.updatedAt ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(price.updatedAt)) : "today"}</p></div><div className="flex gap-2"><label className="relative"><span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">₹</span><input aria-label={`${price.material} price per kg`} value={value} onChange={(event) => setValue(event.target.value)} type="number" min="0" step="0.01" className="w-24 rounded-xl border border-slate-200 py-2 pl-6 pr-2 text-sm font-bold text-forest outline-none focus:border-emerald-500" /></label><select aria-label={`${price.material} trend`} value={trend} onChange={(event) => setTrend(event.target.value as MarketPrice["trend"])} className="rounded-xl border border-slate-200 bg-white px-2 text-xs font-bold text-slate-600"><option value="up">Rising</option><option value="stable">Stable</option><option value="down">Falling</option></select><button disabled={busy || Number(value) < 0} onClick={save} className="rounded-xl bg-forest px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{busy ? "Saving…" : "Save"}</button></div></div>;
}

function TeamMember({ member, busy, updateMember }: { member: SessionUser; busy: boolean; updateMember: (member: SessionUser, changes: { verified?: boolean; active?: boolean }) => void }) {
  const paused = member.active === false;
  return <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:px-6"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700">{member.name.slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><b className="text-sm text-forest">{member.name}</b><Tag tone={member.verified ? "green" : "gold"}>{member.verified ? "Verified" : "KYC pending"}</Tag>{paused && <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700">Paused</span>}</div><p className="mt-1 truncate text-xs text-slate-500">{member.role} · {member.location?.area || "Location not set"} · {member.phone}</p></div><div className="flex gap-2">{!member.verified && <button disabled={busy || paused} onClick={() => updateMember(member, { verified: true })} className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><CheckCircle2 size={14} /> Verify</button>}<button disabled={busy} onClick={() => updateMember(member, { active: paused })} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold disabled:opacity-50 ${paused ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-100 bg-red-50 text-red-700"}`}><PauseCircle size={14} />{paused ? "Restore" : "Pause"}</button></div></div>;
}

function Empty({ text }: { text: string }) { return <p className="rounded-xl bg-slate-50 p-4 text-center text-sm leading-6 text-slate-500">{text}</p>; }
