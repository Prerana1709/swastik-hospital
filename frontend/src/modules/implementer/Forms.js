import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

const FIELD_TYPES = ["Text", "Number", "Date", "Dropdown", "Checkbox", "Textarea"];
const DEPARTMENTS = ["OPD", "IPD", "Emergency", "General"];

function Forms() {
  const [forms, setForms] = useState([
    { id: 1, name: "OPD Consultation", department: "OPD", fields: ["Chief Complaint", "Diagnosis"] },
  ]);
  const [formName, setFormName] = useState("");
  const [department, setDepartment] = useState("OPD");
  const [fields, setFields] = useState([{ id: 1, label: "", type: "Text" }]);

  const addField = () => {
    setFields((prev) => [...prev, { id: Date.now(), label: "", type: "Text" }]);
  };

  const updateField = (id, key, value) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const removeField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddForm = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const fieldLabels = fields.map((f) => f.label || "Field").filter(Boolean);
    setForms((prev) => [...prev, { id: Date.now(), name: formName.trim(), department, fields: fieldLabels }]);
    setFormName("");
    setFields([{ id: Date.now(), label: "", type: "Text" }]);
  };

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Clinical Form Builder</h2>
      <p className="section-subtitle">Create dynamic forms and assign to department</p>

      <div className="impl-section">
        <h3>Create Form</h3>
        <form onSubmit={handleAddForm}>
          <div className="impl-form-row">
            <label>Form Name</label>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Form name" />
          </div>
          <div className="impl-form-row">
            <label>Assign to Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="impl-form-row">
            <label>Fields</label>
            {fields.map((f) => (
              <div key={f.id} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <input
                  type="text"
                  value={f.label}
                  onChange={(e) => updateField(f.id, "label", e.target.value)}
                  placeholder="Field label"
                  style={{ flex: 1, maxWidth: 200 }}
                />
                <select value={f.type} onChange={(e) => updateField(f.id, "type", e.target.value)} style={{ width: 120 }}>
                  {FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button type="button" className="impl-btn impl-btn-secondary" onClick={() => removeField(f.id)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="impl-btn impl-btn-secondary" onClick={addField}>
              Add Field
            </button>
          </div>
          <button type="submit" className="impl-btn impl-btn-primary">Create Form</button>
        </form>
      </div>

      <div className="impl-section">
        <h3>Forms</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Form Name</th>
              <th>Department</th>
              <th>Fields</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((f) => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.department}</td>
                <td>{Array.isArray(f.fields) ? f.fields.join(", ") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Forms;
