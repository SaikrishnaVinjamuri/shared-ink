import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (p) => {
    const res = await api.get(`/api/users?page=${p}&limit=5`);
    const list = res.data.users || [];

    const adminId = user?.userId || user?._id;
    const filtered = adminId
      ? list.filter((u) => (u._id || u.userId) !== adminId)
      : list;

    setUsers(filtered);
    setTotalPages(res.data.totalPages || 1);
    setPage(res.data.currentPage || p);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await fetchUsers(page);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [page]);

  const deleteUser = async (u) => {
    const id = u._id || u.userId;
    const ok = window.confirm(
      `Delete user "${u.username}"?\nThis deletes all their blogs.`
    );
    if (!ok) return;

    try {
      setLoading(true);
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((x) => (x._id || x.userId) !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-gray-600">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-gray-600">No users found.</p>
        ) : (
          <div className="divide-y">
            {users.map((u) => (
              <div
                key={u._id || u.userId}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-medium">{u.username}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() =>
                      navigate(`/admin/users/${u._id || u.userId}`)
                    }
                    className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                    disabled={loading}
                  >
                    View
                  </button>

                  <button
                    onClick={() => deleteUser(u)}
                    className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination (single row always) */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page <= 1 || loading}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page <b className="text-gray-900">{page}</b> / {totalPages}
          </span>

          <button
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
