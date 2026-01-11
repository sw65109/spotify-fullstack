import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/frontend-assets/assets";
import { usePlayer } from "../context/usePlayer";

const DisplayPlaylist = () => {
  const { id } = useParams();
  const {
    playlists,
    songs,
    dataLoading,
    dataError,
    setCurrentTrack,
    setIsPlaying,
  } = usePlayer();

  const playlist = useMemo(
    () => (playlists ?? []).find((p) => p.id === id) ?? null,
    [playlists, id]
  );

  const playlistSongs = useMemo(() => {
    if (!playlist) return [];
    const byId = new Map((songs ?? []).map((s) => [s.id, s]));
    const ids = playlist.trackIds ?? [];
    return ids.map((trackId) => byId.get(trackId)).filter(Boolean);
  }, [playlist, songs]);

  if (dataLoading) return <div className="mt-6 text-white/70">Loading…</div>;
  if (dataError) return <div className="mt-6 text-red-300">Error: {dataError}</div>;

  if (!playlist) {
    return (
      <div className="mt-10">
        <p className="text-white/70">Playlist not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <div className="w-48 h-48 rounded bg-[#242424]" />
        <div className="flex flex-col">
          <p>{playlist.type === "podcast" ? "Podcast" : "Playlist"}</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">{playlist.name}</h2>
          <p className="mt1">
            <img className="inline-block w-5" src={assets.spotify_logo} alt="" />
            <b> Spotify </b>• <b>{playlistSongs.length} songs</b>
          </p>
        </div>
      </div>

      {playlistSongs.length === 0 ? (
        <div className="mt-10">
          <p className="text-white/70">This playlist is empty.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
            <p>
              <b className="mr-4">#</b>Title
            </p>
            <p>Album</p>
            <p className="hidden sm:block">Date Added</p>
            <img className="m-auto w-4" src={assets.clock_icon} alt="" />
          </div>
          <hr />

          {playlistSongs.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
              onClick={() => {
                setCurrentTrack({
                  id: item.id,
                  name: item.name,
                  desc: item.desc,
                  image: item.image,
                  file: item.file,
                });
                setIsPlaying(true);
              }}
            >
              <p className="text-white">
                <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
                <img className="inline w-10 mr-5" src={item.image} alt="" />
                {item.name}
              </p>
              <p className="text-[16px]">{item.album || "—"}</p>
              <p className="text-[16px] hidden sm:block">—</p>
              <p className="text-[16px] text-center">{item.duration}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default DisplayPlaylist;