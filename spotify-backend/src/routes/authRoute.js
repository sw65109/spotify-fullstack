import express from "express";
import {
    login,
    me,
    register,
    createAdmin,
    listAdmins,
    demoteAdmin,
    deleteAdmin,
    promoteUserToAdmin,
    listUsers,
    disableUser,
    enableUser,
    deleteUser,
  } from "../controller/authController.js";
import { auth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", auth, me);

authRouter.post("/admin/create", auth, requireAdmin, createAdmin);
authRouter.post("/admin/promote", auth, requireAdmin, promoteUserToAdmin);

authRouter.get("/admin/list", auth, requireAdmin, listAdmins);

authRouter.post("/admin/demote", auth, requireAdmin, demoteAdmin);
authRouter.post("/admin/delete", auth, requireAdmin, deleteAdmin);
authRouter.get("/admin/users", auth, requireAdmin, listUsers);
authRouter.post("/admin/user/disable", auth, requireAdmin, disableUser);
authRouter.post("/admin/user/enable", auth, requireAdmin, enableUser);

authRouter.post("/admin/user/delete", auth, requireAdmin, deleteUser);

export default authRouter;