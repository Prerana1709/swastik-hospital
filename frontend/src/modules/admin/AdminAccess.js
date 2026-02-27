// Access Control: active sessions for Swastik Hospital authorized personnel.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../implementer/implementer.css";

const AUTH_SESSIONS = [
  { id: 1, user: "Dr. P. M. Chougule", role: "Super Admin", ip: "192.168.1.10", lastActive: "Live" },
  { id: 2, user: "Receptionist", role: "Receptionist", ip: "192.168.1.12", lastActive: "Active" },
];

function AdminAccess() {
  const [sessions, setSessions] = useState(AUTH_SESSIONS);

  const forceLogout = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="content-area impl-page">
      <Link to="/admin" className="impl-back-link">
        <FaArrowLeft /> Back to Admin
      </Link>
      <h2>Access Control</h2>
      <p className="section-subtitle">Active Authorized Sessions</p>

      <div className="impl-section">
        <h3>Active Sessions</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Authorized User</th>
              <th>Role</th>
              <th>IP Address</th>
              <th>Status</th>
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
                  <td><strong>{s.user}</strong></td>
                  <td>{s.role}</td>
                  <td>{s.ip}</td>
                  <td><span style={{ color: 'green' }}>{s.lastActive}</span></td>
                  <td>
                    <button type="button" className="impl-btn impl-btn-secondary" onClick={() => forceLogout(s.id)}>
                      End Session
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
