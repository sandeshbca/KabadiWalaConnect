import { Pickup } from "../models/Pickup.js";
import { User } from "../models/User.js";

const publicCoupon = (coupon) => ({
  code: coupon.code,
  title: coupon.title,
  value: coupon.value,
  active: coupon.active !== false,
});

export async function walletOverview(req, res) {
  const user = await User.findById(req.user.id).select(
    "walletBalance rewardPoints referralCode referralCount coupons",
  );
  res.json({
    balance: user.walletBalance || 0,
    rewardPoints: user.rewardPoints || 0,
    referralCode: user.referralCode || "SCRAPUNCLE",
    referralCount: user.referralCount || 0,
    coupons: (user.coupons || []).map(publicCoupon),
  });
}

export async function redeemReward(req, res) {
  const user = await User.findById(req.user.id);
  const points = Number(req.body.points || 500);
  if (!Number.isInteger(points) || points < 500)
    return res.status(400).json({ message: "Redeem at least 500 reward points" });
  if ((user.rewardPoints || 0) < points)
    return res.status(400).json({ message: "You do not have enough reward points" });
  const value = Math.floor(points / 100) * 10;
  const code = `GIFT${String(user._id).slice(-4).toUpperCase()}${Date.now().toString().slice(-4)}`;
  user.rewardPoints -= points;
  user.coupons.push({ code, title: `Reward gift card · ₹${value}`, value, active: true });
  await user.save();
  res.status(201).json({ coupon: publicCoupon(user.coupons.at(-1)), rewardPoints: user.rewardPoints });
}

export async function listInvoices(req, res) {
  const filter =
    req.user.role === "admin"
      ? { status: "verified" }
      : req.user.role === "citizen"
        ? { userId: req.user.id, status: "verified" }
        : { assignedCollector: req.user.id, status: "verified" };
  const invoices = await Pickup.find(filter)
    .select("material weightKg weighedKg estimatedAmount paymentMethod paymentStatus invoiceNumber createdAt serviceType")
    .sort({ updatedAt: -1 })
    .limit(100);
  res.json(
    invoices.map((pickup) => ({
      id: String(pickup._id),
      invoiceNumber: pickup.invoiceNumber || `SCU-${String(pickup._id).slice(-8).toUpperCase()}`,
      material: pickup.material,
      weightKg: pickup.weighedKg || pickup.weightKg || 0,
      amount: pickup.estimatedAmount || 0,
      paymentMethod: pickup.paymentMethod || "cash",
      status: pickup.paymentStatus || "paid",
      createdAt: pickup.createdAt,
      serviceType: pickup.serviceType || "scrap_pickup",
    })),
  );
}
