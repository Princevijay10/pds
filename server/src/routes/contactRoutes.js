import express from "express";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const ALLOWED_STATUSES = ["new", "contacted", "qualified", "converted", "closed"];

// Escapes text before it's interpolated into the notification email's HTML,
// so a lead's name/message/etc. can't inject markup, fake links, or hidden
// text into the email the admin reads.
const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Escapes regex special characters before building a search RegExp from
// user input, so a search term can't be crafted into a catastrophic-backtracking
// pattern (ReDoS) or change the intended match.
const escapeRegex = (str = "") => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* =========================================================
   PUBLIC CONTACT FORM RATE LIMIT
========================================================= */

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: {
    success: false,
    message:
      "Too many messages sent. Please try again later.",
  },
});

/* =========================================================
   EMAIL NOTIFICATION
========================================================= */

const sendNotification = async (lead) => {
  if (
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Prince Digital Studio Website" <${process.env.SMTP_USER}>`,
      to:
        process.env.NOTIFY_EMAIL ||
        process.env.SMTP_USER,

      subject: `New Enquiry: ${lead.name} - ${
        lead.service || "General"
      }`,

      html: `
        <h2>New Website Enquiry</h2>

        <p>
          <strong>Name:</strong>
          ${escapeHtml(lead.name)}
        </p>

        <p>
          <strong>Email:</strong>
          ${escapeHtml(lead.email)}
        </p>

        <p>
          <strong>Phone:</strong>
          ${escapeHtml(lead.phone) || "-"}
        </p>

        <p>
          <strong>Service:</strong>
          ${escapeHtml(lead.service) || "-"}
        </p>

        <p>
          <strong>Budget:</strong>
          ${escapeHtml(lead.budget) || "-"}
        </p>

        <p>
          <strong>Message:</strong>
          <br />
          ${escapeHtml(lead.message)}
        </p>
      `,
    });
  } catch (err) {
    console.error(
      "Email notify failed:",
      err.message
    );
  }
};

/* =========================================================
   CREATE LEAD
   POST /api/contact
   PUBLIC
========================================================= */

router.post(
  "/",
  contactLimiter,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Valid email is required"),

    body("message")
      .trim()
      .isLength({ min: 10 })
      .withMessage(
        "Message must be at least 10 characters"
      ),
  ],

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      /*
       * IMPORTANT:
       * Only public contact fields are accepted here.
       *
       * internalNotes,
       * followUpDate,
       * lastContacted
       *
       * cannot be injected by a website visitor.
       */

      const {
        name,
        email,
        phone,
        service,
        budget,
        message,
      } = req.body;

      const lead = await Contact.create({
        name,
        email,
        phone,
        service,
        budget,
        message,
      });

      // Email failure should NOT fail lead creation.
      sendNotification(lead);

      res.status(201).json({
        success: true,
        message:
          "Thanks! Your message has been received. We'll get back to you within 24 hours.",
      });
    } catch (err) {
      next(err);
    }
  }
);

/* =========================================================
   GET LEADS
   GET /api/contact
   ADMIN
========================================================= */

router.get(
  "/",
  protect,
  adminOnly,
  async (req, res, next) => {
    try {
      const {
        status,
        page = 1,
        limit = 20,
        search,
      } = req.query;

      // Cap limit so a stray/huge value can't force one giant query, and
      // only accept a known status value (same bracket-notation query-param
      // injection concern as elsewhere — see portfolioRoutes.js).
      const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
      const safePage = Math.max(Number(page) || 1, 1);

      const filter = {};
      if (typeof status === "string" && ALLOWED_STATUSES.includes(status)) {
        filter.status = status;
      }

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

      const total =
        await Contact.countDocuments(filter);

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
  }
);

/* =========================================================
   UPDATE LEAD
   PUT /api/contact/:id
   ADMIN
========================================================= */

router.put(
  "/:id",
  protect,
  adminOnly,
  async (req, res, next) => {
    try {
      const {
        status,
        internalNotes,
        followUpDate,
        lastContacted,
      } = req.body;

      const updateData = {};

      /* -----------------------------------------------
         STATUS
      ------------------------------------------------ */

      if (status !== undefined) {
        if (!ALLOWED_STATUSES.includes(status)) {
          return res.status(400).json({
            success: false,
            message: "Invalid lead status",
          });
        }

        updateData.status = status;
      }

      /* -----------------------------------------------
         INTERNAL NOTES
      ------------------------------------------------ */

      if (internalNotes !== undefined) {
        if (
          typeof internalNotes !== "string"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Internal notes must be text",
          });
        }

        if (internalNotes.length > 8080) {
          return res.status(400).json({
            success: false,
            message:
              "Internal notes cannot exceed 8080 characters",
          });
        }

        updateData.internalNotes =
          internalNotes.trim();
      }

      /* -----------------------------------------------
         FOLLOW-UP DATE
      ------------------------------------------------ */

      if (followUpDate !== undefined) {
        if (
          followUpDate === null ||
          followUpDate === ""
        ) {
          updateData.followUpDate = null;
        } else {
          const parsedDate =
            new Date(followUpDate);

          if (
            Number.isNaN(parsedDate.getTime())
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Invalid follow-up date",
            });
          }

          updateData.followUpDate =
            parsedDate;
        }
      }

      /* -----------------------------------------------
         LAST CONTACTED
      ------------------------------------------------ */

      if (lastContacted !== undefined) {
        if (
          lastContacted === null ||
          lastContacted === ""
        ) {
          updateData.lastContacted = null;
        } else {
          const parsedDate =
            new Date(lastContacted);

          if (
            Number.isNaN(parsedDate.getTime())
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Invalid last contacted date",
            });
          }

          updateData.lastContacted =
            parsedDate;
        }
      }

      /* -----------------------------------------------
         NOTHING TO UPDATE
      ------------------------------------------------ */

      if (
        Object.keys(updateData).length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "No valid fields to update",
        });
      }

      /* -----------------------------------------------
         UPDATE DATABASE
      ------------------------------------------------ */

      const lead =
        await Contact.findByIdAndUpdate(
          req.params.id,
          { $set: updateData },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!lead) {
        return res.status(404).json({
          success: false,
          message: "Lead not found",
        });
      }

      res.json({
        success: true,
        message: "Lead updated successfully",
        lead,
      });
    } catch (err) {
      next(err);
    }
  }
);

/* =========================================================
   DELETE LEAD
   DELETE /api/contact/:id
   ADMIN
========================================================= */

router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res, next) => {
    try {
      const lead =
        await Contact.findByIdAndDelete(
          req.params.id
        );

      if (!lead) {
        return res.status(404).json({
          success: false,
          message: "Lead not found",
        });
      }

      res.json({
        success: true,
        message: "Lead deleted",
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;