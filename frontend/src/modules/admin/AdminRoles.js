// Role & Permissions: updated default access permissions for Doctors and Receptionists.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../implementer/implementer.css";

const MODULES = ["Registration", "Clinical", "Lab", "Reports", "Admin", "Patient Records"];

function AdminRoles() {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Doctor",
      permissions: { Registration: true, Clinical: true, Lab: true, Reports: true, Admin: true, "Patient Records": true }
    },
    {
      id: 2,
      name: "Receptionist",
      permissions: { Registration: true, Clinical: false, Lab: false, Reports: false, Admin: false, "Patient Records": true }
    },
  ]);
  const [newRoleName, setNewRoleName] = useState("");

  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    const permissions = {};
    MODULES.forEach((m) => (permissions[m] = false));
    setRoles((prev) => [...prev, { id: Date.now(), name: newRoleName.trim(), permissions }]);
    setNewRoleName("");
  };

  const togglePermission = (roleId, module) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId ? { ...r, permissions: { ...r.permissions, [module]: !r.permissions[module] } } : r
      )
    );
  };

  return (
    <div className="content-area impl-page">
      <Link to="/admin" className="impl-back-link">
        <FaArrowLeft /> Back to Admin
      </Link>
      <h2>Role & Permissions</h2>
      <p className="section-subtitle">Manage access control policies by role</p>

      <div className="impl-section">
        <h3>Create Role</h3>
        <form onSubmit={handleCreateRole}>
          <div className="impl-form-row">
            <label>Role Name</label>
            <input type="text" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="e.g. Lab Technician" />
          </div>
          <button type="submit" className="impl-btn impl-btn-primary">Create Role</button>
        </form>
      </div>

      <div className="impl-section">
        <h3>Module Access by Role</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Role</th>
              {MODULES.map((m) => (
                <th key={m}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.name}</strong></td>
                {MODULES.map((m) => (
                  <td key={m} style={{ textAlign: "center" }}>
                    <label className="impl-toggle">
                      <input
                        type="checkbox"
                        checked={r.permissions[m] || false}
                        onChange={() => togglePermission(r.id, m)}
                      />
                      <span className={r.permissions[m] ? "text-success" : "text-danger"}>
                        {r.permissions[m] ? "Allowed" : "Blocked"}
                      </span>
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminRoles;
