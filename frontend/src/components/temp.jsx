import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, accessToken, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-600">Checking permissions...</p>
      </div>
    );
  }

  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== "admin") {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-gray-600">403</p>
        <h1 className="mt-2 text-xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-gray-600">
          You don’t have permission to view this page.
        </p>
      </div>
    );
  }

  return children;
}
