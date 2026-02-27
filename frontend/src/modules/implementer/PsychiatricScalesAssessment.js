// Psychiatric Scales & Assessment Tools – PHQ-9, GAD-7, HAM-D, YMRS, MMSE, BPRS with scoring/severity.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

const SCALES = [
  { id: "phq9", name: "PHQ-9", fullName: "Patient Health Questionnaire-9", maxScore: 27 },
  { id: "gad7", name: "GAD-7", fullName: "Generalized Anxiety Disorder-7", maxScore: 21 },
  { id: "hamd", name: "HAM-D", fullName: "Hamilton Depression Rating Scale", maxScore: 52 },
  { id: "ymrs", name: "YMRS", fullName: "Young Mania Rating Scale", maxScore: 60 },
  { id: "mmse", name: "MMSE", fullName: "Mini-Mental State Examination", maxScore: 30 },
  { id: "bprs", name: "BPRS", fullName: "Brief Psychiatric Rating Scale", maxScore: 126 },
];

const DEFAULT_SEVERITY = {
  phq9: [
    { label: "Minimal", min: 0, max: 4 },
    { label: "Mild", min: 5, max: 9 },
    { label: "Moderate", min: 10, max: 14 },
    { label: "Moderately severe", min: 15, max: 19 },
    { label: "Severe", min: 20, max: 27 },
  ],
  gad7: [
    { label: "Minimal", min: 0, max: 4 },
    { label: "Mild", min: 5, max: 9 },
    { label: "Moderate", min: 10, max: 14 },
    { label: "Severe", min: 15, max: 21 },
  ],
};

function PsychiatricScalesAssessment() {
  const [enabled, setEnabled] = useState(SCALES.reduce((acc, s) => ({ ...acc, [s.id]: true }), {}));

  const toggle = (id) => setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Psychiatric Scales & Assessment Tools</h2>
      <p className="section-subtitle">
        PHQ-9, GAD-7, HAM-D, YMRS, MMSE, BPRS – scoring logic and severity interpretation
      </p>

      <div className="impl-section">
        <h3>Assessment Tools</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Scale</th>
              <th>Full Name</th>
              <th>Max Score</th>
              <th>Enabled</th>
              <th>Configure</th>
            </tr>
          </thead>
          <tbody>
            {SCALES.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.fullName}</td>
                <td>{s.maxScore}</td>
                <td>
                  <label className="impl-toggle">
                    <input type="checkbox" checked={enabled[s.id]} onChange={() => toggle(s.id)} />
                    {enabled[s.id] ? "Yes" : "No"}
                  </label>
                </td>
                <td>
                  <button type="button" className="impl-btn impl-btn-secondary">Scoring & Severity</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="impl-section">
        <h3>Severity Interpretation (PHQ-9)</h3>
        <p className="section-subtitle" style={{ marginBottom: 12 }}>
          Score ranges and labels used in reports and alerts
        </p>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Score Range</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_SEVERITY.phq9.map((row, i) => (
              <tr key={i}>
                <td>{row.label}</td>
                <td>{row.min}–{row.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="impl-section">
        <h3>Severity Interpretation (GAD-7)</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Score Range</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_SEVERITY.gad7.map((row, i) => (
              <tr key={i}>
                <td>{row.label}</td>
                <td>{row.min}–{row.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="impl-btn impl-btn-primary" style={{ marginTop: 12 }}>
          Save Scales Configuration
        </button>
      </div>
    </div>
  );
}

export default PsychiatricScalesAssessment;
