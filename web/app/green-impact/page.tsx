"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Droplets, Leaf, TreePine } from "lucide-react";
import { GreenImpactData } from "@/lib/types";
import { Card } from "@/components/ui";
import { useI18n, speakText } from "@/lib/i18n";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function GreenImpactPage() {
  const { t, speechLang } = useI18n();
  const [data, setData] = useState<GreenImpactData>();

  useEffect(() => {
    const token = sessionStorage.getItem("kc_token");
    if (!token) return;
    fetch(`${API}/api/impact/green`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!data) return;
    speakText(
      `Green impact. ${data.recycledKg} kilograms recycled. CO2 saved ${data.co2Kg} kilograms. ${data.trees} trees equivalent.`,
      speechLang,
    );
  }, [data, speechLang]);

  return (
    <main className="min-h-screen bg-[#f5faf7] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/citizen"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
        >
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-black text-forest">{t("greenImpact")}</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Metric icon={<Leaf />} label="Recycled" value={`${data?.recycledKg ?? "—"} kg`} />
          <Metric icon={<TreePine />} label="Tree equivalent" value={String(data?.trees ?? "—")} />
          <Metric icon={<Droplets />} label="Water saved" value={`${data?.waterLiters ?? "—"} L`} />
        </div>
        <Card className="mt-6 p-6">
          <p className="text-xs font-bold uppercase text-emerald-600">CO₂ avoided</p>
          <b className="text-4xl font-black text-forest">{data?.co2Kg ?? "—"} kg</b>
          <p className="mt-4 text-sm text-slate-600">{data?.tip}</p>
        </Card>
        {data?.materials?.length ? (
          <Card className="mt-6 p-6">
            <h2 className="font-black text-forest">By material</h2>
            <ul className="mt-4 space-y-2">
              {data.materials.map((m) => (
                <li key={m.material} className="flex justify-between text-sm">
                  <span>{m.material}</span>
                  <b>{m.kg} kg</b>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </main>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-5">
      <span className="text-emerald-600">{icon}</span>
      <p className="mt-2 text-xs font-bold uppercase text-slate-400">{label}</p>
      <b className="text-2xl font-black text-forest">{value}</b>
    </Card>
  );
}
