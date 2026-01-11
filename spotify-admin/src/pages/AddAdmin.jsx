import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const AddAdmin = () => {
  const { api } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [promoteEmail, setPromoteEmail] = useState("");
  const [promoteLoading, setPromoteLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/admin/create", {
        name,
        email,
        password,
      });

      if (!data?.success)
        throw new Error(data?.message || "Failed to create admin");

      toast.success(`Admin created: ${data.user.email}`);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create admin"
      );
    } finally {
      setLoading(false);
    }
  };

  const promote = async (e) => {
    e.preventDefault();
    setPromoteLoading(true);

    try {
      const { data } = await api.post("/api/auth/admin/promote", {
        email: promoteEmail,
      });

      if (!data?.success)
        throw new Error(data?.message || "Failed to promote user");

      toast.success(`Promoted: ${data.user.email}`);
      setPromoteEmail("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to promote user"
      );
    } finally {
      setPromoteLoading(false);
    }
  };

  return (
    <div className="bg-white border border-black drop-shadow-[-6px_6px_#00FF5B] rounded p-6 w-full max-w-xl">
      <h2 className="text-2xl font-semibold mb-1">Create Admin</h2>
      <p className="text-gray-600 mb-6">
        Only an existing admin can create new admins.
      </p>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium mb-1">Name</p>
          <input
            className="w-full border border-black px-3 py-2 rounded outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Admin name"
            required
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Email</p>
          <input
            className="w-full border border-black px-3 py-2 rounded outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@email.com"
            type="email"
            required
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Password</p>
          <input
            className="w-full border border-black px-3 py-2 rounded outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            type="password"
            minLength={6}
            required
          />
        </div>
        <button
          disabled={loading}
          className="bg-black text-white rounded py-2 px-4 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>

        <div className="mt-8 border-t border-black/20 pt-6">
          <h3 className="text-xl font-semibold mb-1">Promote Existing User</h3>
          <p className="text-gray-600 mb-4">
            Enter a user’s email to grant admin access.
          </p>
        </div>
      </form>

      <form onSubmit={promote} className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium mb-1">User Email</p>
          <input
            className="w-full border border-black px-3 py-2 rounded outline-none"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            placeholder="user@email.com"
            type="email"
            required
          />
        </div>

        <button
          disabled={promoteLoading}
          className="bg-black text-white rounded py-2 px-4 disabled:opacity-60"
        >
          {promoteLoading ? "Promoting..." : "Promote to Admin"}
        </button>
      </form>
    </div>
  );
};

export default AddAdmin;
