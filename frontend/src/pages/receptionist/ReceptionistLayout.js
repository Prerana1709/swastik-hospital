import React from "react";
import { Outlet, Navigate, useNavigate, NavLink } from "react-router-dom";
import { getStaffRole } from "../../utils/staffAuth";
import "./ReceptionistLayout.css";

const SIDEBAR_ITEMS = [
  { path: "/receptionist", end: true, label: "Dashboard" },
  { path: "/receptionist/appointments", label: "Appointments" },
  {
    path: "/receptionist/patients",
    label: "Patients",
    children: [
      { path: "/receptionist/patients/register", label: "Register New Patient" },
      { path: "/receptionist/patients", end: true, label: "Patient List" },
      { path: "/receptionist/patients/search", label: "Search UHID" },
    ],
  },
  { path: "/receptionist/admissions", label: "Admissions" },
  { path: "/receptionist/billing", label: "Billing" },
  { path: "/receptionist/notifications", label: "Notifications" },
];

function ReceptionistLayout() {
  const navigate = useNavigate();
  const role = getStaffRole();

  if (role !== "receptionist") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="recep-layout">
      <aside className="recep-sidebar">
        <div className="recep-sidebar-header">
          <span className="recep-sidebar-title">Reception</span>
        </div>
        <nav className="recep-sidebar-nav">
          <NavLink to="/receptionist" end className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
            Dashboard
          </NavLink>
          <NavLink to="/receptionist/appointments" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
            Appointments
          </NavLink>
          <div className="recep-nav-group">
            <span className="recep-nav-group-label">Patients</span>
            <NavLink to="/receptionist/patients/register" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
              Register New Patient
            </NavLink>
            <NavLink to="/receptionist/patients" end className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
              Patient List
            </NavLink>
            <NavLink to="/receptionist/patients/search" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
              Search UHID
            </NavLink>
          </div>
          <NavLink to="/receptionist/admissions" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
            Admissions
          </NavLink>
          <NavLink to="/receptionist/billing" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
            Billing
          </NavLink>
          <NavLink to="/receptionist/notifications" className={({ isActive }) => (isActive ? "recep-nav-item active" : "recep-nav-item")}>
            Notifications
          </NavLink>
        </nav>
      </aside>
      <div className="recep-main">
        <Outlet />
      </div>
    </div>
  );
}

export default ReceptionistLayout;
