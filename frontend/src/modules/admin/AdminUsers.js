// User Management: Restricted to specific hospital doctors and staff.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../implementer/implementer.css";

const ROLES = ["Doctor", "Receptionist", "Admin"];
const DOCTORS = ["Dr. P. M. Chougule", "Dr. Nikhil Chougule"];
const DEPARTMENTS = ["Psychiatry", "Front Office", "Administration"];

function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: "Dr. P. M. Chougule", email: "pmchougule@swastik.com", role: "Doctor", department: "Psychiatry", active: true },
    { id: 2, name: "Receptionist", email: "frontdesk@swastik.com", role: "Receptionist", department: "Front Office", active: true },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState(DOCTORS[0]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Doctor");
  const [department, setDepartment] = useState("Psychiatry");

  const resetForm = () => {
    setName(DOCTORS[0]);
    setEmail("");
    setRole("Doctor");
    setDepartment("Psychiatry");
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
      <p className="section-subtitle">Add/Edit Hospital Staff Users</p>

      <div className="impl-section">
        <h3>{editingId ? "Edit User" : "Add Authorized User"}</h3>
        <form onSubmit={editingId ? handleUpdate : handleAdd}>
          <div className="impl-form-row">
            <label>Staff Name</label>
            {role === "Doctor" ? (
              <select value={name} onChange={(e) => setName(e.target.value)}>
                {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            ) : (
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            )}
          </div>
          <div className="impl-form-row">
            <label>Work Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@swastik.com" />
          </div>
          <div className="impl-form-row">
            <label>Role</label>
            <select value={role} onChange={(e) => {
              setRole(e.target.value);
              if (e.target.value === "Doctor") setName(DOCTORS[0]);
            }}>
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
            {editingId ? "Update Staff member" : "Add Staff member"}
          </button>
          {editingId && (
            <button type="button" className="impl-btn impl-btn-secondary" onClick={resetForm}>Cancel</button>
          )}
        </form>
      </div>

      <div className="impl-section">
        <h3>Active System Users</h3>
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
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.department}</td>
                <td>
                  <span className={u.active ? "text-success" : "text-danger"}>
                    {u.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button type="button" className="impl-btn impl-btn-secondary" style={{ marginRight: 8 }} onClick={() => startEdit(u)}>Edit</button>
                  <label className="impl-toggle">
                    <input type="checkbox" checked={u.active} onChange={() => toggleActive(u.id)} />
                    {u.active ? "Enabled" : "Disabled"}
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
