import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, refreshClient } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);

  // On page reload: try refresh -> then get /users/me
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoadingAuth(true);

        // 1) get new access token using refresh cookie
        const refreshRes = await refreshClient.post("/api/auth/refresh-token");
        const newAccessToken = refreshRes.data.accessToken;

        setAccessToken(newAccessToken);

        // 2) get current user profile
        const meRes = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });

        setUser(meRes.data.user);
      } catch (err) {
        // Not logged in or refresh expired -> stay logged out
        setUser(null);
        setAccessToken("");
      } finally {
        setLoadingAuth(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
  // attach token to every request
  const reqInterceptor = api.interceptors.request.use((config) => {
    config.headers = config.headers || {}
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // auto-refresh on token expiry and retry once
  const resInterceptor = api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if(!originalRequest) return Promise.reject(error)

      if (originalRequest.url?.includes("/api/auth/refresh-token")) {
        return Promise.reject(error);
      }

      // If token expired -> backend commonly returns 401 or 403
      const status = error?.response?.status;

      // prevent infinite loop
      if ((status === 401 || status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshRes = await api.post("/api/auth/refresh-token");
          const newAccessToken = refreshRes.data.accessToken;

          setAccessToken(newAccessToken);

          // retry original request with new token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // refresh failed -> log out
          setUser(null);
          setAccessToken("");
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(error);
    }
  );

  return () => {
    api.interceptors.request.eject(reqInterceptor);
    api.interceptors.response.eject(resInterceptor);
  };
}, [accessToken]);


  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });

    setAccessToken(res.data.accessToken);
    setUser(res.data.user);

    return res.data;
  };

  const logout = async () => {
    try {
      // if you have logout endpoint, call it (optional but recommended)
      await api.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (e) {
      // ignore errors; still clear client state
    } finally {
      setUser(null);
      setAccessToken("");
    }
  };

  const value = useMemo(
    () => ({ user, accessToken, loadingAuth, login, logout }),
    [user, accessToken, loadingAuth, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
