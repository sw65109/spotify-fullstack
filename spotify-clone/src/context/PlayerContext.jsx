/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

export const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const { token, authFetch } = useAuth();

  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [likedTrackIds, setLikedTrackIds] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const normalizePlaylist = (p) => {
    if (!p) return null;
    return {
      ...p,
      id: p.id || p._id,
      trackIds: Array.isArray(p.trackIds) ? p.trackIds : [],
      type: p.type === "podcast" ? "podcast" : "music",
    };
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setDataLoading(true);
        setDataError(null);

        const [songsRes, albumsRes] = await Promise.all([
          fetch(`${API_URL}/api/song/list`),
          fetch(`${API_URL}/api/album/list`),
        ]);

        const songsJson = await songsRes.json();
        const albumsJson = await albumsRes.json();

        if (!songsJson?.success) throw new Error(songsJson?.message || "Failed to load songs");
        if (!albumsJson?.success) throw new Error(albumsJson?.message || "Failed to load albums");

        const mappedSongs = (songsJson.songs ?? []).map((s) => ({
          id: s._id,
          name: s.name,
          desc: s.desc,
          album: s.album,
          image: s.image,
          file: s.file,
          duration: s.duration,
        }));

        const mappedAlbums = (albumsJson.albums ?? []).map((a) => ({
          id: a._id,
          name: a.name,
          desc: a.desc,
          bgColor: a.bgColor,
          image: a.image,
        }));

        if (cancelled) return;
        setSongs(mappedSongs);
        setAlbums(mappedAlbums);
      } catch (err) {
        if (!cancelled) setDataError(err?.message || "Failed to load data");
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  useEffect(() => {
    let cancelled = false;

    const loadUserData = async () => {
      if (!token) {
        setLikedTrackIds([]);
        setPlaylists([]);
        return;
      }

      try {
        const [likesRes, playlistsRes] = await Promise.all([
          authFetch("/api/user/likes"),
          authFetch("/api/playlist/list"),
        ]);

        const likesJson = await likesRes.json();
        const playlistsJson = await playlistsRes.json();

        if (cancelled) return;

        setLikedTrackIds(likesJson?.likedSongIds || []);
        if (playlistsJson?.success) {
          setPlaylists((playlistsJson?.playlists || []).map(normalizePlaylist).filter(Boolean));
        } else {
          setPlaylists([]);
        }
      } catch {
        if (!cancelled) {
          setLikedTrackIds([]);
          setPlaylists([]);
        }
      }
    };

    loadUserData();
    return () => {
      cancelled = true;
    };
  }, [token, authFetch]);

  const createMusicPlaylist = async () => {
    if (!token) return;

    const name = `My Playlist ${playlists.filter((p) => p.type !== "podcast").length + 1}`;
    const res = await authFetch("/api/playlist/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type: "music" }),
    });

    const json = await res.json();
    if (json?.success) setPlaylists((prev) => [normalizePlaylist(json.playlist), ...prev]);
  };

  const createPodcastPlaylist = async () => {
    if (!token) return;

    const name = `Podcasts ${playlists.filter((p) => p.type === "podcast").length + 1}`;
    const res = await authFetch("/api/playlist/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type: "podcast" }),
    });

    const json = await res.json();
    if (json?.success) setPlaylists((prev) => [normalizePlaylist(json.playlist), ...prev]);
  };

  const toggleLikedTrack = async (trackId) => {
    if (!token) {
      setLikedTrackIds((prev) =>
        prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
      );
      return;
    }

    const res = await authFetch("/api/user/likes/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId: trackId }),
    });

    const json = await res.json();
    if (json?.success) setLikedTrackIds(json.likedSongIds || []);
  };

  const value = useMemo(
    () => ({
      API_URL,
      songs,
      albums,
      dataLoading,
      dataError,

      currentTrack,
      setCurrentTrack,
      isPlaying,
      setIsPlaying,

      likedTrackIds,
      toggleLikedTrack,

      playlists,
      createMusicPlaylist,
      createPodcastPlaylist,
    }),
    [API_URL, songs, albums, dataLoading, dataError, currentTrack, isPlaying, likedTrackIds, playlists]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};