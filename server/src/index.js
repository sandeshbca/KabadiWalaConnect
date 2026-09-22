import "dotenv/config";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";
import multer from "multer";
import { analyzeScan } from "./controllers/scanController.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { analyticsRoutes } from "./routes/analyticsRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { marketRoutes } from "./routes/marketRoutes.js";
import { ensureDefaultMarketPrices } from "./controllers/marketController.js";
import { authRoutes } from "./routes/authRoutes.js";
import { inventoryRoutes } from "./routes/inventoryRoutes.js";
import { pickupRoutes } from "./routes/pickupRoutes.js";

if (!process.env.JWT_SECRET)
  throw new Error("JWT_SECRET must be set in server/.env");
const app = express();
const httpServer = createServer(app);
const origin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const io = new Server(httpServer, { cors: { origin } });
const scanUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

app.set("io", io);
app.use(cors({ origin, methods: ["GET", "POST", "PATCH"] }));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../uploads")));
app.get("/api/health", (_req, res) => res.json({ ok: true, realtime: true }));
app.use("/api/auth", authRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/market", marketRoutes);
app.post(
  "/api/scans/analyze",
  requireAuth,
  scanUpload.single("image"),
  analyzeScan,
);

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return next(new Error("Invalid access token"));
  }
});
io.on("connection", (socket) => {
  socket.join(`role:${socket.user.role}`);
  socket.emit("system:ready", {
    message: "Secure live collection feed connected",
  });
});
app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kabadiconnect2")
  .then(async () => {
    await ensureDefaultMarketPrices();
    httpServer.listen(process.env.PORT || 5000, () =>
      console.log("Secure API running on :5000"),
    );
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  });
