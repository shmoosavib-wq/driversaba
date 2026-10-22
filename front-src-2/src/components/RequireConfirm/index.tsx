import { Navigate, Outlet } from "react-router-dom";

export default function RequireConfirm() {
  const isConfirm = localStorage.getItem("Phone");

  if (!isConfirm) return <Navigate to="/login" replace />;
  return <Outlet />;
}
