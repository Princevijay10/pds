import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "editor")) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Admin access required" });
};
