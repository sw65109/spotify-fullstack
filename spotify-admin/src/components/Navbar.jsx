import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, token, logout, isAdmin } = useAuth();
  const nav = useNavigate();

  const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

  const goToApp = () => {
    window.location.assign(APP_URL);
  };

  const onLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="navbar w-full border-b-2 border-gray-800 px-5 sm:px-12 py-4 text-lg flex items-center justify-between">
      <p>Admin Panel</p>

      <div className="flex items-center gap-3">
        {token && (
          <div className="text-sm text-gray-700">
            <span className="font-semibold">{user?.name || user?.email || "User"}</span>
            <span className="ml-2 text-gray-500">{isAdmin ? "(admin)" : ""}</span>
          </div>
        )}

        {token && (
          <button
            type="button"
            onClick={goToApp}
            className="text-sm bg-white text-black border border-black rounded-full px-4 py-2"
            title="Back to main app"
          >
            Back to App
          </button>
        )}

        {token && (
          <button
            type="button"
            onClick={onLogout}
            className="text-sm bg-black text-white rounded-full px-4 py-2"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;