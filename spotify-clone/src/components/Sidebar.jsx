import { assets } from "../assets/assets";
import { usePlayer } from "../context/usePlayer";
import { FaHeart } from "react-icons/fa";
import { FiArrowRight, FiLayers, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const {
    likedTrackIds,
    playlists,
    createMusicPlaylist,
    createPodcastPlaylist,
    songs,
  } = usePlayer();

  const likedSongs = (songs ?? []).filter((s) => likedTrackIds.includes(s.id));
  const likedCount = likedSongs.length;
  const hasPlaylists = (playlists ?? []).length > 0;
  const hasLibraryItems = hasPlaylists || likedCount > 0;

  return (
    <div className="w-[25%] hidden lg:flex flex-col text-white min-h-0">
      <div className="bg-[#121212] flex-1 rounded overflow-auto">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiLayers className="w-6 h-6" alt={assets.stack_icon} />
            <p className=" flex items-center font-semibold">Your Library</p>
          </div>

          <div className="flex items-center gap-3">
            <FiArrowRight className="w-8 h-8" alt={assets.arrow_icon} />
            <button
              type="button"
              onClick={createMusicPlaylist}
              className="w-8 h-8 grid place-items-center rounded hover:bg-white/10"
              aria-label="Create playlist"
              title="Create playlist"
            >
              <FiPlus className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-4">
          {likedCount > 0 && (
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded"
              onClick={() => navigate("/collection/liked")}
              role="button"
            >
              <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center">
                <FaHeart className="text-white text-lg" />
              </div>
              <div className="leading-tight">
                <p className="text-white font-semibold">Liked Songs</p>
                <p className="text-white/60 text-sm">
                  Playlist • {likedCount} {likedCount === 1 ? "song" : "songs"}
                </p>
              </div>
            </div>
          )}

          {!hasLibraryItems && (
            <div className="mt-3 space-y-1">
              {playlists.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer"
                  onClick={() => navigate(`/playlist/${p.id}`)}
                  role="button"
                >
                  <div className="w-12 h-12 rounded bg-[#242424]" />
                  <div className="leading-tight min-w-0">
                    <p className="text-white font-semibold truncate">
                      {p.name}
                    </p>
                    <p className="text-white/60 text-sm">
                      {p.type === "music" ? "Playlist" : "Podcast"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!hasLibraryItems && (
          <>
            <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4">
              <h1>Create your first playlist</h1>
              <p className="font-light">It's easy we will help you</p>
              <button
                onClick={createMusicPlaylist}
                className="px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4"
              >
                Create Playlist
              </button>
            </div>

            <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4">
              <h1>Let's find some podcasts to follow</h1>
              <p className="font-light">
                We'll kep you updated on new episodes
              </p>
              <button
                onClick={createPodcastPlaylist}
                className="px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4"
              >
                Browse Podcasts
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
