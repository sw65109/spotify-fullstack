import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const SetupAdmin = () => {
  const { api } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
        adminCode,
      });

      if (!data?.success) throw new Error(data?.message || "Setup failed");

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      nav("/add-song");
      window.location.reload();
    } catch (ex) {
      setErr(ex?.response?.data?.message || ex?.message || "Setup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-white p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-[#121212] p-6 rounded-xl">
        <h1 className="text-xl font-bold mb-2">First Admin Setup</h1>
        <p className="text-white/60 text-sm mb-4">
          Create the first admin account using your admin code.
        </p>

        {err && <p className="text-red-300 mb-3 text-sm">{err}</p>}

        <input
          className="w-full mb-3 p-2 rounded bg-[#1f1f1f] outline-none"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 rounded bg-[#1f1f1f] outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 rounded bg-[#1f1f1f] outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 rounded bg-[#1f1f1f] outline-none"
          placeholder="Admin Code"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
        />

        <button className="w-full bg-white text-black rounded py-2 font-semibold">
          Create Admin
        </button>
      </form>
    </div>
  );
};

export default SetupAdmin;