import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Auth = () => {
  const { login, register } = useAuth();
  const nav = useNavigate();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      nav("/");
    } catch (ex) {
      setErr(ex?.message || "Auth failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121212] rounded-2xl p-6 border border-white/10">
        <h1 className="text-xl font-bold mb-4">
          {mode === "login" ? "Login" : "Create account"}
        </h1>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-full text-sm ${
              mode === "login" ? "bg-white text-black" : "bg-[#242424] text-white"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-full text-sm ${
              mode === "register" ? "bg-white text-black" : "bg-[#242424] text-white"
            }`}
          >
            Register
          </button>
        </div>

        {err && <p className="text-red-300 mb-3 text-sm">{err}</p>}

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "register" && (
            <input
              className="w-full p-2 rounded bg-[#1f1f1f] outline-none"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            className="w-full p-2 rounded bg-[#1f1f1f] outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-2 rounded bg-[#1f1f1f] outline-none"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-white text-black rounded py-2 font-semibold">
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;