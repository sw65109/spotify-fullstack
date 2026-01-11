import { useMemo } from "react";
import { usePlayer } from "../context/usePlayer";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";

const DisplaySearch = () => {
  const { searchQuery, songs, albums, dataLoading, dataError } = usePlayer();

  const q = (searchQuery || "").trim().toLowerCase();

  const filteredAlbums = useMemo(() => {
    if (!q) return [];
    return (albums ?? []).filter((a) => {
      const name = (a?.name || "").toLowerCase();
      const desc = (a?.desc || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [albums, q]);

  const filteredSongs = useMemo(() => {
    if (!q) return [];
    return (songs ?? []).filter((s) => {
      const name = (s?.name || "").toLowerCase();
      const desc = (s?.desc || "").toLowerCase();
      const album = (s?.album || "").toLowerCase();
      return name.includes(q) || desc.includes(q) || album.includes(q);
    });
  }, [songs, q]);

  if (dataLoading) return <div className="mt-6 text-white/70">Loading…</div>;
  if (dataError) return <div className="mt-6 text-red-300">Error: {dataError}</div>;

  if (!q) return <div className="mt-6 text-white/60">Type something and press Enter.</div>;

  return (
    <div className="mt-4">
      <div className="text-white/60 text-sm mb-3">Results for “{searchQuery}”</div>

      <h2 className="text-white font-bold text-xl mb-2">Songs</h2>
      {filteredSongs.length === 0 ? (
        <div className="text-white/60 mb-6">No songs found.</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth mb-6">
          {filteredSongs.map((item) => (
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
      )}

      <h2 className="text-white font-bold text-xl mb-2">Albums</h2>
      {filteredAlbums.length === 0 ? (
        <div className="text-white/60">No albums found.</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth">
          {filteredAlbums.map((item) => (
            <AlbumItem key={item.id} name={item.name} desc={item.desc} id={item.id} image={item.image} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplaySearch;