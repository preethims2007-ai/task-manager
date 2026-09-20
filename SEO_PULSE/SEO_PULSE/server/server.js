import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import analysisRouter from "./routes/analysisRoutes.js";

// NOTE (Phase 2 / Pillar B - not part of this 60% build):
// Rank Tracker module (keyword position tracking + daily cron refresh)
// lives in routes/rankRoutes.js, controllers/rankController.js,
// services/rankTrackerService.js + keywordTrackingSevice.js, cron/rankTrackingCron.js
// It is planned for the final review and intentionally left out here.

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/auth", authRouter);
app.use("/api/analysis", analysisRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
