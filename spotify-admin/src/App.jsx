import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AddAlbum from "./pages/AddAlbum";
import AddSong from "./pages/AddSong";
import ListSong from "./pages/ListSong";
import ListAlbum from "./pages/ListAlbum";
import Login from "./pages/Login";
import SetupAdmin from "./pages/SetupAdmin";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import AddAdmin from "./pages/AddAdmin";
import AdminList from "./pages/AdminList";
import UsersList from "./pages/UsersList";

const AdminLayout = () => {
  return (
    <div className="flex items-start min-h-screen">
      <ToastContainer />
      <Sidebar />

      <div className="flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]">
        <Navbar />
        <div className="pt-8 pl-5 sm:pt-12 sm:pl-12">
          <Routes>
            <Route
              path="/add-song"
              element={
                <AdminRoute>
                  <AddSong />
                </AdminRoute>
              }
            />
            <Route
              path="/add-album"
              element={
                <AdminRoute>
                  <AddAlbum />
                </AdminRoute>
              }
            />
            <Route
              path="/list-song"
              element={
                <AdminRoute>
                  <ListSong />
                </AdminRoute>
              }
            />
            <Route
              path="/list-album"
              element={
                <AdminRoute>
                  <ListAlbum />
                </AdminRoute>
              }
            />
            <Route
              path="/add-admin"
              element={
                <AdminRoute>
                  <AddAdmin />
                </AdminRoute>
              }
            />
            <Route
              path="/admins"
              element={
                <AdminRoute>
                  <AdminList />
                </AdminRoute>
              }
            />
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <UsersList />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/add-song" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={<SetupAdmin />} />
      <Route path="/*" element={<AdminLayout />} />
    </Routes>
  );
};

export default App;
