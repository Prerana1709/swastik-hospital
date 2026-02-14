// User Management: add user, edit user, assign role, assign department, activate/deactivate. Local state only.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../implementer/implementer.css";

const ROLES = ["Admin", "Doctor", "Nurse", "Lab Technician", "Receptionist", "Billing"];
const DEPARTMENTS = ["General Medicine", "Cardiology", "Lab", "Billing", "Emergency", "ICU"];

function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: "Dr. Sharma", email: "sharma@hospital.com", role: "Doctor", department: "Cardiology", active: true },
    { id: 2, name: "Priya Nair", email: "priya@hospital.com", role: "Nurse", department: "General Medicine", active: true },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Doctor");
  const [department, setDepartment] = useState("General Medicine");

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("Doctor");
    setDepartment("General Medicine");
    setEditingId(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setUsers((prev) => [...prev, { id: Date.now(), name: name.trim(), email: email.trim(), role, department, active: true }]);
    resetForm();
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
    setDepartment(u.department);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingId || !name.trim() || !email.trim()) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingId ? { ...u, name: name.trim(), email: email.trim(), role, department } : u
      )
    );
    resetForm();
  };

  const toggleActive = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  };

  return (
    <div className="content-area impl-page">
      <Link to="/admin" className="impl-back-link">
        <FaArrowLeft /> Back to Admin
      </Link>
      <h2>User Management</h2>
      <p className="section-subtitle">Add, edit users; assign role and department; activate or deactivate</p>

      <div className="impl-section">
        <h3>{editingId ? "Edit User" : "Add User"}</h3>
        <form onSubmit={editingId ? handleUpdate : handleAdd}>
          <div className="impl-form-row">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          </div>
          <div className="impl-form-row">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@hospital.com" />
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
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="impl-btn impl-btn-primary">
            {editingId ? "Update User" : "Add User"}
          </button>
          {editingId && (
            <button type="button" className="impl-btn impl-btn-secondary" onClick={resetForm}>Cancel</button>
          )}
        </form>
      </div>

      <div className="impl-section">
        <h3>Users</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.department}</td>
                <td>{u.active ? "Active" : "Inactive"}</td>
                <td>
                  <button type="button" className="impl-btn impl-btn-secondary" style={{ marginRight: 8 }} onClick={() => startEdit(u)}>Edit</button>
                  <label className="impl-toggle">
                    <input type="checkbox" checked={u.active} onChange={() => toggleActive(u.id)} />
                    {u.active ? "Deactivate" : "Activate"}
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
