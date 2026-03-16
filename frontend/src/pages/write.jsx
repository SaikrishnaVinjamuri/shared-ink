import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";


export default function Write() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!accessToken) {
        setError("Please login first.");
        return;
      }

      const res = await api.post(
        "/api/blogs/new-blog",
        { title, content }
      );

      setSuccess(res.data.message || "Blog created!");
      setTitle("");
      setContent("");
      toast.success("Blog created!");

      // go to profile after creating
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create blog");
      toast.error(err?.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Write a Post</h1>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title..."
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Content</label>
          <textarea
            className="mt-1 min-h-[180px] w-full rounded-md border px-3 py-2 outline-none focus:ring"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}
