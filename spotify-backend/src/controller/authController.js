import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const OWNER_ADMIN_ID = process.env.OWNER_ADMIN_ID;

const signToken = (userId) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

const computeRoleForRegister = async (adminCode) => {
  const hasAdmin = await userModel.exists({ role: "admin" });
  if (hasAdmin) return "user";

  const expected = process.env.ADMIN_REGISTER_CODE;
  if (!expected) return "user";

  return adminCode && adminCode === expected ? "admin" : "user";
};

export const register = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const normalizedEmail = email.toLowerCase();

    const existing = await userModel.findOne({ email: normalizedEmail });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const role = await computeRoleForRegister(adminCode);

    const user = await userModel.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role,
      likedSongIds: [],
    });

    const token = signToken(user._id);
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err?.message || "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email: (email || "").toLowerCase(),
    });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const ok = await bcrypt.compare(password || "", user.passwordHash);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = signToken(user._id);
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err?.message || "Server error" });
  }
};

export const me = async (req, res) => {
  return res.json({ success: true, user: req.user });
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const normalizedEmail = email.toLowerCase();

    const existing = await userModel.findOne({ email: normalizedEmail });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: "admin",
      likedSongIds: [],
    });

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err?.message || "Server error" });
  }
};

export const promoteUserToAdmin = async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId && !email) {
      return res
        .status(400)
        .json({ success: false, message: "userId or email required" });
    }

    const target = userId
      ? await userModel.findById(userId)
      : await userModel.findOne({ email: String(email).toLowerCase() });

    if (!target) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (target.role === "admin") {
      return res.json({
        success: true,
        message: "User is already an admin",
        user: {
          id: target._id,
          name: target.name,
          email: target.email,
          role: target.role,
          createdAt: target.createdAt,
        },
      });
    }

    target.role = "admin";
    await target.save();

    return res.json({
      success: true,
      user: {
        id: target._id,
        name: target.name,
        email: target.email,
        role: target.role,
        createdAt: target.createdAt,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err?.message || "Server error" });
  }
};

export const listAdmins = async (req, res) => {
  try {
    const role = (req.query.role || "admin").toLowerCase();
    const filterRole = role === "user" ? "user" : "admin";

    const users = await userModel
      .find({ role: filterRole })
      .select("_id name email role createdAt")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err?.message || "Server error" });
  }
};

export const demoteAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "userId required" });

    const target = await userModel.findById(userId);
    if (!target)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (OWNER_ADMIN_ID && String(target._id) === String(OWNER_ADMIN_ID)) {
      return res
        .status(403)
        .json({ success: false, message: "Owner admin cannot be demoted" });
    }

    if (target.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Target user is not an admin" });
    }

    const adminCount = await userModel.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot demote the last admin" });
    }

    target.role = "user";
    await target.save();

    return res.json({
      success: true,
      user: { id: target._id, role: target.role },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err?.message || "Server error" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "userId required" });

    const target = await userModel.findById(userId);
    if (!target)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const OWNER_ADMIN_ID = process.env.OWNER_ADMIN_ID;
    if (OWNER_ADMIN_ID && String(target._id) === String(OWNER_ADMIN_ID)) {
      return res
        .status(403)
        .json({ success: false, message: "Owner admin cannot be removed." });
    }

    if (target.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Target user is not an admin" });
    }

    if (target.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Target user is not an admin" });
    }

    const adminCount = await userModel.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot delete the last admin" });
    }

    await userModel.deleteOne({ _id: userId });
    return res.json({ success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err?.message || "Server error" });
  }

};
export const listUsers = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();
    const role = String(req.query.role || "").toLowerCase();     
    const status = String(req.query.status || "").toLowerCase(); 

    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "20", 10)));
    const skip = (page - 1) * limit;

    const filter = {};
    if (role === "admin" || role === "user") filter.role = role;
    if (status === "active" || status === "disabled") filter.status = status;

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const [total, users] = await Promise.all([
      userModel.countDocuments(filter),
      userModel
        .find(filter)
        .select("_id name email role status createdAt disabledAt disabledBy")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return res.json({
      success: true,
      page,
      limit,
      total,
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
        disabledAt: u.disabledAt,
        disabledBy: u.disabledBy,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Server error" });
  }
};

export const disableUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    if (String(req.user._id) === String(userId)) {
      return res.status(403).json({ success: false, message: "You cannot disable your own account" });
    }

    if (OWNER_ADMIN_ID && String(userId) === String(OWNER_ADMIN_ID)) {
      return res.status(403).json({ success: false, message: "Owner admin cannot be disabled" });
    }

    const target = await userModel.findById(userId);
    if (!target) return res.status(404).json({ success: false, message: "User not found" });

    target.status = "disabled";
    target.disabledAt = new Date();
    target.disabledBy = req.user._id;
    await target.save();

    return res.json({ success: true, user: { id: target._id, status: target.status } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Server error" });
  }
};

export const enableUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    const target = await userModel.findById(userId);
    if (!target) return res.status(404).json({ success: false, message: "User not found" });

    target.status = "active";
    target.disabledAt = null;
    target.disabledBy = null;
    await target.save();

    return res.json({ success: true, user: { id: target._id, status: target.status } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    if (String(req.user._id) === String(userId)) {
      return res.status(403).json({ success: false, message: "You cannot delete your own account" });
    }

    if (OWNER_ADMIN_ID && String(userId) === String(OWNER_ADMIN_ID)) {
      return res.status(403).json({ success: false, message: "Owner admin cannot be removed" });
    }

    const target = await userModel.findById(userId);
    if (!target) return res.status(404).json({ success: false, message: "User not found" });


    await userModel.deleteOne({ _id: userId });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || "Server error" });
  }
};
