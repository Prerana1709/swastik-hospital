// Psychiatric Medication Monitoring – Lithium, Clozapine, antipsychotic side-effects, lab frequency.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

function PsychiatricMedicationMonitoring() {
  const [lithiumEnabled, setLithiumEnabled] = useState(true);
  const [lithiumFreq, setLithiumFreq] = useState("3months");
  const [clozapineEnabled, setClozapineEnabled] = useState(true);
  const [clozapineAlertDays, setClozapineAlertDays] = useState(7);
  const [antipsychoticTracking, setAntipsychoticTracking] = useState(true);
  const [labFreqDefault, setLabFreqDefault] = useState("3months");

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Psychiatric Medication Monitoring</h2>
      <p className="section-subtitle">
        Lithium monitoring, Clozapine monitoring alerts, antipsychotic side-effect tracking, lab monitoring frequency
      </p>

      <div className="impl-section">
        <h3>Lithium Monitoring Setup</h3>
        <label className="impl-toggle">
          <input type="checkbox" checked={lithiumEnabled} onChange={(e) => setLithiumEnabled(e.target.checked)} />
          Enable lithium level monitoring alerts
        </label>
        <div className="impl-form-row">
          <label>Recommended lab monitoring frequency</label>
          <select
            value={lithiumFreq}
            onChange={(e) => setLithiumFreq(e.target.value)}
            style={{ maxWidth: 240 }}
          >
            <option value="1month">Every 1 month</option>
            <option value="2months">Every 2 months</option>
            <option value="3months">Every 3 months</option>
            <option value="6months">Every 6 months</option>
          </select>
        </div>
        <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
          Alert when next lithium level is overdue based on this interval.
        </p>
      </div>

      <div className="impl-section">
        <h3>Clozapine Monitoring Alerts</h3>
        <label className="impl-toggle">
          <input type="checkbox" checked={clozapineEnabled} onChange={(e) => setClozapineEnabled(e.target.checked)} />
          Enable Clozapine monitoring (CBC/WBC) alerts
        </label>
        <div className="impl-form-row">
          <label>Alert if no CBC within (days)</label>
          <input
            type="number"
            min="1"
            max="90"
            value={clozapineAlertDays}
            onChange={(e) => setClozapineAlertDays(parseInt(e.target.value, 10) || 7)}
            style={{ maxWidth: 100 }}
          />
        </div>
        <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
          Remind clinician and pharmacy when monitoring is due or overdue.
        </p>
      </div>

      <div className="impl-section">
        <h3>Antipsychotic Side-effect Tracking</h3>
        <label className="impl-toggle">
          <input
            type="checkbox"
            checked={antipsychoticTracking}
            onChange={(e) => setAntipsychoticTracking(e.target.checked)}
          />
          Enable structured side-effect tracking for antipsychotics
        </label>
        <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
          Track EPS, metabolic parameters, sedation, and prompt for AIMS when applicable.
        </p>
      </div>

      <div className="impl-section">
        <h3>Lab Monitoring Frequency (default)</h3>
        <div className="impl-form-row">
          <label>Default interval for mood stabilizer / antipsychotic labs</label>
          <select
            value={labFreqDefault}
            onChange={(e) => setLabFreqDefault(e.target.value)}
            style={{ maxWidth: 240 }}
          >
            <option value="1month">Every 1 month</option>
            <option value="2months">Every 2 months</option>
            <option value="3months">Every 3 months</option>
            <option value="6months">Every 6 months</option>
          </select>
        </div>
        <button type="button" className="impl-btn impl-btn-primary" style={{ marginTop: 16 }}>
          Save Medication Monitoring Configuration
        </button>
      </div>
    </div>
  );
}

export default PsychiatricMedicationMonitoring;
