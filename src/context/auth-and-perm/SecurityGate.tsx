// SecurityGate.tsx
import { Navigate, Outlet } from "react-router-dom";

export function SecurityGate() {
  const ok = localStorage.getItem("security_ok") === "1";

  if (!ok) return <Navigate to="/security" replace />;

  return <Outlet />;
}
