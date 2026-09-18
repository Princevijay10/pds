import express from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import Service from "../models/Service.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const serviceValidators = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("shortDescription").trim().notEmpty().withMessage("Short description is required"),
  body("fullDescription").trim().notEmpty().withMessage("Full description is required"),
];

router.get("/", async (req, res, next) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, count: services.length, services });
  } catch (err) {
    next(err);
  }
});

router.get("/admin", protect, adminOnly, async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({ success: true, count: services.length, services });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid service ID" });
    }
    const service = await Service.findOne({ _id: req.params.id, active: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, service });
  } catch (err) {
    next(err);
  }
});

router.post("/", protect, adminOnly, serviceValidators, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", protect, adminOnly, serviceValidators, async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid service ID" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, service });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid service ID" });
    }
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, message: "Service deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
