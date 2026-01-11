import { usePlayer } from "../context/usePlayer";
import { FiMusic } from "react-icons/fi";

const RightSideBar = () => {
  const { currentTrack, isPlaying } = usePlayer();

  return (
    <div className="w-[25%] hidden lg:flex flex-col text-white min-h-0">
      <div className="bg-[#121212] flex-1 rounded overflow-auto">
        {!currentTrack ? (
          <div className="text-center pt-4 text-white/60">
            <p className="font-semibold text-white">Now playing</p>
            <p className="mt-2">Select a song to start playing.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="font-semibold mt-4 pl-4">Now playing</p>
              <p className="text-xs text-white/60 mt-4 pr-4">
                {isPlaying ? "Playing" : "Paused"}
              </p>
            </div>

            <div className="mt-4">
              <img className="w-full rounded p-4" src={currentTrack.image} alt="" />
              <p className="mt-3 pl-4 font-bold text-lg">{currentTrack.name}</p>
              <p className="pl-4 text-white/70 text-sm">{currentTrack.desc}</p>

              <div className="mt-4 pl-4 flex items-center gap-2 text-white/70">
                <FiMusic />
                <p className="text-sm">From your library</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RightSideBar;
