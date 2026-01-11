import { Route, Routes } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import DisplayLiked from "./DisplayLiked";
import DisplayPlaylist from "./DisplayPlaylist";
import DisplaySearch from "./DisplaySearch";

const Display = () => {
  return (
      
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/collection/liked" element={<DisplayLiked />} />
        <Route path="/playlist/:id" element={<DisplayPlaylist />} />
        <Route path="/search" element={<DisplaySearch />} />
      </Routes>
  );
};

export default Display;
