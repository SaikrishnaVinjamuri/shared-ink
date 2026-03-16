import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function Home() {
  const toast = useToast();

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const fetchBlogs = async (p) => {
    const res = await api.get(`/api/blogs?page=${p}&limit=5`);
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Latest Posts</h1>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-gray-600">Loading...</p>
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-600">No blogs yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((b) => (
              <article
                key={b._id}
                className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <Link
                  to={`/blog/${b._id}`}
                  className="text-lg font-semibold hover:underline block"
                >
                  {b.title}
                </Link>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {b.content}
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  by <b>{b.authorId?.username || "Unknown"}</b>
                  {b.createdAt ? ` • ${new Date(b.createdAt).toLocaleDateString()}` : ""}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination - single row */}
        <div className="mt-6 flex items-center justify-center gap-3">
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
  );
}
