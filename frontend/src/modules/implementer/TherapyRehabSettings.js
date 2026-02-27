// Therapy & Rehabilitation Settings – CBT, DBT, Group Therapy, session frequency, rehab milestones.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

function TherapyRehabSettings() {
  const [cbtEnabled, setCbtEnabled] = useState(true);
  const [cbtSessions, setCbtSessions] = useState(12);
  const [dbtEnabled, setDbtEnabled] = useState(true);
  const [dbtSessions, setDbtSessions] = useState(24);
  const [groupEnabled, setGroupEnabled] = useState(true);
  const [sessionFreqMin, setSessionFreqMin] = useState(1);
  const [sessionFreqMax, setSessionFreqMax] = useState(4);
  const [milestoneTracking, setMilestoneTracking] = useState(true);

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Therapy & Rehabilitation Settings</h2>
      <p className="section-subtitle">
        CBT/DBT program setup, group therapy, session frequency rules, rehab milestone tracking
      </p>

      <div className="impl-section">
        <h3>CBT Program Setup</h3>
        <label className="impl-toggle">
          <input type="checkbox" checked={cbtEnabled} onChange={(e) => setCbtEnabled(e.target.checked)} />
          Enable CBT program
        </label>
        <div className="impl-form-row">
          <label>Default number of sessions per program</label>
          <input
            type="number"
            min="1"
            max="24"
            value={cbtSessions}
            onChange={(e) => setCbtSessions(parseInt(e.target.value, 10) || 12)}
            style={{ maxWidth: 100 }}
          />
        </div>
      </div>

      <div className="impl-section">
        <h3>DBT Program Setup</h3>
        <label className="impl-toggle">
          <input type="checkbox" checked={dbtEnabled} onChange={(e) => setDbtEnabled(e.target.checked)} />
          Enable DBT program
        </label>
        <div className="impl-form-row">
          <label>Default number of sessions (e.g. skills modules)</label>
          <input
            type="number"
            min="1"
            max="52"
            value={dbtSessions}
            onChange={(e) => setDbtSessions(parseInt(e.target.value, 10) || 24)}
            style={{ maxWidth: 100 }}
          />
        </div>
      </div>

      <div className="impl-section">
        <h3>Group Therapy Configuration</h3>
        <label className="impl-toggle">
          <input type="checkbox" checked={groupEnabled} onChange={(e) => setGroupEnabled(e.target.checked)} />
          Enable group therapy module
        </label>
      </div>

      <div className="impl-section">
        <h3>Session Frequency Rules</h3>
        <p className="section-subtitle" style={{ marginBottom: 12 }}>
          Recommended sessions per week (min–max) for outpatient therapy
        </p>
        <div className="impl-form-row">
          <label>Minimum sessions per week</label>
          <input
            type="number"
            min="0"
            max="7"
            value={sessionFreqMin}
            onChange={(e) => setSessionFreqMin(parseInt(e.target.value, 10) || 0)}
            style={{ maxWidth: 80 }}
          />
        </div>
        <div className="impl-form-row">
          <label>Maximum sessions per week</label>
          <input
            type="number"
            min="1"
            max="7"
            value={sessionFreqMax}
            onChange={(e) => setSessionFreqMax(parseInt(e.target.value, 10) || 4)}
            style={{ maxWidth: 80 }}
          />
        </div>
      </div>

      <div className="impl-section">
        <h3>Rehab Milestone Tracking</h3>
        <label className="impl-toggle">
          <input type="checkbox" checked={milestoneTracking} onChange={(e) => setMilestoneTracking(e.target.checked)} />
          Enable rehabilitation milestone tracking and alerts
        </label>
        <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
          Track predefined milestones (e.g. first leave, weekend pass, discharge readiness) and remind staff to update.
        </p>
        <button type="button" className="impl-btn impl-btn-primary" style={{ marginTop: 16 }}>
          Save Therapy & Rehab Settings
        </button>
      </div>
    </div>
  );
}

export default TherapyRehabSettings;
