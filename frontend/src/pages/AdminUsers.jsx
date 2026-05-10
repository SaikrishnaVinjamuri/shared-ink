import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const initials = (name) => (name || "?").charAt(0).toUpperCase();

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (p) => {
    const res = await api.get(`/api/users?page=${p}&limit=10`);
    const list = res.data.users || [];
    const adminId = user?.userId || user?._id;
    const filtered = adminId ? list.filter((u) => (u._id || u.userId) !== adminId) : list;
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
    const ok = window.confirm(`Delete "${u.username}"? This also deletes all their posts.`);
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage all registered accounts</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2.5rem_1fr_1.5fr_5rem_7rem] gap-4 items-center border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900/50">
          <span />
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Username</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Email</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Role</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 text-right">Actions</span>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 px-6 py-4">
                <div className="h-8 w-8 rounded-full bg-gray-100 shrink-0 dark:bg-gray-800" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-100 rounded w-32 dark:bg-gray-800" />
                  <div className="h-3 bg-gray-100 rounded w-48 dark:bg-gray-800" />
                </div>
                <div className="h-5 bg-gray-100 rounded-full w-12 shrink-0 dark:bg-gray-800" />
                <div className="flex gap-2 shrink-0">
                  <div className="h-7 w-12 bg-gray-100 rounded-lg dark:bg-gray-800" />
                  <div className="h-7 w-14 bg-gray-100 rounded-lg dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">No users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {users.map((u) => (
              <div
                key={u._id || u.userId}
                className="grid grid-cols-1 md:grid-cols-[2.5rem_1fr_1.5fr_5rem_7rem] gap-3 md:gap-4 items-start md:items-center px-6 py-4 hover:bg-gray-50/80 transition-colors dark:hover:bg-gray-800/30"
              >
                <span className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-semibold select-none dark:bg-gray-700 dark:text-gray-300">
                  {initials(u.username)}
                </span>

                <div className="flex items-center gap-2.5 md:block">
                  <span className="md:hidden inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-semibold select-none dark:bg-gray-700 dark:text-gray-300">
                    {initials(u.username)}
                  </span>
                  <span className="font-medium text-gray-900 text-sm dark:text-gray-100">{u.username}</span>
                </div>

                <span className="text-sm text-gray-500 truncate dark:text-gray-400">{u.email}</span>

                <div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    u.role === "admin"
                      ? "bg-gray-900 text-white dark:bg-gray-600 dark:text-white"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}>
                    {u.role || "user"}
                  </span>
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  <button
                    onClick={() => navigate(`/admin/users/${u._id || u.userId}`)}
                    disabled={loading}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteUser(u)}
                    disabled={loading}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-40 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-5 dark:border-gray-800">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1 || loading}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:text-gray-400 dark:hover:text-white"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-400 dark:text-gray-600">
            {page} <span className="text-gray-200 dark:text-gray-700">/</span> {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages || loading}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:text-gray-400 dark:hover:text-white"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
