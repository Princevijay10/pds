import express from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { sendPushToAllAdmins } from "../services/pushService.js";

const router = express.Router();

const ALLOWED_STATUSES = ["new", "contacted", "qualified", "converted", "closed"];
const PHONE_REGEX = /^\+[1-9]\d{7,14}$/;
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeRegex = (str = "") => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: {
    success: false,
    message: "Too many messages sent. Please try again later.",
  },
});

const sendNotification = async (lead) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Prince Digital Studio Website" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
      subject: `New Enquiry: ${lead.name} - ${lead.service || "General"}`,
      html: `
        <h2>New Website Enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(lead.phone) || "-"}</p>
        <p><strong>Service:</strong> ${escapeHtml(lead.service) || "-"}</p>
        <p><strong>Budget:</strong> ${escapeHtml(lead.budget) || "-"}</p>
        <p><strong>Message:</strong><br />${escapeHtml(lead.message)}</p>
      `,
    });
  } catch (err) {
    console.error("Email notify failed:", err.message);
  }
};

router.post(
  "/",
  contactLimiter,
  [
    body("name").trim().notEmpty().isLength({ max: 100 }).withMessage("Name is required and cannot exceed 100 characters"),
    body("email").trim().normalizeEmail().isEmail().isLength({ max: 254 }).withMessage("Valid email is required"),
    body("phone").optional({ values: "falsy" }).trim().custom((value) => PHONE_REGEX.test(value)).withMessage("Phone must use international format, e.g. +916367276064"),
    body("service").optional({ values: "falsy" }).trim().isLength({ max: 100 }).withMessage("Service cannot exceed 100 characters"),
    body("budget").optional({ values: "falsy" }).trim().isLength({ max: 50 }).withMessage("Budget cannot exceed 50 characters"),
    body("message").trim().isLength({ min: 10, max: 5000 }).withMessage("Message must be between 10 and 5000 characters"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
      }

      const { name, email, phone, service, budget, message } = req.body;
      const lead = await Contact.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || undefined,
        service: service?.trim() || undefined,
        budget: budget?.trim() || undefined,
        message: message.trim(),
      });

      sendNotification(lead);

      // Push notification is intentionally non-blocking: a push failure must
      // never prevent the lead from being saved successfully.
      sendPushToAllAdmins({
        title: "New PDS Lead",
        body: `${lead.name} sent a new ${lead.service || "project"} enquiry.`,
        url: "/admin/leads",
        tag: `lead-${lead._id}`,
      }).catch((pushError) => {
        console.error("Lead push notification failed:", pushError.message);
      });

      res.status(201).json({
        success: true,
        message: "Thanks! Your message has been received. We'll get back to you within 24 hours.",
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const filter = {};

    if (typeof status === "string" && ALLOWED_STATUSES.includes(status)) filter.status = status;

    if (typeof search === "string" && search.trim()) {
      const term = escapeRegex(search.trim().slice(0, 200));
      const searchRegex = new RegExp(term, "i");
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { message: searchRegex },
      ];
    }

    const leads = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit);
    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      count: leads.length,
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
      leads,
    });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid lead ID" });
    }

    const { status, internalNotes, followUpDate, lastContacted } = req.body;
    const updateData = {};

    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid lead status" });
      }
      updateData.status = status;
    }

    if (internalNotes !== undefined) {
      if (typeof internalNotes !== "string") {
        return res.status(400).json({ success: false, message: "Internal notes must be text" });
      }
      if (internalNotes.length > 8080) {
        return res.status(400).json({ success: false, message: "Internal notes cannot exceed 8080 characters" });
      }
      updateData.internalNotes = internalNotes.trim();
    }

    if (followUpDate !== undefined) {
      if (followUpDate === null || followUpDate === "") {
        updateData.followUpDate = null;
      } else {
        const parsedDate = new Date(followUpDate);
        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({ success: false, message: "Invalid follow-up date" });
        }
        updateData.followUpDate = parsedDate;
      }
    }

    if (lastContacted !== undefined) {
      if (lastContacted === null || lastContacted === "") {
        updateData.lastContacted = null;
      } else {
        const parsedDate = new Date(lastContacted);
        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({ success: false, message: "Invalid last contacted date" });
        }
        updateData.lastContacted = parsedDate;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const lead = await Contact.findByIdAndUpdate(req.params.id, { $set: updateData }, {
      new: true,
      runValidators: true,
    });

    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, message: "Lead updated successfully", lead });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid lead ID" });
    }
    const lead = await Contact.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
