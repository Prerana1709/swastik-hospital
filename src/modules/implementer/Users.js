import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

const ROLES = ["Admin", "Doctor", "Nurse", "Lab Technician", "Receptionist", "Billing"];
const PERMISSIONS = ["View Patients", "Edit Patients", "Order Lab", "View Reports", "Billing", "Manage Users"];

function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: "Dr. Sharma", role: "Doctor", department: "Cardiology", permissions: ["View Patients", "Edit Patients", "Order Lab"] },
  ]);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("Doctor");
  const [department, setDepartment] = useState("Cardiology");
  const [perms, setPerms] = useState([]);

  const togglePerm = (p) => {
    setPerms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setUsers((prev) => [...prev, { id: Date.now(), name: userName.trim(), role, department, permissions: [...perms] }]);
    setUserName("");
    setPerms([]);
  };

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>User & Role Configuration</h2>
      <p className="section-subtitle">Create users and assign roles, departments, and permissions</p>

      <div className="impl-section">
        <h3>Create User</h3>
        <form onSubmit={handleAdd}>
          <div className="impl-form-row">
            <label>User Name</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Full name" />
          </div>
          <div className="impl-form-row">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="impl-form-row">
            <label>Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Lab">Lab</option>
              <option value="Billing">Billing</option>
            </select>
          </div>
          <div className="impl-form-row">
            <label>Permissions</label>
            <div className="impl-check-list">
              {PERMISSIONS.map((p) => (
                <label key={p}>
                  <input type="checkbox" checked={perms.includes(p)} onChange={() => togglePerm(p)} />
                  {p}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="impl-btn impl-btn-primary">Create User</button>
        </form>
      </div>

      <div className="impl-section">
        <h3>Users</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.role}</td>
                <td>{u.department}</td>
                <td>{u.permissions.join(", ") || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
