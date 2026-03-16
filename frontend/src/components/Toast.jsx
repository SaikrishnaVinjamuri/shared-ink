import { useToast } from "../context/ToastContext";

export default function Toast() {
  const { toast } = useToast();
  if (!toast) return null;

const base =
  "fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-md border px-4 py-3 text-sm shadow sm:left-auto sm:right-6 sm:translate-x-0";



  const styles =
    toast.type === "success"
      ? "bg-green-50 border-green-200 text-green-800"
      : toast.type === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-gray-50 border-gray-200 text-gray-800";

  return <div className={`${base} ${styles}`}>{toast.message}</div>;
}
