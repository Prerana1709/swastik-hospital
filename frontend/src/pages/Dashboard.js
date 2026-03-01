import React from "react";
import { useNavigate } from "react-router-dom";
import { getStaffRole } from "../utils/staffAuth";
import "./Dashboard.css";

const SECTIONS = [
  {
    id: "receptionist",
    label: "Receptionist",
    path: "/receptionist",
    description: "Registration & front desk",
    allowedRoles: ["receptionist"],
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  },
  {
    id: "doctor",
    label: "Doctor",
    path: "/doctor",
    description: "Clinical & patient care",
    allowedRoles: ["doctor"],
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
  },
  {
    id: "lab",
    label: "Lab",
    path: "/lab",
    description: "Lab tests & results",
    allowedRoles: ["lab"],
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"></path><path d="M14 9.3V1.99"></path><path d="M8.5 2h7"></path><path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path><path d="M5.52 16h12.96"></path></svg>
  },
  {
    id: "admin",
    label: "Admin",
    path: "/admin",
    description: "System & user management",
    allowedRoles: ["admin"],
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
  },
  {
    id: "billing",
    label: "Billing",
    path: "/billing",
    description: "Bills & payments",
    allowedRoles: ["billing", "receptionist"],
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const role = getStaffRole();

  const handleSectionClick = (sectionId) => {
    const section = SECTIONS.find((s) => s.id === sectionId);
    if (!section || !section.allowedRoles.includes(role)) return;
    navigate(section.path);
  };

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">Select your section. You can only access the block for your role.</p>

        <div className="dashboard-blocks">
          {SECTIONS.map((section) => {
            const isEnabled = section.allowedRoles.includes(role);
            return (
              <button
                key={section.id}
                type="button"
                className={`dashboard-block ${isEnabled ? "dashboard-block-enabled" : "dashboard-block-disabled"}`}
                onClick={() => handleSectionClick(section.id)}
                disabled={!isEnabled}
                title={isEnabled ? `Open ${section.label}` : "Access restricted to your role"}
              >
                <div className="dashboard-block-icon">
                  {section.icon}
                </div>
                <span className="dashboard-block-label">{section.label}</span>
                <span className="dashboard-block-desc">{section.description}</span>
                {!isEnabled && <span className="dashboard-block-lock"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Locked</span>}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
