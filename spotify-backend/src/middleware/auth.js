import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token =
      header.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId).select("-passwordHash");

    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    if (user.status === "disabled") {
      return res.status(403).json({ success: false, message: "Account disabled" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid/expired token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  next();
};