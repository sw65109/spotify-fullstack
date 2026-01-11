import { useEffect, useMemo, useState } from "react";
import { assets } from "../assets/frontend-assets/assets";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import { GoHomeFill } from "react-icons/go";
import { FaArrowCircleDown } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const [isStandalone, setIsStandalone] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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

        <div className="flex-1 min-w-0 flex items-center justify-center gap-2">
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

          <div className="hidden md:flex items-center gap-3 bg-[#121212] rounded-full px-4 py-2 h-10 w-full max-w-[300px] min-w-0">
            <FiSearch className="text-white/80 text-2xl shrink-0" />
            <input
              className="bg-transparent outline-none w-full min-w-0 text-sm text-white placeholder:text-[#b3b3b3]"
              placeholder="What do you want to play?"
            />
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
        <div className="md:hidden absolute left-0 right-0 top-full px-3 pb-3 z-50">
          <div className="bg-[#121212] rounded-2xl p-3 shadow-lg border border-white/5">
            <div className="flex items-center gap-3 bg-[#242424] rounded-full px-4 py-2 h-10">
              <FiSearch className="text-white/80 text-2xl shrink-0" />
              <input
                autoFocus
                className="bg-transparent outline-none w-full min-w-0 text-sm text-white placeholder:text-[#b3b3b3]"
                placeholder="Search songs…"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;