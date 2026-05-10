import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

function AppContent() {
  const { user, logout, loadingAuth } = useAuth();
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  const routeTree = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/write" element={<ProtectedRoute><Write /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/edit/:id" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/users/:userId" element={<AdminRoute><AdminUserBlogs /></AdminRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar user={user} onLogout={logout} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {!isAuthPage && loadingAuth ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full bg-gray-200 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          routeTree
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
