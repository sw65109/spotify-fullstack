import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/display";
import Navbar from "./components/Navbar";
import RightSideBar from "./components/RightSideBar.jsx";
import Auth from "./pages/Auth.jsx";

const Shell = () => {
  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="shrink-0 px-2 pt-2">
        <Navbar />
      </div>

      <div className="flex-1 flex gap-2 p-2 overflow-hidden">
        <Sidebar />

        <div className="flex-1 min-h-0 rounded bg-[#121212] text-white overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto px-6 pt-4 pb-6">
            <Display />
          </div>
        </div>

        <RightSideBar />
      </div>

      <Player />
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/*" element={<Shell />} />
    </Routes>
  );
};

export default App;