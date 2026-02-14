// Lab dashboard: stat cards and link to orders queue. No backend; dummy numbers.
import React from "react";
import { useNavigate } from "react-router-dom";
import "./lab.css";

const STATS = [
  { label: "Pending Samples", value: 12 },
  { label: "Samples Collected", value: 8 },
  { label: "Tests In Progress", value: 5 },
  { label: "Reports Ready", value: 24 },
];

function LabDashboard() {
  const navigate = useNavigate();

  return (
    <div className="content-area lab-page">
      <h2>Laboratory Management</h2>
      <p className="section-subtitle">Overview of lab workflow</p>

      <div className="lab-stat-grid">
        {STATS.map((s) => (
          <div key={s.label} className="lab-stat-card">
            <div className="label">{s.label}</div>
            <div className="value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="lab-section">
        <button type="button" className="lab-btn lab-btn-primary" onClick={() => navigate("/lab/new-sample")}>
          + Add New Sample
        </button>
        <button type="button" className="lab-btn lab-btn-secondary" onClick={() => navigate("/lab/orders")} style={{ marginLeft: 12 }}>
          View Lab Orders
        </button>
        <button type="button" className="lab-btn lab-btn-secondary" onClick={() => navigate("/lab/reports")} style={{ marginLeft: 12 }}>
          Lab Reports
        </button>
      </div>
    </div>
  );
}

export default LabDashboard;
