"use client";

import { FormEvent, useState } from "react";
import { Star } from "lucide-react";
import { PickupRequest } from "@/lib/types";
import { Card } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export function FeedbackPanel({
  pickups,
  onSubmit,
}: {
  pickups: PickupRequest[];
  onSubmit: (pickupId: string, rating: number, comment: string) => Promise<void>;
}) {
  const { t } = useI18n();
  const [pickupId, setPickupId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const eligible = pickups.filter(
    (p) => p.status === "Verified" || p.status === "Collected",
  );

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pickupId) return;
    setSaving(true);
    try {
      await onSubmit(pickupId, rating, comment);
      setComment("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-black text-forest">{t("feedback")}</h2>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <select
          value={pickupId}
          onChange={(e) => setPickupId(e.target.value)}
          className="field w-full rounded-xl border-slate-200 px-3 py-2 text-sm"
          required
        >
          <option value="">Select completed pickup</option>
          {eligible.map((p) => (
            <option key={p.id} value={p.id}>
              {p.waste} — {p.area}
            </option>
          ))}
        </select>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`rounded-lg p-2 ${rating >= n ? "text-amber-500" : "text-slate-300"}`}
            >
              <Star size={20} fill={rating >= n ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          className="field w-full rounded-xl border-slate-200 px-3 py-2 text-sm"
          rows={3}
        />
        <button
          type="submit"
          disabled={saving || !eligible.length}
          className="w-full rounded-xl bg-forest py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Submit rating"}
        </button>
      </form>
    </Card>
  );
}
