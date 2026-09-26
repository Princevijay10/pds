import express from "express";
import DailyPostDelivery from "../models/DailyPostDelivery.js";
import { generateAndUploadDailyPost } from "../services/dailyPostService.js";
import { sendDailyPostToAll } from "../services/whatsappService.js";

const router = express.Router();

const requireAutomationSecret = (req, res, next) => {
  const expected = process.env.DAILY_POST_AUTOMATION_SECRET;
  const supplied = req.get("x-pds-automation-secret");

  if (!expected) {
    return res.status(503).json({ success: false, message: "Daily post automation is not configured" });
  }

  if (!supplied || supplied !== expected) {
    return res.status(401).json({ success: false, message: "Unauthorized automation request" });
  }

  next();
};

// POST /api/automation/daily-post
// Intended for the 06:00 IST GitHub Actions trigger.
router.post("/daily-post", requireAutomationSecret, async (req, res, next) => {
  try {
    const generated = await generateAndUploadDailyPost();
    const existing = await DailyPostDelivery.findOne({ date: generated.date });

    if (existing?.status === "sent") {
      return res.status(200).json({
        success: true,
        skipped: true,
        message: "Today's post has already been sent",
        delivery: existing,
      });
    }

    const delivery = existing || new DailyPostDelivery({ date: generated.date });
    delivery.occasion = generated.occasion.occasion;
    delivery.imageUrl = generated.imageUrl;
    delivery.status = "generated";
    delivery.error = "";
    await delivery.save();

    const results = await sendDailyPostToAll({
      imageUrl: generated.imageUrl,
      date: generated.date,
      occasion: generated.occasion.occasion,
    });

    delivery.whatsappMessageIds = results.map((item) => item.messageId).filter(Boolean);
    delivery.status = "sent";
    await delivery.save();

    return res.status(200).json({
      success: true,
      date: generated.date,
      occasion: generated.occasion,
      imageUrl: generated.imageUrl,
      recipients: results.map(({ recipient, messageId }) => ({ recipient, messageId })),
    });
  } catch (error) {
    try {
      const date = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      await DailyPostDelivery.findOneAndUpdate(
        { date },
        { $set: { status: "failed", error: error.message } },
        { upsert: true }
      );
    } catch {
      // Preserve the original error response even if tracking fails.
    }
    next(error);
  }
});

export default router;
