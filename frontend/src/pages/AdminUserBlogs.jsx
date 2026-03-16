import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/axios";

export default function AdminUserBlogs() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserBlogs = async (p) => {
    const res = await api.get(`/api/blogs/users/${userId}/blog?page=${p}`);
    setBlogs(res.data.blogs || []);
    setTotalPages(res.data.totalPages || 1);
    setTotalBlogs(res.data.totalBlogs || 0);
    setPage(res.data.currentPage || p);
  };

  // ✅ Only fetch when page OR userId changes (single effect)
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        await fetchUserBlogs(page);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load user blogs");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, page]);

  // ✅ reset to page 1 when switching users
  useEffect(() => {
    setPage(1);
  }, [userId]);

  const handleDelete = async (blogId) => {
    const ok = window.confirm("Delete this blog?");
    if (!ok) return;

    try {
      setLoading(true);
      setError("");

      await api.delete(`/api/blogs/delete/${blogId}`);

      // refresh current page
      await fetchUserBlogs(page);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Blogs</h1>
          <p className="text-sm text-gray-600">Total posts: {totalBlogs}</p>
        </div>

        <button
          onClick={() => navigate("/admin/users")}
          className="w-full sm:w-auto rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
        >
          ← Back to Users
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Blogs wrapper */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-gray-600">Loading...</p>
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-600">No blogs for this user.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((b) => (
              <div
                key={b._id}
                className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <Link
                      to={`/blog/${b._id}`}
                      state={{ from: `/admin/users/${userId}` }}
                      className="text-base font-semibold hover:underline block"
                    >
                      {b.title}
                    </Link>

                    
                    <p className="mt-2 text-sm text-gray-700 line-clamp-3 leading-relaxed">
                      {b.content}
                    </p>

                    <div className="mt-4 text-xs text-gray-500">
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(b._id)}
                    className="w-full sm:w-auto shrink-0 rounded-xl border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                    disabled={loading}
                    aria-label="Delete blog"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        )}

        {/* ✅ Responsive Pagination (Option 6) */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <div className="flex items-center gap-2">
            <button
              className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page <= 1 || loading}
              aria-label="Previous page"
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
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
