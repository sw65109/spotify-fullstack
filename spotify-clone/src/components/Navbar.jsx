import { useEffect, useMemo, useRef, useState } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import { GoHomeFill } from "react-icons/go";
import { FaArrowCircleDown } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { usePlayer } from "../context/usePlayer.js";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const { searchQuery, setSearchQuery, songs, albums } = usePlayer();

  const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";
  const isAdmin = user?.role === "admin";
  const goToAdmin = () => {
    window.location.assign(ADMIN_URL);
  };

  const [isStandalone, setIsStandalone] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [draftQuery, setDraftQuery] = useState(searchQuery || "");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchBoxRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (e) => {
      const el = searchBoxRef.current;
      if (!el) return;
      if (el.contains(e.target)) return;
      setShowSuggestions(false);
      setMobileSearchOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    setDraftQuery(searchQuery || "");
  }, [searchQuery]);

  const userInitial = useMemo(() => {
    const base = user?.name || user?.email || "U";
    return base.trim().charAt(0).toUpperCase();
  }, [user]);

  useEffect(() => {
    const mql = window.matchMedia?.("(display-mode: standalone)");
    const getStandalone = () => Boolean(mql?.matches || window.navigator.standalone);
    const update = () => setIsStandalone(getStandalone());

    update();

    if (mql?.addEventListener) {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }
    if (mql?.addListener) {
      mql.addListener(update);
      return () => mql.removeListener(update);
    }
    return undefined;
  }, []);

  const q = (draftQuery || "").trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!q) return { songs: [], albums: [] };

    const songMatches = (songs ?? [])
      .filter((s) => {
        const name = (s?.name || "").toLowerCase();
        const desc = (s?.desc || "").toLowerCase();
        const album = (s?.album || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || album.includes(q);
      })
      .slice(0, 5);

    const albumMatches = (albums ?? [])
      .filter((a) => {
        const name = (a?.name || "").toLowerCase();
        const desc = (a?.desc || "").toLowerCase();
        return name.includes(q) || desc.includes(q);
      })
      .slice(0, 5);

    return { songs: songMatches, albums: albumMatches };
  }, [q, songs, albums]);

  const submitSearch = (nextQuery) => {
    const committed = (nextQuery ?? "").trim();
    setSearchQuery(committed);
    setShowSuggestions(false);
    setMobileSearchOpen(false);
    navigate("/search");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    submitSearch(draftQuery);
  };

  const pickSuggestion = (text) => {
    setDraftQuery(text);
    submitSearch(text);
  };

  const shouldShowSuggestions =
    showSuggestions &&
    q.length > 0 &&
    (suggestions.songs.length > 0 || suggestions.albums.length > 0);

  return (
    <div className="w-full relative">
      <div className="w-full flex items-center justify-between font-semibold px-3 sm:px-4 py-2 gap-2 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="hidden rounded-full sm:flex items-center justify-center cursor-pointer shrink-0"
            title="Home"
          >
            <img className="w-9" src={assets.spotify_logo} alt="Spotify" />
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full flex items-center justify-center cursor-pointer"
              title="Back"
            >
              <FiChevronLeft className="text-white/80 text-2xl" />
            </button>
            <button
              type="button"
              onClick={() => navigate(1)}
              className="rounded-full flex items-center justify-center cursor-pointer"
              title="Forward"
            >
              <FiChevronRight className="text-white/80 text-2xl" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-center gap-2 relative">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-10 h-10 bg-[#121212] rounded-full flex items-center justify-center cursor-pointer shrink-0"
            title="Home"
          >
            <GoHomeFill className="text-white/80 text-2xl" />
          </button>

          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="md:hidden w-10 h-10 bg-[#121212] rounded-full flex items-center justify-center cursor-pointer"
            title="Search"
          >
            {mobileSearchOpen ? (
              <FiX className="text-white/80 text-2xl" />
            ) : (
              <FiSearch className="text-white/80 text-2xl" />
            )}
          </button>

          <div ref={searchBoxRef} className="hidden md:block w-full max-w-[360px] min-w-0 relative">
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-3 bg-[#121212] rounded-full px-4 py-2 h-10 w-full min-w-0"
            >
              <button type="submit" className="shrink-0" title="Search">
                <FiSearch className="text-white/80 text-2xl" />
              </button>

              <input
                className="bg-transparent outline-none w-full min-w-0 text-sm text-white placeholder:text-[#b3b3b3]"
                placeholder="Search songs or albums…"
                value={draftQuery}
                onChange={(e) => setDraftQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
            </form>

            {shouldShowSuggestions && (
              <div className="absolute left-0 right-0 mt-2 bg-[#121212] border border-white/10 rounded-xl overflow-hidden z-50">
                {suggestions.songs.length > 0 && (
                  <div className="p-2">
                    <div className="text-white/60 text-xs px-2 pb-1">Songs</div>
                    {suggestions.songs.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => pickSuggestion(s.name)}
                        className="w-full text-left px-2 py-2 hover:bg-white/10 rounded-lg"
                      >
                        <div className="text-white text-sm">{s.name}</div>
                        <div className="text-white/60 text-xs">{s.album}</div>
                      </button>
                    ))}
                  </div>
                )}

                {suggestions.albums.length > 0 && (
                  <div className="p-2 border-t border-white/10">
                    <div className="text-white/60 text-xs px-2 pb-1">Albums</div>
                    {suggestions.albums.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => pickSuggestion(a.name)}
                        className="w-full text-left px-2 py-2 hover:bg-white/10 rounded-lg"
                      >
                        <div className="text-white text-sm">{a.name}</div>
                        <div className="text-white/60 text-xs">{a.desc}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-white text-black rounded-full cursor-pointer shrink-0 h-9 px-2 sm:px-3 md:px-4 text-sm sm:text-[15px]"
            title="Explore Premium"
          >
            <span className="inline min-[360px]:hidden font-bold">P</span>
            <span className="hidden min-[360px]:inline sm:hidden">Premium</span>
            <span className="hidden sm:inline">Explore Premium</span>
          </button>

          {!isStandalone && (
            <button
              type="button"
              className="flex items-center gap-1 bg-black py-1 px-3 rounded-2xl text-[15px] text-white cursor-pointer"
              title="Install App"
            >
              <FaArrowCircleDown />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {!token ? (
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="bg-[#1f1f1f] text-white rounded-full px-4 h-9 text-sm"
              title="Login"
            >
              Log in
            </button>
          ) : (
            <>
              {isAdmin && (
                <button
                  type="button"
                  onClick={goToAdmin}
                  className="bg-[#1f1f1f] text-white rounded-full px-4 h-9 text-sm"
                  title="Open Admin Panel"
                >
                  Admin Panel
                </button>
              )}

              <button
                type="button"
                onClick={() => logout()}
                className="bg-[#1f1f1f] text-white rounded-full px-4 h-9 text-sm"
                title="Logout"
              >
                Log out
              </button>

              <div
                className="bg-purple-500 text-black w-8 h-8 rounded-full flex items-center justify-center"
                title={user?.email || user?.name || "Account"}
              >
                {userInitial}
              </div>
            </>
          )}
        </div>
      </div>

      {mobileSearchOpen && (
        <div ref={searchBoxRef} className="md:hidden absolute left-0 right-0 top-full px-3 pb-3 z-50">
          <div className="bg-[#121212] rounded-2xl p-3 shadow-lg border border-white/5">
            <form onSubmit={onSubmit} className="flex items-center gap-3 bg-[#242424] rounded-full px-4 py-2 h-10">
              <button type="submit" className="shrink-0" title="Search">
                <FiSearch className="text-white/80 text-2xl" />
              </button>

              <input
                autoFocus
                className="bg-transparent outline-none w-full min-w-0 text-sm text-white placeholder:text-[#b3b3b3]"
                placeholder="Search songs or albums…"
                value={draftQuery}
                onChange={(e) => setDraftQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
              />
            </form>

            {shouldShowSuggestions && (
              <div className="mt-2 bg-[#121212] border border-white/10 rounded-xl overflow-hidden">
                {suggestions.songs.length > 0 && (
                  <div className="p-2">
                    <div className="text-white/60 text-xs px-2 pb-1">Songs</div>
                    {suggestions.songs.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => pickSuggestion(s.name)}
                        className="w-full text-left px-2 py-2 hover:bg-white/10 rounded-lg"
                      >
                        <div className="text-white text-sm">{s.name}</div>
                        <div className="text-white/60 text-xs">{s.album}</div>
                      </button>
                    ))}
                  </div>
                )}

                {suggestions.albums.length > 0 && (
                  <div className="p-2 border-t border-white/10">
                    <div className="text-white/60 text-xs px-2 pb-1">Albums</div>
                    {suggestions.albums.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => pickSuggestion(a.name)}
                        className="w-full text-left px-2 py-2 hover:bg-white/10 rounded-lg"
                      >
                        <div className="text-white text-sm">{a.name}</div>
                        <div className="text-white/60 text-xs">{a.desc}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;