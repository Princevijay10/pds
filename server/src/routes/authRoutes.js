import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @route  POST /api/auth/login
router.post(
  "/login",
  loginLimiter,
  [body("email").isEmail().withMessage("Valid email required"), body("password").notEmpty()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      const token = signToken(user._id);
      res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route  GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// @route  PUT /api/auth/change-password
router.put(
  "/change-password",
  protect,
  [body("currentPassword").notEmpty(), body("newPassword").isLength({ min: 8 })],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
      }
      const user = await User.findById(req.user._id).select("+password");
      const ok = await user.comparePassword(req.body.currentPassword);
      if (!ok) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }
      user.password = req.body.newPassword;
      await user.save();
      res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
