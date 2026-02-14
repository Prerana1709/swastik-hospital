// Access Control: active sessions (mock), force logout (mock). Local state only.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../implementer/implementer.css";

const MOCK_SESSIONS = [
  { id: 1, user: "Dr. Rajesh Kumar", role: "Consultant", ip: "192.168.1.10", lastActive: "2025-02-06 09:15" },
  { id: 2, user: "Priya Nair", role: "Nurse", ip: "192.168.1.25", lastActive: "2025-02-06 09:12" },
  { id: 3, user: "Vikram Singh", role: "Lab Technician", ip: "192.168.1.30", lastActive: "2025-02-06 08:55" },
];

function AdminAccess() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  const forceLogout = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="content-area impl-page">
      <Link to="/admin" className="impl-back-link">
        <FaArrowLeft /> Back to Admin
      </Link>
      <h2>Access Control</h2>
      <p className="section-subtitle">Active sessions (mock). Force logout ends session in this list only.</p>

      <div className="impl-section">
        <h3>Active Sessions</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>IP Address</th>
              <th>Last Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "#666" }}>No active sessions</td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr key={s.id}>
                  <td>{s.user}</td>
                  <td>{s.role}</td>
                  <td>{s.ip}</td>
                  <td>{s.lastActive}</td>
                  <td>
                    <button type="button" className="impl-btn impl-btn-secondary" onClick={() => forceLogout(s.id)}>
                      Force Logout
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAccess;
