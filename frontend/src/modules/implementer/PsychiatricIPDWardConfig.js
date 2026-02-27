// Psychiatric IPD Ward Configuration – Open, Closed, Observation wards, ECT scheduling, restraint policy.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

const WARDS = [
  { id: "open", name: "Open Ward", key: "open_ward" },
  { id: "closed", name: "Closed Ward", key: "closed_ward" },
  { id: "observation", name: "Observation Ward", key: "observation_ward" },
];

function PsychiatricIPDWardConfig() {
  const [wards, setWards] = useState(
    WARDS.map((w) => ({ ...w, active: true, beds: 20 }))
  );
  const [ectSlots, setEctSlots] = useState(4);
  const [restraintPolicy, setRestraintPolicy] = useState("document_and_review");
  const [restraintRequireOrder, setRestraintRequireOrder] = useState(true);

  const updateWard = (id, field, value) => {
    setWards((prev) => prev.map((w) => (w.id === id ? { ...w, [field]: value } : w)));
  };

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Psychiatric IPD Ward Configuration</h2>
      <p className="section-subtitle">
        Open Ward, Closed Ward, Observation Ward, ECT scheduling, restraint policy
      </p>

      <div className="impl-section">
        <h3>Wards</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Ward</th>
              <th>Status</th>
              <th>Beds</th>
            </tr>
          </thead>
          <tbody>
            {wards.map((w) => (
              <tr key={w.id}>
                <td><strong>{w.name}</strong></td>
                <td>
                  <label className="impl-toggle">
                    <input
                      type="checkbox"
                      checked={w.active}
                      onChange={(e) => updateWard(w.id, "active", e.target.checked)}
                    />
                    {w.active ? "Active" : "Inactive"}
                  </label>
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={w.beds}
                    onChange={(e) => updateWard(w.id, "beds", parseInt(e.target.value, 10) || 0)}
                    className="impl-inline-input"
                    style={{ width: 80 }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="impl-section">
        <h3>ECT Scheduling</h3>
        <div className="impl-form-row">
          <label>Default ECT slots per week</label>
          <input
            type="number"
            min="1"
            max="20"
            value={ectSlots}
            onChange={(e) => setEctSlots(parseInt(e.target.value, 10) || 4)}
            style={{ maxWidth: 100 }}
          />
        </div>
        <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
          Used for ECT unit capacity and scheduling templates.
        </p>
      </div>

      <div className="impl-section">
        <h3>Restraint Policy Configuration</h3>
        <div className="impl-form-row">
          <label>Policy mode</label>
          <select
            value={restraintPolicy}
            onChange={(e) => setRestraintPolicy(e.target.value)}
            style={{ maxWidth: 320 }}
          >
            <option value="document_and_review">Document and mandatory review</option>
            <option value="document_only">Document only</option>
            <option value="full_protocol">Full protocol (order, time limit, review, debrief)</option>
          </select>
        </div>
        <label className="impl-toggle" style={{ marginTop: 12 }}>
          <input
            type="checkbox"
            checked={restraintRequireOrder}
            onChange={(e) => setRestraintRequireOrder(e.target.checked)}
          />
          Require physician order for restraint/seclusion
        </label>
        <button type="button" className="impl-btn impl-btn-primary" style={{ marginTop: 16 }}>
          Save IPD Ward Configuration
        </button>
      </div>
    </div>
  );
}

export default PsychiatricIPDWardConfig;
