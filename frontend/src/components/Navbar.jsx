import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">SI</span>
            <span className="text-lg font-semibold">Shared Ink</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3 text-sm">
            <Link to="/" className="rounded-lg px-3 py-2 hover:bg-gray-100">Home</Link>

            {!user ? (
              <>
                <Link to="/login" className="rounded-lg px-3 py-2 hover:bg-gray-100">Login</Link>
                <Link to="/register" className="rounded-lg bg-black px-3 py-2 text-white">Register</Link>
              </>
            ) : (
              <>
                <Link to="/write" className="rounded-lg px-3 py-2 hover:bg-gray-100">Write</Link>
                <Link to="/profile" className="rounded-lg px-3 py-2 hover:bg-gray-100">Profile</Link>
                {user.role === "admin" && <Link to="/admin/users" className="rounded-lg px-3 py-2 hover:bg-gray-100">Users</Link>}
                <button
                  onClick={async () => { await onLogout(); navigate("/login"); }}
                  className="rounded-lg border px-3 py-2 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                {open ? (
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                ) : (
                  <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd"/>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {open && (
          <div className="md:hidden mt-2 pb-4">
            <div className="flex flex-col gap-2">
              <Link to="/" className="rounded-lg px-3 py-2 hover:bg-gray-100">Home</Link>

              {!user ? (
                <>
                  <Link to="/login" className="rounded-lg px-3 py-2 hover:bg-gray-100">Login</Link>
                  <Link to="/register" className="rounded-lg bg-black px-3 py-2 text-white text-center">Register</Link>
                </>
              ) : (
                <>
                  <Link to="/write" className="rounded-lg px-3 py-2 hover:bg-gray-100">Write</Link>
                  <Link to="/profile" className="rounded-lg px-3 py-2 hover:bg-gray-100">Profile</Link>
                  {user.role === "admin" && <Link to="/admin/users" className="rounded-lg px-3 py-2 hover:bg-gray-100">Users</Link>}
                  <button
                    onClick={async () => { setOpen(false); await onLogout(); navigate("/login"); }}
                    className="rounded-lg border px-3 py-2 hover:bg-gray-50 text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
