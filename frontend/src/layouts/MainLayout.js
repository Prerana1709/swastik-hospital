// MainLayout: wrapper for authenticated pages. Redirects to login if no token.
import { Outlet, Navigate } from "react-router-dom";

function MainLayout() {
  const token = localStorage.getItem("swastik_token");
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default MainLayout;
