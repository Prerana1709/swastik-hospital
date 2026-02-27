// Psychiatric Department Configuration – Adult, Child, De-addiction, Rehab, Emergency, ECT.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

const DEPARTMENTS = [
  { id: "adult", name: "Adult Psychiatry", key: "adult_psychiatry" },
  { id: "child", name: "Child Psychiatry", key: "child_psychiatry" },
  { id: "deaddiction", name: "De-addiction", key: "deaddiction" },
  { id: "rehab", name: "Rehab Unit", key: "rehab_unit" },
  { id: "emergency", name: "Emergency Psychiatry", key: "emergency_psychiatry" },
  { id: "ect", name: "ECT Unit", key: "ect_unit" },
];

function PsychiatricDepartmentConfig() {
  const [units, setUnits] = useState(
    DEPARTMENTS.map((d) => ({ ...d, active: true, head: "", beds: d.id === "ect" ? 0 : 20 }))
  );

  const update = (id, field, value) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  };

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Psychiatric Department Configuration</h2>
      <p className="section-subtitle">
        Configure Adult Psychiatry, Child Psychiatry, De-addiction, Rehab Unit, Emergency Psychiatry, and ECT Unit
      </p>

      <div className="impl-section">
        <h3>Departments & Units</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Status</th>
              <th>Unit Head</th>
              <th>Beds / Capacity</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>
                  <label className="impl-toggle">
                    <input
                      type="checkbox"
                      checked={u.active}
                      onChange={(e) => update(u.id, "active", e.target.checked)}
                    />
                    {u.active ? "Active" : "Inactive"}
                  </label>
                </td>
                <td>
                  <input
                    type="text"
                    value={u.head}
                    onChange={(e) => update(u.id, "head", e.target.value)}
                    placeholder="Unit head name"
                    className="impl-inline-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={u.beds}
                    onChange={(e) => update(u.id, "beds", parseInt(e.target.value, 10) || 0)}
                    className="impl-inline-input"
                    style={{ width: 80 }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="impl-btn impl-btn-primary" style={{ marginTop: 12 }}>
          Save Department Configuration
        </button>
      </div>
    </div>
  );
}

export default PsychiatricDepartmentConfig;
