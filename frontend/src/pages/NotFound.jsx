import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-[7rem] font-black text-gray-100 leading-none select-none dark:text-gray-800">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-sm text-gray-500 max-w-xs dark:text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        Go home
      </Link>
    </div>
  );
}
