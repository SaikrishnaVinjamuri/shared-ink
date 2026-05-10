import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/blogs/${id}`);
        const blog = res.data.blog;
        setTitle(blog.title || "");
        setContent(blog.content || "");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await api.post(`/api/blogs/update/${id}`, { title, content });
      toast.success("Post updated!");
      navigate("/profile");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update post";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !title && !content) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse">
        <div className="h-3.5 bg-gray-100 rounded w-12 mb-8 dark:bg-gray-800" />
        <div className="h-10 bg-gray-100 rounded-lg w-4/5 mb-6 dark:bg-gray-800" />
        <div className="border-t border-gray-200 pt-6 space-y-3 dark:border-gray-800">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-4 bg-gray-100 rounded dark:bg-gray-800 ${i % 4 === 3 ? "w-3/4" : "w-full"}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Top bar */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <Link to="/profile" className="text-sm text-gray-400 hover:text-gray-900 transition-colors dark:text-gray-500 dark:hover:text-gray-100">
            ← Back
          </Link>
          {wordCount > 0 && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
              {wordCount} {wordCount === 1 ? "word" : "words"} · {readTime} min read
            </p>
          )}
        </div>
        <button
          type="submit"
          form="edit-form"
          disabled={loading}
          className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </div>

      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form id="edit-form" onSubmit={handleSubmit} className="mt-8">
        <input
          className="w-full text-4xl font-extrabold text-gray-900 placeholder-gray-200 outline-none border-none bg-transparent leading-tight tracking-tight dark:text-white dark:placeholder-gray-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          required
        />
        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
          <textarea
            className="w-full min-h-[60vh] text-lg text-gray-700 placeholder-gray-300 outline-none border-none bg-transparent resize-none leading-[1.8] dark:text-gray-300 dark:placeholder-gray-600"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your story..."
            required
          />
        </div>
      </form>
    </div>
  );
}
