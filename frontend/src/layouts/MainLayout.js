// MainLayout: wrapper for authenticated pages. Header (logo + role + logout), content, footer.
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { getStaffRole, clearStaffSession } from "../utils/staffAuth";
import swastikLogo from "../assets/swastiklogo.png";
import "./MainLayout.css";

function MainLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("swastik_token");
  if (!token) return <Navigate to="/login" replace />;

  const role = getStaffRole();

  const handleLogout = () => {
    clearStaffSession();
    navigate("/login");
  };

  return (
    <div className="main-layout">
      <header className="main-layout-header">
        <div className="main-layout-header-inner">
          <div className="main-layout-logo">
            <img src={swastikLogo} alt="Swastik Hospital" />
            <span>Swastik Hospital</span>
          </div>
          <div className="main-layout-header-right">
            <span className="main-layout-role-badge">{role}</span>
            <button type="button" className="main-layout-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-layout-content">
        <Outlet />
      </main>

      <footer className="main-layout-footer">
        <div className="main-layout-footer-content">
          <p className="main-layout-footer-copyright">
            © {new Date().getFullYear()} Swastik Hospital. All rights reserved. | Developed and managed by ORELSE Private Limited.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
