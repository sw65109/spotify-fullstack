import { createContext, useContext, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const baseURL = "http://localhost:4000";

  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("admin_user");
    return raw ? JSON.parse(raw) : null;
  });

  const api = useMemo(() => {
    const instance = axios.create({ baseURL });
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return instance;
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${baseURL}/api/auth/login`, { email, password });
    if (!data?.success) throw new Error(data?.message || "Login failed");

    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({ api, token, user, login, logout, isAdmin: user?.role === "admin" }),
    [api, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};