import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { usePlayer } from "../context/usePlayer";
import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const DisplayHome = () => {
  const { albums, songs, dataLoading, dataError } = usePlayer();

  const albumsRowRef = useRef(null);
  const songsRowRef = useRef(null);

  const scrollRow = (ref, direction) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * 360, behavior: "smooth" });
  };

  if (dataLoading) return <div className="mt-6 text-white/70">Loading your music…</div>;

  if (dataError) {
    return (
      <div className="mt-6 text-red-300">
        Couldn’t load songs/albums: {dataError}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center gap-2 mt-4">
          <p className="bg-white text-black px-3 py-1 rounded-2xl cursor-pointer">All</p>
          <p className="bg-[#ffffff1a] px-4 py-1 rounded-2xl cursor-pointer">Music</p>
          <p className="bg-[#ffffff1a] px-4 py-1 rounded-2xl cursor-pointer">Podcasts</p>
          <p className="bg-[#ffffff1a] px-4 py-1 rounded-2xl cursor-pointer">AudioBooks</p>
        </div>

        <h1 className="my-5 font-bold text-2xl">Albums</h1>

        <div className="relative group">
          <button
            type="button"
            aria-label="Scroll albums left"
            onClick={() => scrollRow(albumsRowRef, -1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/60 text-white grid place-items-center
                       opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition"
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <button
            type="button"
            aria-label="Scroll albums right"
            onClick={() => scrollRow(albumsRowRef, 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/60 text-white grid place-items-center
                       opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition"
          >
            <FiChevronRight className="text-2xl" />
          </button>

          <div
            ref={albumsRowRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth"
          >
            {(albums ?? []).map((item) => (
              <AlbumItem
                key={item.id}
                name={item.name}
                desc={item.desc}
                id={item.id}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Songs</h1>

        <div className="relative group">
          <button
            type="button"
            aria-label="Scroll songs left"
            onClick={() => scrollRow(songsRowRef, -1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/60 text-white grid place-items-center
                       opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition"
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <button
            type="button"
            aria-label="Scroll songs right"
            onClick={() => scrollRow(songsRowRef, 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/60 text-white grid place-items-center
                       opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition"
          >
            <FiChevronRight className="text-2xl" />
          </button>

          <div
            ref={songsRowRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth"
          >
            {(songs ?? []).map((item) => (
              <SongItem
                key={item.id}
                name={item.name}
                desc={item.desc}
                id={item.id}
                image={item.image}
                file={item.file}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayHome;