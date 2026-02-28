import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";
import "./doctor.css";

const DEFAULT_DOCTOR_NAME = "Dr. Psychiatrist";

function DoctorLayout() {
  const [doctorName] = useState(
    () => localStorage.getItem("swastik_doctor_name") || DEFAULT_DOCTOR_NAME
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("swastik_token");
    localStorage.removeItem("swastik_doctor_name");
  };

  return (
    <div className="doctor-layout">
      <DoctorSidebar
        doctorName={doctorName}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />
      <div className="doctor-main">
        <header className="doctor-header">
          <button
            type="button"
            className="doctor-header__menu"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className="doctor-header__menu-icon" />
            <span className="doctor-header__menu-icon" />
            <span className="doctor-header__menu-icon" />
          </button>
          <h1 className="doctor-header__title">Doctor Module</h1>
          <div className="doctor-header__right">
            <span className="doctor-header__name">{doctorName}</span>
            <button type="button" className="doctor-header__notify" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <button type="button" className="doctor-header__logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="doctor-content">
          <Outlet />
        </main>
      </div>
      <div
        className={`doctor-overlay ${sidebarOpen ? "doctor-overlay--visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
    </div>
  );
}

export default DoctorLayout;
