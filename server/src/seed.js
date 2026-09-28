import "dotenv/config";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { Pickup } from "./models/Pickup.js";
import { Inventory } from "./models/Inventory.js";
import { MarketPrice } from "./models/MarketPrice.js";
import { Feedback } from "./models/Feedback.js";
import { Transaction } from "./models/Transaction.js";
import { ensureDefaultMarketPrices } from "./controllers/marketController.js";

const PASS = "Kabadi@123";

const users = [
  {
    name: "Admin Ops",
    phone: "9000000001",
    role: "admin",
    verified: true,
    location: { area: "Connaught Place, Delhi", lat: 28.6315, lng: 77.2167 },
  },
  {
    name: "Rahul Sharma",
    phone: "9876543210",
    role: "citizen",
    verified: true,
    location: { area: "Karol Bagh, Delhi", lat: 28.6512, lng: 77.191 },
  },
  {
    name: "Priya Verma",
    phone: "9876543211",
    role: "citizen",
    verified: true,
    location: { area: "Lajpat Nagar, Delhi", lat: 28.5672, lng: 77.2431 },
  },
  {
    name: "Amit Singh",
    phone: "9876543212",
    role: "citizen",
    verified: true,
    location: { area: "Rohini, Delhi", lat: 28.7495, lng: 77.0679 },
  },
  {
    name: "Vikram Collector",
    phone: "9811111111",
    role: "collector",
    verified: true,
    ratingAvg: 4.6,
    ratingCount: 12,
    location: { area: "Paharganj, Delhi", lat: 28.642, lng: 77.21 },
  },
  {
    name: "Suresh Kabadiwala",
    phone: "9811111112",
    role: "collector",
    verified: true,
    ratingAvg: 4.2,
    ratingCount: 8,
    location: { area: "Okhla, Delhi", lat: 28.554, lng: 77.268 },
  },
  {
    name: "ScrapUncle Delhi Operations",
    phone: "9811111113",
    role: "dealer",
    verified: true,
    ratingAvg: 4.9,
    ratingCount: 28,
    location: { area: "Karol Bagh, Delhi", lat: 28.6442, lng: 77.1887 },
  },
  {
    name: "Green Recycler Pvt Ltd",
    phone: "9822222221",
    role: "recycler",
    verified: true,
    location: { area: "Mayapuri, Delhi", lat: 28.629, lng: 77.105 },
  },
  {
    name: "EcoCycle Recycler",
    phone: "9822222222",
    role: "recycler",
    verified: true,
    location: { area: "Narela, Delhi", lat: 28.852, lng: 77.092 },
  },
];

async function upsertUser(entry) {
  let user = await User.findOne({ phone: entry.phone });
  if (user) {
    Object.assign(user, entry);
    user.password = PASS;
    await user.save();
    return user;
  }
  return User.create({ ...entry, password: PASS });
}

async function run() {
  const uri =
    process.env.MONGODB_URI || "mongodb+srv://SandeshBCA:sandesh123@bca.t2lrnyv.mongodb.net/?appName=BCA";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  await Promise.all([
    Pickup.deleteMany({}),
    Inventory.deleteMany({}),
    Feedback.deleteMany({}),
    Transaction.deleteMany({}),
  ]);
  await User.deleteMany({});
  await MarketPrice.deleteMany({});
  await ensureDefaultMarketPrices();

  const created = {};
  for (const u of users) {
    const doc = await upsertUser(u);
    created[u.role + u.phone] = doc;
    console.log(`User: ${doc.role} ${doc.phone} / ${PASS}`);
  }

  const rahul = created["citizen9876543210"];
  const priya = created["citizen9876543211"];
  const vikram = created["collector9811111111"];
  const suresh = created["collector9811111112"];
  const scrapUncle = created["dealer9811111113"];
  const greenRec = created["recycler9822222221"];

  const pickupNew = await Pickup.create({
    name: rahul.name,
    phone: rahul.phone,
    userId: rahul._id,
    material: "PET plastic",
    weightKg: 12,
    address: "Karol Bagh, New Delhi 110005",
    lat: 28.6512,
    lng: 77.191,
    status: "requested",
    paymentMethod: "upi",
    pricePerKg: 25,
    estimatedAmount: 300,
    statusHistory: [{ status: "requested", at: new Date(), by: rahul._id }],
  });

  const pickupActive = await Pickup.create({
    name: priya.name,
    phone: priya.phone,
    userId: priya._id,
    material: "Mixed paper",
    weightKg: 8,
    address: "Lajpat Nagar II, New Delhi",
    lat: 28.5672,
    lng: 77.2431,
    status: "assigned",
    assignedCollector: vikram._id,
    paymentMethod: "cash",
    pricePerKg: 12,
    estimatedAmount: 96,
    statusHistory: [
      { status: "requested", at: new Date(Date.now() - 86400000), by: priya._id },
      { status: "assigned", at: new Date(), by: vikram._id },
    ],
  });

  const pickupCollected = await Pickup.create({
    name: rahul.name,
    phone: rahul.phone,
    userId: rahul._id,
    material: "Aluminium",
    weightKg: 5,
    address: "Karol Bagh Market, Delhi",
    lat: 28.6512,
    lng: 77.191,
    status: "collected",
    assignedCollector: vikram._id,
    paymentMethod: "cash",
    pricePerKg: 145,
    estimatedAmount: 725,
    statusHistory: [
      { status: "requested", at: new Date(Date.now() - 172800000), by: rahul._id },
      { status: "assigned", at: new Date(Date.now() - 86400000), by: vikram._id },
      { status: "collected", at: new Date(), by: vikram._id },
    ],
  });

  await Pickup.create({
    name: priya.name,
    phone: priya.phone,
    userId: priya._id,
    material: "E-waste",
    weightKg: 7,
    weighedKg: 7.2,
    weightSource: "iot",
    address: "Lajpat Nagar II, Delhi",
    status: "collected",
    assignedCollector: scrapUncle._id,
    paymentMethod: "upi",
    pricePerKg: 70,
    estimatedAmount: 504,
    serviceType: "e_waste",
    pickupMode: "business",
    verificationCode: "SCU-DEMO42",
    verificationStatus: "pending",
    statusHistory: [
      { status: "requested", at: new Date(Date.now() - 86400000), by: priya._id },
      { status: "assigned", at: new Date(Date.now() - 43200000), by: scrapUncle._id },
      { status: "weighed_iot", at: new Date(Date.now() - 3600000), by: scrapUncle._id },
      { status: "collected", at: new Date(), by: scrapUncle._id },
    ],
  });

  await Pickup.create({
    name: priya.name,
    phone: priya.phone,
    userId: priya._id,
    material: "Cardboard",
    weightKg: 15,
    address: "Lajpat Nagar, Delhi",
    status: "verified",
    assignedCollector: suresh._id,
    paymentStatus: "paid",
    inventoryListed: true,
    paymentMethod: "upi",
    pricePerKg: 14,
    estimatedAmount: 210,
    statusHistory: [
      { status: "requested", at: new Date(Date.now() - 604800000), by: priya._id },
      { status: "assigned", at: new Date(Date.now() - 518400000), by: suresh._id },
      { status: "collected", at: new Date(Date.now() - 432000000), by: suresh._id },
      { status: "verified", at: new Date(Date.now() - 345600000), by: suresh._id },
    ],
  });

  await Inventory.create({
    collectorId: suresh._id,
    collectorName: suresh.name,
    material: "Cardboard",
    weightKg: 15,
    pricePerKg: 14,
    location: { area: "Okhla Industrial, Delhi", lat: 28.554, lng: 77.268 },
    status: "available",
    pickupSourceId: pickupCollected._id,
  });

  await Inventory.create({
    collectorId: vikram._id,
    collectorName: vikram.name,
    material: "Iron scrap",
    weightKg: 40,
    pricePerKg: 35,
    location: { area: "Paharganj, Delhi", lat: 28.642, lng: 77.21 },
    status: "reserved",
    reservedBy: greenRec._id,
  });

  await Feedback.create({
    pickupId: pickupActive._id,
    citizenId: priya._id,
    collectorId: vikram._id,
    rating: 5,
    comment: "Fast pickup and fair weight.",
  });

  console.log("\n--- Demo logins (password for all: Kabadi@123) ---");
  console.log("Admin:     9000000001");
  console.log("Citizen:   9876543210 / 9876543211 / 9876543212");
  console.log("Collector: 9811111111 / 9811111112");
  console.log("Dealer:    9811111113 (ScrapUncle)");
  console.log("Recycler:  9822222221 / 9822222222");
  console.log("\nSample pickup IDs:");
  console.log(" New:       ", pickupNew._id.toString());
  console.log(" Assigned:  ", pickupActive._id.toString());
  console.log(" Collected: ", pickupCollected._id.toString(), "(use Assign to recycler)");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
