import express from "express";
import { auth } from "../middleware/auth.js";
import { getLikes, toggleLike } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.get("/likes", auth, getLikes);
userRouter.post("/likes/toggle", auth, toggleLike);

export default userRouter;