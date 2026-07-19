import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";

export function PublicOnlyRoute() {
  const status = useAuthStore((state) => state.status);

  if (status === "loading") {
    return <div className="p-6 text-sm text-slate-600">Checking your session...</div>;
  }

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
