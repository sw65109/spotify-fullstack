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

const UsersList = () => {
  const { api, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [role, setRole] = useState(""); // "", "user", "admin"
  const [status, setStatus] = useState(""); // "", "active", "disabled"

  const [page, setPage] = useState(1);
  const limit = 20;
  const [total, setTotal] = useState(0);

  const myId = user?.id ? String(user.id) : "";
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / limit)),
    [total]
  );

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/auth/admin/users", {
        params: { q, role, status, page, limit },
      });

      if (!data?.success) throw new Error(data?.message || "Failed to load users");

      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to load users");
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, role, status, page]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQ(qInput);
  };

  const disableUser = async (id) => {
    try {
      const { data } = await api.post("/api/auth/admin/user/disable", { userId: id });
      if (!data?.success) throw new Error(data?.message || "Failed to disable user");
      toast.success("User disabled");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Disable failed");
    }
  };

  const enableUser = async (id) => {
    try {
      const { data } = await api.post("/api/auth/admin/user/enable", { userId: id });
      if (!data?.success) throw new Error(data?.message || "Failed to enable user");
      toast.success("User enabled");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Enable failed");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user? This is permanent.")) return;
    try {
      const { data } = await api.post("/api/auth/admin/user/delete", { userId: id });
      if (!data?.success) throw new Error(data?.message || "Failed to delete user");
      toast.success("User deleted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Delete failed");
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
    <div className="bg-white border border-black drop-shadow-[-6px_6px_#00FF5B] rounded p-6 w-full max-w-6xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Users</h2>
          <p className="text-gray-600 mb-4">Manage users (disable/enable/delete).</p>
        </div>

        <form onSubmit={onSearch} className="flex gap-2 flex-wrap items-center">
          <input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Search name or email..."
            className="border border-black/30 px-3 py-2 rounded w-64"
          />

          <select
            value={role}
            onChange={(e) => {
              setPage(1);
              setRole(e.target.value);
            }}
            className="border border-black/30 px-3 py-2 rounded"
          >
            <option value="">All roles</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="border border-black/30 px-3 py-2 rounded"
          >
            <option value="">All statuses</option>
            <option value="active">active</option>
            <option value="disabled">disabled</option>
          </select>

          <button type="submit" className="bg-black text-white px-4 py-2 rounded">
            Search
          </button>
        </form>
      </div>

      {users.length === 0 ? (
        <div className="text-gray-700">No users found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border border-black text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Created</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isMe = myId && String(u.id) === myId;
                  const isDisabled = u.status === "disabled";

                  return (
                    <tr key={u.id} className="border-t border-black/20">
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            isDisabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {u.status}
                        </span>
                        {isDisabled && u.disabledAt ? (
                          <div className="text-xs text-gray-500 mt-1">
                            Disabled: {formatDate(u.disabledAt)}
                          </div>
                        ) : null}
                      </td>
                      <td className="p-3">{formatDate(u.createdAt)}</td>
                      <td className="p-3">
                        <div className="flex gap-2 flex-wrap">
                          {isDisabled ? (
                            <button
                              type="button"
                              className="bg-black text-white px-3 py-1 rounded disabled:opacity-50"
                              onClick={() => enableUser(u.id)}
                              disabled={isMe}
                              title={isMe ? "You can’t enable/disable yourself" : "Enable user"}
                            >
                              Enable
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="bg-black text-white px-3 py-1 rounded disabled:opacity-50"
                              onClick={() => disableUser(u.id)}
                              disabled={isMe}
                              title={isMe ? "You can’t enable/disable yourself" : "Disable user"}
                            >
                              Disable
                            </button>
                          )}

                          <button
                            type="button"
                            className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                            onClick={() => deleteUser(u.id)}
                            disabled={isMe}
                            title={isMe ? "You can’t delete yourself" : "Delete user"}
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
          </div>

          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="text-gray-600">
              Total: <span className="font-semibold">{total}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="border border-black px-3 py-1 rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <span className="text-gray-700">
                Page {page} / {totalPages}
              </span>
              <button
                type="button"
                className="border border-black px-3 py-1 rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersList;