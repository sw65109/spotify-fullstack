import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["music", "podcast"], default: "music" },
    trackIds: [{ type: String }],
  },
  { timestamps: true }
);

const playlistModel = mongoose.models.playlist || mongoose.model("playlist", playlistSchema);
export default playlistModel;