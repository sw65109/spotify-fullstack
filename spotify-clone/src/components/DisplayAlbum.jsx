import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/frontend-assets/assets";
import { usePlayer } from "../context/usePlayer";

const DisplayAlbum = () => {
  const { id } = useParams();
  const { setCurrentTrack, setIsPlaying, albums, songs, dataLoading, dataError } =
    usePlayer();

  const albumData = useMemo(
    () => (albums ?? []).find((a) => a.id === id) ?? null,
    [albums, id]
  );

  const albumSongs = useMemo(() => {
    if (!albumData) return [];
    return (songs ?? []).filter(
      (s) =>
        s.album === albumData.name ||
        s.album === albumData.id
    );
  }, [songs, albumData]);

  if (dataLoading) return <div className="mt-6 text-white/70">Loading…</div>;
  if (dataError)
    return <div className="mt-6 text-red-300">Error: {dataError}</div>;

  if (!albumData) {
    return (
      <div className="mt-10">
        <p className="text-white/70">Album not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded" src={albumData.image} alt="" />
        <div className="flex flex-col">
          <p>Album</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">
            {albumData.name}
          </h2>
          <h4>{albumData.desc}</h4>
          <p className="mt1">
            <img className="inline-block w-5" src={assets.spotify_logo} alt="" />
            <b>Spotify </b>• <b>{albumSongs.length} songs</b>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Album</p>
        <p className="hidden sm:block">Date Added</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="" />
      </div>
      <hr />

      {albumSongs.map((item, index) => (
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
          <p className="text-[16px]">{albumData.name}</p>
          <p className="text-[16px] hidden sm:block">—</p>
          <p className="text-[16px] text-center">{item.duration}</p>
        </div>
      ))}
    </>
  );
};

export default DisplayAlbum;