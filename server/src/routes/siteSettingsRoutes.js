import express from "express";
import SiteSettings from "../models/SiteSettings.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const getSettings = async () =>
  SiteSettings.findOneAndUpdate(
    { key: "global" },
    { $setOnInsert: { key: "global", showHomepageStats: true } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

router.get("/public", async (req, res, next) => {
  try {
    const settings = await getSettings();
    res.json({ success: true, settings: { showHomepageStats: settings.showHomepageStats } });
  } catch (err) {
    next(err);
  }
});

router.get("/admin", protect, adminOnly, async (req, res, next) => {
  try {
    const settings = await getSettings();
    res.json({ success: true, settings: { showHomepageStats: settings.showHomepageStats } });
  } catch (err) {
    next(err);
  }
});

router.put("/admin", protect, adminOnly, async (req, res, next) => {
  try {
    if (typeof req.body.showHomepageStats !== "boolean") {
      return res.status(400).json({ success: false, message: "showHomepageStats must be a boolean" });
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { key: "global" },
      { $set: { showHomepageStats: req.body.showHomepageStats } },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );

    res.json({ success: true, settings: { showHomepageStats: settings.showHomepageStats } });
  } catch (err) {
    next(err);
  }
});

export default router;
