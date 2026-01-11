import { addSong, listSong, removeSong } from "../controller/songController.js";
import express from "express";
import upload from "../middleware/multer.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const songRouter = express.Router();

songRouter.get("/list", listSong);

songRouter.post(
  "/add",
  auth,
  requireAdmin,
  upload.fields([{ name: "image", maxCount: 1 }, { name: "audio", maxCount: 1 }]),
  addSong
);
songRouter.post("/remove", auth, requireAdmin, removeSong);

export default songRouter;