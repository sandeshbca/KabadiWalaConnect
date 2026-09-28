"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import { MarketPrice } from "@/lib/types";
import { Card, Tag } from "@/components/ui";
import { useI18n, speakText } from "@/lib/i18n";
import { SCRAP_CATEGORIES } from "@/lib/scrapCatalog";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MarketPage() {
  const { t, speechLang } = useI18n();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [error, setError] = useState("");
  const [locality, setLocality] = useState("Delhi");

  useEffect(() => {
    const token = sessionStorage.getItem("kc_token");
    if (!token) return;
    fetch(`${API}/api/market/prices`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data))
          setPrices(
            data.map((p: { _id: string; material: string; pricePerKg: number; trend: MarketPrice["trend"]; updatedAt?: string; localityRates?: MarketPrice["localityRates"] }) => ({
              id: p._id,
              material: p.material,
              pricePerKg: p.pricePerKg,
              trend: p.trend,
              updatedAt: p.updatedAt,
              localityRates: p.localityRates,
            })),
          );
      })
      .catch(() => setError("Could not load market rates."));
  }, []);

  useEffect(() => {
    if (prices.length)
      speakText(
        `Market rates. ${prices.map((p) => `${p.material} ${p.pricePerKg} rupees per kg`).join(". ")}`,
        speechLang,
      );
  }, [prices, speechLang]);

  const visiblePrices = [...prices].sort((a, b) => {
    const ai = SCRAP_CATEGORIES.indexOf(a.material as (typeof SCRAP_CATEGORIES)[number]);
    const bi = SCRAP_CATEGORIES.indexOf(b.material as (typeof SCRAP_CATEGORIES)[number]);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  });

  return (
    <main className="min-h-screen bg-[#f5faf7] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/citizen"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
        >
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-black text-forest">{t("marketRates")}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Live reference rates per kg — pickup estimates use these prices automatically.
        </p>
        <label className="mt-5 block max-w-xs text-xs font-bold text-slate-600">
          Your locality
          <select value={locality} onChange={(event) => setLocality(event.target.value)} className="field mt-1.5 w-full rounded-xl border-slate-200 px-3 py-2.5 text-sm">
            <option>Delhi</option><option>Varanasi</option><option>Bengaluru</option><option>Other locality</option>
          </select>
        </label>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-8 space-y-3">
          {visiblePrices.map((price) => {
            const local = price.localityRates?.find((item) => item.locality.toLowerCase() === locality.toLowerCase());
            const rate = local?.pricePerKg ?? price.pricePerKg;
            return (
            <Card key={price.id} className="flex items-center justify-between p-5">
              <div>
                <b className="text-forest">{price.material}</b>
                <p className="mt-1 text-xs text-slate-500">
                  Updated{" "}
                  {price.updatedAt
                    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                        new Date(price.updatedAt),
                      )
                    : "recently"}
                </p>
              </div>
              <div className="text-right">
                <p className="mb-1 text-[10px] font-bold uppercase text-emerald-700">{local ? `${locality} rate: ₹${rate}/kg` : "Base market rate"}</p>
                <b className="text-2xl font-black text-forest">₹{rate}</b>
                <Tag tone={price.trend === "up" ? "green" : "gold"}>
                  {price.trend === "up" ? (
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp size={12} /> Up
                    </span>
                  ) : price.trend === "down" ? (
                    <span className="inline-flex items-center gap-1">
                      <TrendingDown size={12} /> Down
                    </span>
                  ) : (
                    "Stable"
                  )}
                </Tag>
              </div>
            </Card>
          )})}
          {!prices.length && !error && (
            <p className="text-center text-sm text-slate-500">Loading rates…</p>
          )}
        </div>
      </div>
    </main>
  );
}
