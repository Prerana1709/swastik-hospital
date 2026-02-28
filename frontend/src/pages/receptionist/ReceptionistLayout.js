import React from "react";
import { Outlet, Navigate, useNavigate, NavLink } from "react-router-dom";
import { FiHome, FiCalendar, FiUsers, FiPlusCircle, FiSearch, FiActivity, FiCreditCard, FiBell, FiLogOut } from 'react-icons/fi';
import { getStaffRole } from "../../utils/staffAuth";
import "./ReceptionistLayout.css";

function ReceptionistLayout() {
  const navigate = useNavigate();
  const role = getStaffRole();

  if (role !== "receptionist") {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("staff_token");
    localStorage.removeItem("staff_role");
    navigate("/login");
  };

  return (
    <div className="recep-layout">
      <aside className="recep-sidebar">
        <div className="recep-sidebar-header">
          <span className="recep-sidebar-title">Medical Reception</span>
        </div>

        <nav className="recep-sidebar-nav">
          <NavLink to="/receptionist" end className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
            <FiHome /> Dashboard
          </NavLink>

          <NavLink to="/receptionist/appointments" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
            <FiCalendar /> Appointments
          </NavLink>

          <div className="recep-nav-group">
            <span className="recep-nav-group-label">Patients</span>
            <NavLink to="/receptionist/patients/register" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
              <FiPlusCircle /> Register New Patient
            </NavLink>
            <NavLink to="/receptionist/patients" end className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
              <FiUsers /> Patient List
            </NavLink>
            <NavLink to="/receptionist/patients/search" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
              <FiSearch /> Search UHID
            </NavLink>
          </div>

          <NavLink to="/receptionist/admissions" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
            <FiActivity /> Admissions
          </NavLink>

          <NavLink to="/receptionist/billing" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
            <FiCreditCard /> Billing
          </NavLink>

          <NavLink to="/receptionist/notifications" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
            <FiBell /> Notifications
          </NavLink>
        </nav>

        <button className="recep-logout-btn" onClick={handleLogout}>
          <FiLogOut /> Sign Out
        </button>
      </aside>

      <main className="recep-main">
        <Outlet />
      </main>
    </div>
  );
}

export default ReceptionistLayout;
