import express from "express";
import Contact from "../models/Contact.js";
import Portfolio from "../models/Portfolio.js";
import Service from "../models/Service.js";
import Testimonial from "../models/Testimonial.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, async (req, res, next) => {
  try {
    const [totalLeads, newLeads, totalProjects, totalServices, totalTestimonials, recentLeads] =
      await Promise.all([
        Contact.countDocuments(),
        Contact.countDocuments({ status: "new" }),
        Portfolio.countDocuments(),
        Service.countDocuments(),
        Testimonial.countDocuments(),
        Contact.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      success: true,
      stats: { totalLeads, newLeads, totalProjects, totalServices, totalTestimonials },
      recentLeads,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
