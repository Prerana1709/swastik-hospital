// Implementer main dashboard: configuration cards routing to sub-modules.
import React from "react";
import { Link } from "react-router-dom";
import "./implementer.css";

const CONFIG_CARDS = [
  { label: "Department Management", path: "/implementer/departments" },
  { label: "User & Role Configuration", path: "/implementer/users" },
  { label: "Lab Test Configuration", path: "/implementer/lab-config" },
  { label: "Billing Configuration", path: "/implementer/billing-config" },
  { label: "Clinical Form Builder", path: "/implementer/forms" },
  { label: "Workflow Settings", path: "/implementer/workflow" },
  { label: "System Settings", path: "/implementer/settings" },
];

function ImplementerDashboard() {
  return (
    <div className="content-area impl-page">
      <h2>System Configuration</h2>
      <p className="section-subtitle">Configure departments, users, lab, billing, forms, and workflow</p>

      <div className="impl-config-grid">
        {CONFIG_CARDS.map((card) => (
          <Link key={card.path} to={card.path} className="impl-config-card">
            {card.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ImplementerDashboard;
