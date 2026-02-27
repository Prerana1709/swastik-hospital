// Psychiatric Laboratory dashboard: Live medication monitoring, substance screening, metabolic monitoring.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFlask, FaPills, FaVial, FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import "./lab.css";
import { api } from "../../api/service";

function LabDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getLabStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatCount = (status) => stats[status] || 0;

  const PSYCH_STATS = [
    { label: "Pending Samples", value: getStatCount("ORDERED"), icon: <FaVial />, color: "#3b82f6" },
    { label: "Samples Collected", value: getStatCount("SAMPLE_COLLECTED"), icon: <FaFlask />, color: "#8b5cf6" },
    { label: "In Progress", value: getStatCount("IN_TEST"), icon: <FaChartLine />, color: "#f59e0b" },
    { label: "Critical Results", value: getStatCount("CRITICAL"), icon: <FaExclamationTriangle />, color: "#ef4444" },
  ];

  const LAB_CATEGORIES = [
    { id: "medication", title: "Medication Monitoring", tests: "Lithium, Clozapine, Valproate levels" },
    { id: "substance", title: "Substance Abuse Screening", tests: "Urine drug screen, Alcohol test" },
    { id: "metabolic", title: "Metabolic Monitoring", tests: "Lipid profile, HbA1c, Blood sugar" },
    { id: "preadmission", title: "Pre-Admission Screening", tests: "Baseline labs, drug screen, metabolic panel" },
  ];

  return (
    <div className="content-area lab-page lab-page-psych">
      <h2>Psychiatric Laboratory Management</h2>
      <p className="section-subtitle">
        Live medication monitoring and specialized psychiatric lab services for Swastik Hospital
      </p>

      <div className="lab-stat-grid lab-stat-grid-psych">
        {PSYCH_STATS.map((s) => (
          <div key={s.label} className="lab-stat-card lab-stat-card-psych" style={{ borderLeft: `4px solid ${s.color}` }}>
            <span className="lab-stat-icon" style={{ color: s.color }}>{s.icon}</span>
            <div className="label">{s.label}</div>
            <div className="value">{loading ? "..." : s.value}</div>
          </div>
        ))}
      </div>

      <div className="lab-section">
        <h3>Lab Categories</h3>
        <p className="lab-hint">Psychiatric-specific test groups. Orders are created from the Clinical module.</p>
        <div className="lab-categories-grid">
          {LAB_CATEGORIES.map((cat) => (
            <div key={cat.id} className="lab-category-card">
              <h4>{cat.title}</h4>
              <p>{cat.tests}</p>
              <button type="button" className="lab-btn lab-btn-secondary" onClick={() => navigate("/lab/orders")}>
                View Orders
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="lab-section lab-actions-row">
        <button type="button" className="lab-btn lab-btn-primary" onClick={() => navigate("/lab/orders")}>
          View Lab Orders Queue
        </button>
        <button type="button" className="lab-btn lab-btn-secondary" onClick={() => navigate("/lab/reports")} style={{ marginLeft: 12 }}>
          Search Lab Reports
        </button>
      </div>
    </div>
  );
}

export default LabDashboard;
