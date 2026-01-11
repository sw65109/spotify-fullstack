import express from "express";
import { auth } from "../middleware/auth.js";
import {
  addTrack,
  createPlaylist,
  listPlaylists,
  removeTrack,
} from "../controller/playlistController.js";

const playlistRouter = express.Router();

playlistRouter.get("/list", auth, listPlaylists);
playlistRouter.post("/create", auth, createPlaylist);
playlistRouter.post("/add-track", auth, addTrack);
playlistRouter.post("/remove-track", auth, removeTrack);

export default playlistRouter;