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

  // load existing blog
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
        setError(err?.response?.data?.message || "Failed to load blog");
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
      toast.success("Blog updated!");

      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update blog");
      toast.error(err?.response?.data?.message || "Failed to update blog");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <Link to="/profile" className="text-sm underline text-gray-700">
          ← Back
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !title && !content ? (
        <p className="text-sm text-gray-600">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea
              className="mt-1 min-h-[200px] w-full rounded-md border px-3 py-2 outline-none focus:ring"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}
