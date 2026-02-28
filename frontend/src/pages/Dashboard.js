import React from "react";
import { useNavigate } from "react-router-dom";
import { getStaffRole } from "../utils/staffAuth";
import "./Dashboard.css";

const SECTIONS = [
  { id: "receptionist", label: "Receptionist", path: "/receptionist", description: "Registration & front desk", allowedRoles: ["receptionist"] },
  { id: "doctor", label: "Doctor", path: "/doctor", description: "Clinical & patient care", allowedRoles: ["doctor"] },
  { id: "lab", label: "Lab", path: "/lab", description: "Lab tests & results", allowedRoles: ["lab"] },
  { id: "admin", label: "Admin", path: "/admin", description: "System & user management", allowedRoles: ["admin"] },
  { id: "billing", label: "Billing", path: "/billing", description: "Bills & payments", allowedRoles: ["billing"] },
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
                <span className="dashboard-block-label">{section.label}</span>
                <span className="dashboard-block-desc">{section.description}</span>
                {!isEnabled && <span className="dashboard-block-lock">Locked</span>}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
