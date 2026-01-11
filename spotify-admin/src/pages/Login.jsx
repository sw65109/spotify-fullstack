import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      nav("/add-song");
    } catch (ex) {
      setErr(ex?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-[#121212] p-6 rounded-xl">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        {err && <p className="text-red-300 mb-3">{err}</p>}

        <input
          className="w-full mb-3 p-2 rounded bg-[#1f1f1f] outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 rounded bg-[#1f1f1f] outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-white text-black rounded py-2 font-semibold">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;