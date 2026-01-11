import playlistModel from "../models/playlistModel.js";

export const listPlaylists = async (req, res) => {
  const playlists = await playlistModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return res.json({ success: true, playlists });
};

export const createPlaylist = async (req, res) => {
  const { name, type } = req.body;
  if (!name) return res.status(400).json({ success: false, message: "name required" });

  const pl = await playlistModel.create({
    userId: req.user._id,
    name,
    type: type === "podcast" ? "podcast" : "music",
    trackIds: [],
  });

  return res.json({ success: true, playlist: pl });
};

export const addTrack = async (req, res) => {
  const { playlistId, songId } = req.body;
  if (!playlistId || !songId) {
    return res.status(400).json({ success: false, message: "playlistId and songId required" });
  }

  const pl = await playlistModel.findOne({ _id: playlistId, userId: req.user._id });
  if (!pl) return res.status(404).json({ success: false, message: "Playlist not found" });

  if (!pl.trackIds.includes(songId)) pl.trackIds.push(songId);
  await pl.save();

  return res.json({ success: true, playlist: pl });
};

export const removeTrack = async (req, res) => {
  const { playlistId, songId } = req.body;

  const pl = await playlistModel.findOne({ _id: playlistId, userId: req.user._id });
  if (!pl) return res.status(404).json({ success: false, message: "Playlist not found" });

  pl.trackIds = pl.trackIds.filter((id) => id !== songId);
  await pl.save();

  return res.json({ success: true, playlist: pl });
};