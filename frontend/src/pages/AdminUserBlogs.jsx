import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/axios";
import { useToast } from "../context/ToastContext";

const readTime = (text) => {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function AdminUserBlogs() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

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

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        await fetchUserBlogs(page);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, page]);

  useEffect(() => {
    setPage(1);
  }, [userId]);

  const handleDelete = async (blogId) => {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;
    try {
      setLoading(true);
      setError("");
      await api.delete(`/api/blogs/delete/${blogId}`);
      toast.success("Post deleted");
      await fetchUserBlogs(page);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete post";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Posts</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {totalBlogs} {totalBlogs === 1 ? "post" : "posts"} total
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/users")}
          className="self-start rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          ← Back to Users
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
        {loading ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-start justify-between gap-4 px-6 py-5">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/5 dark:bg-gray-800" />
                  <div className="h-3.5 bg-gray-100 rounded w-full dark:bg-gray-800" />
                  <div className="h-3.5 bg-gray-100 rounded w-4/5 dark:bg-gray-800" />
                  <div className="h-3 bg-gray-100 rounded w-24 mt-2 dark:bg-gray-800" />
                </div>
                <div className="h-7 w-14 bg-gray-100 rounded-lg shrink-0 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">No posts for this user.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {blogs.map((b) => (
              <div key={b._id} className="flex items-start justify-between gap-4 px-6 py-5 hover:bg-gray-50/80 transition-colors dark:hover:bg-gray-800/30">
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/blog/${b._id}`}
                    state={{ from: `/admin/users/${userId}` }}
                    className="block text-base font-semibold text-gray-900 hover:text-black line-clamp-1 leading-snug dark:text-gray-100 dark:hover:text-white"
                  >
                    {b.title}
                  </Link>
                  <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed dark:text-gray-400">
                    {b.content}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <span>{formatDate(b.createdAt)}</span>
                    <span className="text-gray-200 dark:text-gray-700">·</span>
                    <span>{readTime(b.content)} min read</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(b._id)}
                  disabled={loading}
                  className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-40 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                  aria-label="Delete post"
                >
                  Delete
                </button>
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
