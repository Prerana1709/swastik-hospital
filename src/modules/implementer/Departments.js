// Department Management: add/edit, type, activate/deactivate. Local state only.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

const DEPT_TYPES = ["OPD", "IPD", "Emergency", "Support", "Admin"];

function Departments() {
  const [departments, setDepartments] = useState([
    { id: 1, name: "General Medicine", type: "OPD", active: true },
    { id: 2, name: "Cardiology", type: "OPD", active: true },
    { id: 3, name: "ICU", type: "IPD", active: true },
  ]);
  const [name, setName] = useState("");
  const [type, setType] = useState("OPD");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setDepartments((prev) => [...prev, { id: Date.now(), name: name.trim(), type, active: true }]);
    setName("");
  };

  const toggleActive = (id) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));
  };

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Department Management</h2>
      <p className="section-subtitle">Add, edit, and activate or deactivate departments</p>

      <div className="impl-section">
        <h3>Add Department</h3>
        <form onSubmit={handleAdd}>
          <div className="impl-form-row">
            <label>Department Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          </div>
          <div className="impl-form-row">
            <label>Department Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {DEPT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="impl-btn impl-btn-primary">Add Department</button>
        </form>
      </div>

      <div className="impl-section">
        <h3>Departments</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{d.type}</td>
                <td>{d.active ? "Active" : "Inactive"}</td>
                <td>
                  <label className="impl-toggle">
                    <input type="checkbox" checked={d.active} onChange={() => toggleActive(d.id)} />
                    {d.active ? "Deactivate" : "Activate"}
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

export default Departments;
