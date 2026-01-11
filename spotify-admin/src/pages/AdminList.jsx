import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso || "";
  }
};

const AdminList = () => {
  const { api, user } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const myEmail = useMemo(() => (user?.email || "").toLowerCase(), [user]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/auth/admin/list"); // defaults to role=admin
      if (!data?.success) throw new Error(data?.message || "Failed to load admins");
      setAdmins(data.users || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to load admins");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const demote = async (id) => {
    try {
      const { data } = await api.post("/api/auth/admin/demote", { userId: id });
      if (!data?.success) throw new Error(data?.message || "Failed to demote");
      toast.success("Admin demoted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to demote admin");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this admin user?")) return;
    try {
      const { data } = await api.post("/api/auth/admin/delete", { userId: id });
      if (!data?.success) throw new Error(data?.message || "Failed to delete");
      toast.success("Admin deleted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete admin");
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center min-h-[60vh]">
        <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-black drop-shadow-[-6px_6px_#00FF5B] rounded p-6 w-full max-w-4xl">
      <h2 className="text-2xl font-semibold mb-1">Admins</h2>
      <p className="text-gray-600 mb-6">List of users with admin access.</p>

      {admins.length === 0 ? (
        <div className="text-gray-700">No admins found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-black text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Created</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => {
                const isMe = (a.email || "").toLowerCase() === myEmail;
                return (
                  <tr key={a.id} className="border-t border-black/20">
                    <td className="p-3">{a.name}</td>
                    <td className="p-3">{a.email}</td>
                    <td className="p-3">{formatDate(a.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="bg-black text-white px-3 py-1 rounded disabled:opacity-50"
                          onClick={() => demote(a.id)}
                          disabled={isMe}
                          title={isMe ? "Don’t demote yourself" : "Demote admin to user"}
                        >
                          Demote
                        </button>
                        <button
                          type="button"
                          className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                          onClick={() => remove(a.id)}
                          disabled={isMe}
                          title={isMe ? "Don’t delete yourself" : "Delete admin user"}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="text-xs text-gray-500 mt-3">
            Note: backend prevents removing/demoting the last admin.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminList;