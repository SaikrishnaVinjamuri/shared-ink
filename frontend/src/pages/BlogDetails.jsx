import { useEffect, useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const readTime = (text) => {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const initials = (name) => (name || "?").charAt(0).toUpperCase();

function SkeletonDetail() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse">
      <div className="h-3.5 bg-gray-100 rounded w-16 mb-10 dark:bg-gray-800" />
      <div className="space-y-3">
        <div className="h-9 bg-gray-100 rounded-lg w-5/6 dark:bg-gray-800" />
        <div className="h-9 bg-gray-100 rounded-lg w-3/4 dark:bg-gray-800" />
      </div>
      <div className="mt-6 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800" />
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-100 rounded w-24 dark:bg-gray-800" />
          <div className="h-3 bg-gray-100 rounded w-36 dark:bg-gray-800" />
        </div>
      </div>
      <div className="mt-10 space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`h-4 bg-gray-100 rounded dark:bg-gray-800 ${i % 5 === 4 ? "w-4/5" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const backTo = location.state?.from || "/";

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBlog = async () => {
    const res = await api.get(`/api/blogs/${id}`);
    setBlog(res.data.blog);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await fetchBlog();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const canEdit =
    !!accessToken &&
    blog?.authorId?._id &&
    (user?.userId === blog.authorId._id || user?._id === blog.authorId._id);

  const canDelete = !!accessToken && (canEdit || user?.role === "admin");

  const handleDelete = async () => {
    const ok = window.confirm("Delete this post?");
    if (!ok) return;
    try {
      setLoading(true);
      await api.delete(`/api/blogs/delete/${id}`);
      toast.success("Post deleted");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !blog) return <SkeletonDetail />;
  if (!blog) return null;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Top bar */}
      <div className="mb-10 flex items-center justify-between">
        <Link
          to={backTo}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 transition-colors dark:text-gray-500 dark:hover:text-gray-100"
        >
          ← Back
        </Link>

        {(canEdit || canDelete) && (
          <div className="flex items-center gap-3">
            {canEdit && (
              <button
                onClick={() => navigate(`/edit/${id}`)}
                disabled={loading}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-40 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-sm text-red-500 hover:text-red-700 transition-colors disabled:opacity-40 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Article */}
      <article>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-tight dark:text-white">
          {blog.title}
        </h1>

        {/* Author + meta */}
        <div className="mt-7 flex items-center gap-3 pb-8 border-b border-gray-200 dark:border-gray-800">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold select-none dark:bg-gray-700">
            {initials(blog.authorId?.username)}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {blog.authorId?.username || "Unknown"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 dark:text-gray-500">
              {blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""}
              {" · "}
              {readTime(blog.content)} min read
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-9 text-gray-700 text-[17px] leading-[1.85] whitespace-pre-wrap dark:text-gray-300">
          {blog.content}
        </div>
      </article>
    </div>
  );
}
