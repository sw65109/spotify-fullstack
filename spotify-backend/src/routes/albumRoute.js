import { addAlbum, listAlbum, removeAlbum } from "../controller/albumController.js";
import express from "express";
import upload from "../middleware/multer.js";
import { auth, requireAdmin } from "../middleware/auth.js";

const albumRouter = express.Router();

albumRouter.get("/list", listAlbum);

albumRouter.post("/add", auth, requireAdmin, upload.single("image"), addAlbum);
albumRouter.post("/remove", auth, requireAdmin, removeAlbum);

export default albumRouter;