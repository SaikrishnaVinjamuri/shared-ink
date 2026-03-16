import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import EditBlog from "./pages/EditBlog";
import AdminUsers from "./pages/AdminUsers";
import AdminUserBlogs from "./pages/AdminUserBlogs";
import Write from "./pages/write";

import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, logout, loadingAuth } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar user={user} onLogout={logout} />

        <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
          {loadingAuth ? (
            <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected (logged in) */}
                <Route
                  path="/write"
                  element={
                    <ProtectedRoute>
                      <Write />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditBlog />
                    </ProtectedRoute>
                  }
                />

                {/* Admin only */}
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users/:userId"
                  element={
                    <AdminRoute>
                      <AdminUserBlogs />
                    </AdminRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}
