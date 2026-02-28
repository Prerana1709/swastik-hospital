import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const MENU_ITEMS = [
  { path: "", label: "Dashboard" },
  { path: "appointments", label: "Today's Appointments" },
  { path: "patients", label: "Patient List" },
  { path: "consultation", label: "New Consultation" },
  { path: "assessments", label: "Assessments" },
  { path: "prescriptions", label: "Prescriptions" },
  { path: "reports", label: "Reports" },
  { path: "settings", label: "Settings" },
];

function DoctorSidebar({ doctorName, onLogout, sidebarOpen, onCloseSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    navigate("/login");
  };

  return (
    <aside
      className={`doctor-sidebar ${sidebarOpen ? "doctor-sidebar--open" : ""}`}
    >
      <div className="doctor-sidebar__brand">
        <span className="doctor-sidebar__title">Swastik Psychiatric Hospital</span>
        <span className="doctor-sidebar__sub">Doctor Module</span>
      </div>
      <nav className="doctor-sidebar__nav">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.path || "dashboard"}
            to={item.path ? `/doctor/${item.path}` : "/doctor"}
            end={!item.path}
            className={({ isActive }) =>
              `doctor-sidebar__link ${isActive ? "doctor-sidebar__link--active" : ""}`
            }
            onClick={onCloseSidebar}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default DoctorSidebar;
