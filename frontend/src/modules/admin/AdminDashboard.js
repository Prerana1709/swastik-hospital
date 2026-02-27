// Admin dashboard: cards linking to User Management, Roles, Staff, Logs, Access.
import React from "react";
import { Link } from "react-router-dom";
import "../implementer/implementer.css";

const ADMIN_CARDS = [
  { label: "User Management", path: "/admin/users" },
  { label: "Role & Permissions", path: "/admin/roles" },
  { label: "Staff Directory", path: "/admin/staff" },
  { label: "Activity Logs", path: "/admin/logs" },
  { label: "Access Control", path: "/admin/access" },
];

function AdminDashboard() {
  return (
    <div className="content-area impl-page">
      <h2>Admin Dashboard</h2>
      <p className="section-subtitle">User management, roles, staff directory, activity logs, and access control</p>

      <div className="impl-config-grid">
        {ADMIN_CARDS.map((card) => (
          <Link key={card.path} to={card.path} className="impl-config-card">
            {card.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
