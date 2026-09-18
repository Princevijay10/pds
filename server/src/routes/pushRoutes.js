import express from "express";
import { body, validationResult } from "express-validator";
import PushSubscription from "../models/PushSubscription.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { getPublicVapidKey, sendPushToAllAdmins } from "../services/pushService.js";

const router = express.Router();

router.get("/public-key", (req, res) => {
  res.json({ success: true, publicKey: getPublicVapidKey() });
});

router.post(
  "/subscribe",
  protect,
  adminOnly,
  [
    body("endpoint").isURL().withMessage("Invalid push endpoint"),
    body("keys.p256dh").isString().notEmpty(),
    body("keys.auth").isString().notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
      }

      const { endpoint, keys } = req.body;

      await PushSubscription.findOneAndUpdate(
        { endpoint },
        {
          user: req.user._id,
          endpoint,
          keys: {
            p256dh: keys.p256dh,
            auth: keys.auth,
          },
          userAgent: req.get("user-agent") || "",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.status(201).json({
        success: true,
        message: "Mobile notifications enabled on this device.",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/unsubscribe", protect, adminOnly, async (req, res, next) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint || typeof endpoint !== "string") {
      return res.status(400).json({ success: false, message: "Push endpoint is required" });
    }

    await PushSubscription.deleteOne({
      endpoint,
      user: req.user._id,
    });

    res.json({
      success: true,
      message: "Mobile notifications disabled on this device.",
    });
  } catch (err) {
    next(err);
  }
});

router.post("/test", protect, adminOnly, async (req, res, next) => {
  try {
    await sendPushToAllAdmins({
      title: "PDS Test Notification",
      body: "Mobile notifications are working correctly.",
      url: "/admin",
      tag: "pds-test",
    });

    res.json({ success: true, message: "Test notification sent." });
  } catch (err) {
    next(err);
  }
});

export default router;
