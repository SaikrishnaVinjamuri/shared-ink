import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";

const readTime = (text) => {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

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
        if (!accessToken) { setMe(null); setBlogs([]); setTotalBlogs(0); setTotalPages(1); setPage(1); return; }
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

  useEffect(() => {
    const run = async () => {
      try {
        if (!me) return;
        setLoading(true);
        setError("");
        await loadMyBlogs(me._id || me.userId, page);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (blogId) => {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;
    try {
      setLoading(true);
      await api.delete(`/api/blogs/delete/${blogId}`);
      await loadMyBlogs(me._id || me.userId, page);
      toast.success("Post deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  const displayName = me?.username || user?.username || "—";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-10">
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Profile header */}
      <div className="flex items-start gap-5">
        <div className="shrink-0 h-16 w-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold select-none dark:bg-gray-700">
          {displayInitial}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 truncate dark:text-white">{displayName}</h1>
          <p className="mt-0.5 text-sm text-gray-500 truncate dark:text-gray-400">{me?.email || "—"}</p>

          <div className="mt-3 flex items-center gap-5 flex-wrap">
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{totalBlogs}</span>
              <span className="ml-1.5 text-sm text-gray-500 dark:text-gray-400">{totalBlogs === 1 ? "post" : "posts"}</span>
            </div>
            {(me?.role === "admin" || user?.role === "admin") && (
              <span className="inline-flex items-center rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-gray-700">
                Admin
              </span>
            )}
          </div>
        </div>

        <Link
          to="/write"
          className="shrink-0 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          New post
        </Link>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800" />

      {/* Posts */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-6 dark:text-gray-100">Posts</h2>

        {loading && blogs.length === 0 ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4 dark:bg-gray-800" />
                    <div className="h-3.5 bg-gray-100 rounded w-full dark:bg-gray-800" />
                    <div className="h-3.5 bg-gray-100 rounded w-5/6 dark:bg-gray-800" />
                    <div className="h-3 bg-gray-100 rounded w-24 mt-3 dark:bg-gray-800" />
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <div className="h-8 w-14 bg-gray-100 rounded-lg dark:bg-gray-800" />
                    <div className="h-8 w-14 bg-gray-100 rounded-lg dark:bg-gray-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-gray-200 rounded-2xl dark:border-gray-800">
            <p className="text-gray-400 text-sm dark:text-gray-500">No posts yet.</p>
            <Link to="/write" className="mt-3 text-sm font-medium text-gray-900 hover:underline underline-offset-4 dark:text-white">
              Write your first post →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((b) => (
              <div key={b._id} className="rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-200 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:shadow-none">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/blog/${b._id}`}
                      state={{ from: "/profile" }}
                      className="block text-base font-semibold text-gray-900 hover:text-black leading-snug line-clamp-1 dark:text-gray-100 dark:hover:text-white"
                    >
                      {b.title}
                    </Link>
                    <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed dark:text-gray-400">
                      {b.content}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                      <span>{formatDate(b.createdAt)}</span>
                      <span className="text-gray-200 dark:text-gray-700">·</span>
                      <span>{readTime(b.content)} min read</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/edit/${b._id}`)}
                      disabled={loading}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      disabled={loading}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-40 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5 dark:border-gray-800">
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
    </div>
  );
}
