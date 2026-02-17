import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const { user, accessToken } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [me, setMe] = useState(null);

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // load profile
  const loadMe = async () => {
    const res = await api.get("/api/users/me");
    setMe(res.data.user);
    return res.data.user;
  };

  const loadMyBlogs = async (userId, p) => {
    const res = await api.get(`/api/blogs/users/${userId}/blog?page=${p}`);
    setBlogs(res.data.blogs || []);
    setTotalPages(res.data.totalPages || 1);
    setTotalBlogs(res.data.totalBlogs || 0);
    setPage(res.data.currentPage || p);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");

        if (!accessToken) {
          setMe(null);
          setBlogs([]);
          setTotalBlogs(0);
          setTotalPages(1);
          setPage(1);
          return;
        }

        const currentUser = await loadMe();
        await loadMyBlogs(currentUser._id || currentUser.userId, 1);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // page change
  useEffect(() => {
    const run = async () => {
      try {
        if (!me) return;
        setLoading(true);
        setError("");
        await loadMyBlogs(me._id || me.userId, page);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (blogId) => {
    const ok = window.confirm("Delete this blog?");
    if (!ok) return;

    try {
      setLoading(true);
      await api.delete(`/api/blogs/delete/${blogId}`);
      // reload current page
      await loadMyBlogs(me._id || me.userId, page);
      toast.success("Blog deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blogId) => {
    navigate(`/edit/${blogId}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">My Profile</h2>

        {loading && !me ? (
          <p className="mt-3 text-sm text-gray-600">Loading...</p>
        ) : (
          <div className="mt-4 space-y-2 text-sm">
            <div>
              <span className="font-medium">Username:</span>{" "}
              {me?.username || user?.username || "-"}
            </div>
            <div>
              <span className="font-medium">Email:</span> {me?.email || "-"}
            </div>
            <div>
              <span className="font-medium">Role:</span> {me?.role || user?.role || "-"}
            </div>
            <div>
              <span className="font-medium">No. of posts:</span> {totalBlogs}
            </div>
          </div>
        )}
      </div>

      {/* My Posts */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Posts</h2>
        </div>

        {loading && me ? (
          <p className="mt-3 text-sm text-gray-600">Loading posts...</p>
        ) : blogs.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">No posts yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {blogs.map((b) => (
              <div key={b._id} className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
                <div className="cursor-pointer" onClick={() => navigate(`/blog/${b._id}`, { state: { from: "/profile" } })}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      to={`/blog/${b._id}`}
                      state={{ from: "/profile" }}
                      className="text-base font-semibold hover:underline block"
                    >
                      {b.title}
                    </Link>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      {b.content}
                    </p>
                    <div className="mt-3 text-xs text-gray-500">
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(b._id)}
                      className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page <= 1 || loading}
          >
            Prev
          </button>

          <span className="text-sm">
            Page <b>{page}</b> / {totalPages}
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
