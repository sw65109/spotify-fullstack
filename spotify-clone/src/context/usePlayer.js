import { useContext } from "react";
import { PlayerContext } from "./PlayerContext.jsx";

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
};