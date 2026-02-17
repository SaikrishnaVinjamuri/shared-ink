import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-600">404</p>
        <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-gray-600">
          The page you’re looking for doesn’t exist (or was moved).
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
          >
            Go Home
          </Link>
          <Link
            to="/profile"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
