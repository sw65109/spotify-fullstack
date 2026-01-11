import userModel from "../models/userModel.js";

export const getLikes = async (req, res) => {
  return res.json({ success: true, likedSongIds: req.user.likedSongIds || [] });
};

export const toggleLike = async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) return res.status(400).json({ success: false, message: "songId required" });

    const user = await userModel.findById(req.user._id);
    const liked = user.likedSongIds.includes(songId);

    user.likedSongIds = liked
      ? user.likedSongIds.filter((id) => id !== songId)
      : [...user.likedSongIds, songId];

    await user.save();
    return res.json({ success: true, likedSongIds: user.likedSongIds });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message });
  }
};