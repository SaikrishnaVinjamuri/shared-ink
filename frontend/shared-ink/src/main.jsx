import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Toast from "./components/Toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <AuthProvider>
      <Toast />
      <App />
    </AuthProvider>
  </ToastProvider>
);
