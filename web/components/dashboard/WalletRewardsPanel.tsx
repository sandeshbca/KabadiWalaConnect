"use client";

import { Gift, ReceiptText, Share2, Wallet } from "lucide-react";
import { Card, Tag } from "@/components/ui";
import { DigitalInvoice, WalletData } from "@/lib/types";

export function WalletRewardsPanel({
  wallet,
  invoices,
  redeem,
}: {
  wallet?: WalletData;
  invoices: DigitalInvoice[];
  redeem: () => Promise<void>;
}) {
  const share = async () => {
    const copy = `Join ScrapUncle on KabadiConnect with my referral code ${wallet?.referralCode || "SCRAPUNCLE"}.`;
    if (navigator.share) await navigator.share({ text: copy });
    else await navigator.clipboard?.writeText(copy);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={<Wallet size={18} />} label="Wallet balance" value={`₹${wallet?.balance ?? 0}`} detail="Instant pickup settlements" />
        <Metric icon={<Gift size={18} />} label="Reward points" value={String(wallet?.rewardPoints ?? 0)} detail="500 points = a gift card" />
        <Metric icon={<Share2 size={18} />} label="Successful referrals" value={String(wallet?.referralCount ?? 0)} detail="₹25 + 250 points per referral" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">Rewards & gift cards</p>
          <h2 className="mt-1 text-lg font-black text-forest">Make every pickup more valuable</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Apply an active bonus coupon while booking, or redeem 500 reward points for a new gift-card coupon.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(wallet?.coupons || []).map((coupon) => (
              <Tag key={coupon.code} tone={coupon.active ? "green" : "gold"}>{coupon.code} · ₹{coupon.value} {coupon.active ? "ready" : "used"}</Tag>
            ))}
            {!wallet?.coupons?.length && <span className="text-xs text-slate-500">No active coupons yet.</span>}
          </div>
          <button onClick={() => void redeem()} disabled={(wallet?.rewardPoints || 0) < 500} className="mt-5 rounded-xl bg-forest px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Redeem 500 points</button>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">Referral reward</p>
          <h2 className="mt-1 text-lg font-black text-forest">Invite your locality</h2>
          <div className="mt-4 rounded-2xl bg-emerald-50 p-4">
            <span className="text-xs font-bold text-emerald-700">YOUR CODE</span>
            <b className="mt-1 block text-2xl tracking-widest text-forest">{wallet?.referralCode || "SCRAPUNCLE"}</b>
          </div>
          <button onClick={() => void share()} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50"><Share2 size={16} /> Share invite</button>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-emerald-100 p-5 sm:px-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-600">Digital invoices</p><h2 className="mt-1 text-lg font-black text-forest">Verified pickup records</h2></div>
        <div className="divide-y divide-slate-100">
          {invoices.length ? invoices.map((invoice) => <div key={invoice.id} className="flex flex-wrap items-center gap-3 p-5 sm:px-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><ReceiptText size={18} /></span><div className="min-w-0 flex-1"><b className="block text-sm text-forest">{invoice.invoiceNumber}</b><p className="mt-1 text-xs text-slate-500">{invoice.material} · {invoice.weightKg} kg · {invoice.serviceType?.replaceAll("_", " ")}</p></div><div className="text-right"><b className="text-sm text-forest">₹{invoice.amount}</b><p className="mt-1 text-[11px] uppercase text-emerald-700">{invoice.paymentMethod} · {invoice.status}</p></div><button onClick={() => window.print()} className="rounded-lg border border-emerald-100 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50">Print</button></div>) : <p className="p-8 text-center text-sm text-slate-500">Invoices appear after QR/OTP verification.</p>}
        </div>
      </Card>
    </div>
  );
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <Card className="p-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">{icon}</span><p className="mt-3 text-xs font-bold uppercase tracking-[.12em] text-slate-400">{label}</p><b className="mt-1 block text-2xl font-black text-forest">{value}</b><p className="mt-1 text-xs text-slate-500">{detail}</p></Card>;
}
