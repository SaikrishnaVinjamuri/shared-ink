import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const readTime = (text) => {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const initials = (name) => (name || "?").charAt(0).toUpperCase();

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 p-6 animate-pulse dark:border-gray-800">
      <div className="h-5 bg-gray-100 rounded-md w-4/5 dark:bg-gray-800" />
      <div className="mt-3 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-full dark:bg-gray-800" />
        <div className="h-3.5 bg-gray-100 rounded w-5/6 dark:bg-gray-800" />
        <div className="h-3.5 bg-gray-100 rounded w-3/4 dark:bg-gray-800" />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-800" />
        <div className="h-3 bg-gray-100 rounded w-24 dark:bg-gray-800" />
        <div className="h-3 bg-gray-100 rounded w-16 ml-auto dark:bg-gray-800" />
      </div>
    </div>
  );
}

export default function Home() {
  const toast = useToast();
  const { user } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async (p) => {
    const res = await api.get(`/api/blogs?page=${p}&limit=6`);
    setBlogs(res.data.blogs || []);
    setTotalPages(res.data.totalPages || 1);
    setPage(res.data.currentPage || p);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await fetchBlogs(1);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await fetchBlogs(page);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-gray-200 pb-12 mb-12 dark:border-gray-800">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1] dark:text-white">
          Ideas worth<br className="hidden sm:block" /> reading.
        </h1>
        <p className="mt-5 text-lg text-gray-400 max-w-md leading-relaxed dark:text-gray-500">
          Discover stories, perspectives, and expertise from writers on any topic.
        </p>
        <div className="mt-8">
          {user ? (
            <Link
              to="/write"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Write a post <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Start writing <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </section>

      {/* Section heading */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">Latest posts</h2>
      </div>

      {/* Blog grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-gray-400 text-sm dark:text-gray-500">No posts yet. Be the first to write.</p>
          <Link to="/write" className="mt-4 text-sm font-medium text-gray-900 hover:underline underline-offset-4 dark:text-white">
            Write a post →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {blogs.map((b) => (
            <article
              key={b._id}
              className="group rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:shadow-none"
            >
              <Link
                to={`/blog/${b._id}`}
                className="block text-lg font-semibold text-gray-900 group-hover:text-black leading-snug line-clamp-2 dark:text-gray-100 dark:group-hover:text-white"
              >
                {b.title}
              </Link>
              <p className="mt-2.5 text-sm text-gray-500 line-clamp-3 leading-relaxed dark:text-gray-400">
                {b.content}
              </p>
              <div className="mt-5 flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-semibold select-none dark:bg-gray-700">
                  {initials(b.authorId?.username)}
                </span>
                <span className="text-sm font-medium text-gray-700 truncate dark:text-gray-300">
                  {b.authorId?.username || "Unknown"}
                </span>
                <span className="text-gray-300 select-none dark:text-gray-700">·</span>
                <span className="text-xs text-gray-400 whitespace-nowrap dark:text-gray-500">{formatDate(b.createdAt)}</span>
                <span className="text-gray-300 select-none dark:text-gray-700">·</span>
                <span className="text-xs text-gray-400 whitespace-nowrap dark:text-gray-500">{readTime(b.content)} min read</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
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
