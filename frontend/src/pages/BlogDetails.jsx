import { useEffect, useState } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

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

  const canDelete =
    !!accessToken && (canEdit || user?.role === "admin");

  const handleDelete = async () => {
    const ok = window.confirm("Delete this blog?");
    if (!ok) return;

    try {
      setLoading(true);
      await api.delete(`/api/blogs/delete/${id}`);
      toast.success("Blog deleted");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !blog) return <p className="p-6 text-gray-600">Loading...</p>;
  if (!blog) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link to={backTo} className="text-sm underline text-gray-700">
          ← Back
        </Link>


        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && (
              <button
                onClick={() => navigate(`/edit/${id}`)}
                className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                disabled={loading}
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
                disabled={loading}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{blog.title}</h1>

        <div className="mt-2 text-sm text-gray-600">
          by <b>{blog.authorId?.username || "Unknown"}</b>
          {blog.createdAt ? ` • ${new Date(blog.createdAt).toLocaleDateString()}` : ""}
        </div>

        <div className="mt-6 whitespace-pre-wrap text-gray-800">{blog.content}</div>
      </div>
    </div>
  );
}
