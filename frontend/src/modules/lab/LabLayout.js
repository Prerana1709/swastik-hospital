// Lab module layout: same header, sidebar, footer as Dashboard. Content via Outlet.
import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FaUserPlus,
  FaStethoscope,
  FaChartBar,
  FaCogs,
  FaFlask,
  FaUserShield,
  FaFileMedical,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "../dashboard/Dashboard.css";
import swastikLogo from "../../assets/swastiklogo.png";

const menuItems = [
  { id: "registration", label: "Registration", path: "/dashboard", icon: <FaUserPlus /> },
  { id: "clinical", label: "Clinical", path: "/clinical", icon: <FaStethoscope /> },
  { id: "reports", label: "Reports", path: "/reports", icon: <FaChartBar /> },
  { id: "implementer", label: "Psychiatric Config", path: "/implementer", icon: <FaCogs /> },
  { id: "lab", label: "Psychiatric Lab", path: "/lab", icon: <FaFlask /> },
  { id: "admin", label: "Admin", path: "/admin", icon: <FaUserShield /> },
  { id: "patient-docs", label: "Psychiatric Records", path: "/patient-documents", icon: <FaFileMedical /> },
  { id: "appointment", label: "Appointment Scheduling", path: "/appointments", icon: <FaCalendarAlt /> },
];

function LabLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} type="button" aria-label="Toggle menu">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="header-left">
          <div className="logo-title-container">
            <img src={swastikLogo} alt="Swastik Hospital" className="header-logo" />
            <div className="header-text">
              <h1>Swastik Hospital</h1>
              <p className="hospital-tagline">Digital Healthcare Management System</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">Dr. P. M. Chougule</span>
            <span className="user-role">Consulting Psychiatrist</span>
          </div>
          <button className="logout-btn" type="button">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.id !== "lab"}
                className={({ isActive }) => "sidebar-item " + (isActive ? "active" : "")}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
          {sidebarOpen && (
            <div className="sidebar-footer">
              <div className="hospital-info">
                <h4>Swastik Hospital</h4>
                <p>24/7 Emergency Services</p>
                <p>📞 1800-123-4567</p>
              </div>
            </div>
          )}
        </aside>

        <main className={"main-content " + (!sidebarOpen ? "expanded" : "")}>
          <div className="content-header">
            <div className="content-header-text">
              <h2>
                <span className="content-icon">
                  <FaFlask />
                </span>
                Psychiatric Laboratory
              </h2>
              <p className="content-header-subtitle">Swastik Hospital · Medication &amp; metabolic monitoring</p>
            </div>
            <div className="date-display">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>

          <Outlet />

          <footer className="dashboard-footer">
            <div className="footer-content">
              <div className="footer-left">
                <p className="copyright">
                  © {new Date().getFullYear()} Swastik Hospital. All rights reserved. | Developed and managed by ORELSE Private Limited.
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default LabLayout;
