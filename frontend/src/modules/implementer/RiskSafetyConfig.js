// Risk & Safety Configuration – suicide alert, high risk flags, emergency protocol, guardian notification.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

function RiskSafetyConfig() {
  const [suicideThreshold, setSuicideThreshold] = useState(8);
  const [highRiskFlag, setHighRiskFlag] = useState(true);
  const [emergencyProtocol, setEmergencyProtocol] = useState(true);
  const [guardianNotify, setGuardianNotify] = useState(true);
  const [guardianNotifyDelay, setGuardianNotifyDelay] = useState(60);

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Risk & Safety Configuration</h2>
      <p className="section-subtitle">
        Suicide alert threshold, high risk flag system, emergency psychiatric protocol, guardian notification
      </p>

      <div className="impl-section">
        <h3>Suicide Alert Threshold</h3>
        <div className="impl-form-row">
          <label>Trigger alert when suicide risk score ≥</label>
          <input
            type="number"
            min="1"
            max="10"
            value={suicideThreshold}
            onChange={(e) => setSuicideThreshold(parseInt(e.target.value, 10) || 0)}
            style={{ maxWidth: 100 }}
          />
        </div>
        <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
          Scores at or above this value will trigger an immediate alert and flag on the patient record.
        </p>
      </div>

      <div className="impl-section">
        <h3>High Risk Flag System</h3>
        <label className="impl-toggle">
          <input type="checkbox" checked={highRiskFlag} onChange={(e) => setHighRiskFlag(e.target.checked)} />
          Enable high-risk flag on dashboard and patient list
        </label>
        <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
          Flagged patients appear with a prominent indicator for nursing and medical staff.
        </p>
      </div>

      <div className="impl-section">
        <h3>Emergency Psychiatric Protocol</h3>
        <label className="impl-toggle">
          <input type="checkbox" checked={emergencyProtocol} onChange={(e) => setEmergencyProtocol(e.target.checked)} />
          Require emergency protocol checklist for crisis referrals
        </label>
        <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
          When enabled, clinicians must complete the emergency protocol form for all crisis presentations.
        </p>
      </div>

      <div className="impl-section">
        <h3>Guardian Notification Setting</h3>
        <label className="impl-toggle">
          <input type="checkbox" checked={guardianNotify} onChange={(e) => setGuardianNotify(e.target.checked)} />
          Notify guardian/next of kin for high-risk and emergency admissions
        </label>
        <div className="impl-form-row" style={{ marginTop: 12 }}>
          <label>Notify within (minutes)</label>
          <input
            type="number"
            min="15"
            max="240"
            value={guardianNotifyDelay}
            onChange={(e) => setGuardianNotifyDelay(parseInt(e.target.value, 10) || 60)}
            style={{ maxWidth: 100 }}
          />
        </div>
        <button type="button" className="impl-btn impl-btn-primary" style={{ marginTop: 16 }}>
          Save Risk & Safety Configuration
        </button>
      </div>
    </div>
  );
}

export default RiskSafetyConfig;
