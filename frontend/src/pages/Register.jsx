import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/auth/register", { username, email, password });
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-500 dark:focus:ring-gray-800";

  return (
    <div className="mx-auto max-w-sm py-8 sm:py-14">
      {/* Brand */}
      <div className="text-center mb-10">
        <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white text-xl font-bold mb-5 dark:bg-gray-100 dark:text-gray-900">
          S
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Start sharing your ideas today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">Username</label>
          <input
            className={inputClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            required
            autoComplete="username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">Email</label>
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">Password</label>
          <input
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-gray-900 hover:underline underline-offset-4 dark:text-white">
          Sign in
        </Link>
      </p>
    </div>
  );
}
