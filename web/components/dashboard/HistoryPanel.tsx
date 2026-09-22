"use client";

import { PickupRequest, TransactionRow } from "@/lib/types";
import { Card, Tag } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export function HistoryPanel({
  pickups,
  transactions,
}: {
  pickups: PickupRequest[];
  transactions: TransactionRow[];
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="border-b border-emerald-100 p-5">
          <h2 className="text-lg font-black text-forest">{t("pickupTracker")}</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {pickups.length ? (
            pickups.map((p) => (
              <div key={p.id} className="p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <b className="text-forest">{p.waste}</b>
                  <Tag>{p.status}</Tag>
                </div>
                <p className="mt-1 text-xs text-slate-500">{p.area}</p>
                {p.estimatedAmount != null && (
                  <p className="mt-1 text-xs font-bold text-emerald-700">
                    ₹{p.estimatedAmount} · {p.paymentMethod?.toUpperCase()} ·{" "}
                    {p.paymentStatus}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="p-6 text-center text-sm text-slate-500">No pickups yet.</p>
          )}
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b border-emerald-100 p-5">
          <h2 className="text-lg font-black text-forest">{t("transactions")}</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.length ? (
            transactions.map((tx) => (
              <div key={tx.id} className="p-4 text-sm">
                <b className="text-forest">₹{tx.amount}</b>
                <span className="ml-2 text-xs uppercase text-slate-500">
                  {tx.method}
                </span>
                <p className="mt-1 text-xs text-slate-500">
                  {tx.note || tx.pickupMaterial || "Pickup payment"} ·{" "}
                  {tx.createdAt}
                </p>
              </div>
            ))
          ) : (
            <p className="p-6 text-center text-sm text-slate-500">
              No transactions yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
