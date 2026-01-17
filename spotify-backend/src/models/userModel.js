import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    status: { type: String, enum: ["active", "disabled"], default: "active" },
    disabledAt: { type: Date, default: null },
    disabledBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },

    likedSongIds: [{ type: String }],
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;