import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  );
}

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setOpen(false)}
        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
          active
            ? "text-gray-900 font-medium dark:text-white"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
        }`}
      >
        {label}
      </Link>
    );
  };

  const ThemeToggle = ({ className = "" }) => (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`inline-flex items-center justify-center rounded-md p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-500 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/90">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-bold tracking-tight select-none dark:bg-gray-100 dark:text-gray-900">
              S
            </span>
            <span className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">Shared Ink</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLink("/", "Home")}

            {!user ? (
              <>
                {navLink("/login", "Sign in")}
                <Link
                  to="/register"
                  className="ml-2 px-4 py-1.5 rounded-full bg-gray-900 text-sm font-medium text-white hover:bg-gray-700 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  Get started
                </Link>
              </>
            ) : (
              <>
                {navLink("/write", "Write")}
                {navLink("/profile", "Profile")}
                {user.role === "admin" && navLink("/admin/users", "Admin")}
                <button
                  onClick={async () => { await onLogout(); navigate("/login"); }}
                  className="ml-1 px-3 py-1.5 rounded-md text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                >
                  Sign out
                </button>
              </>
            )}

            <ThemeToggle className="ml-1" />
          </nav>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {open ? (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {open && (
          <div className="md:hidden border-t border-gray-200 py-3 dark:border-gray-800">
            <div className="flex flex-col gap-1">
              {navLink("/", "Home")}

              {!user ? (
                <>
                  {navLink("/login", "Sign in")}
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="mt-1 w-full rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-medium text-white text-center hover:bg-gray-700 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                  >
                    Get started
                  </Link>
                </>
              ) : (
                <>
                  {navLink("/write", "Write")}
                  {navLink("/profile", "Profile")}
                  {user.role === "admin" && navLink("/admin/users", "Admin")}
                  <button
                    onClick={async () => { setOpen(false); await onLogout(); navigate("/login"); }}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 text-left transition-colors dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  >
                    Sign out
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
