// Psychiatric Clinical Form Builder – MSE, Suicide Risk, Violence Risk, DSM-5, Progress Note, Therapy Session.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

const FORM_TEMPLATES = [
  { id: "mse", name: "Mental Status Examination (MSE) Template", path: "#" },
  { id: "suicide", name: "Suicide Risk Assessment Form", path: "#" },
  { id: "violence", name: "Violence Risk Assessment", path: "#" },
  { id: "dsm5", name: "DSM-5 Diagnosis Template", path: "#" },
  { id: "progress", name: "Psychiatric Progress Note Template", path: "#" },
  { id: "therapy", name: "Therapy Session Template", path: "#" },
];

function PsychiatricClinicalFormBuilder() {
  const [enabled, setEnabled] = useState(
    FORM_TEMPLATES.reduce((acc, t) => ({ ...acc, [t.id]: true }), {})
  );

  const toggle = (id) => setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Psychiatric Clinical Form Builder</h2>
      <p className="section-subtitle">
        Manage MSE, Suicide Risk, Violence Risk, DSM-5, Progress Notes, and Therapy Session templates
      </p>

      <div className="impl-section">
        <h3>Form Templates</h3>
        <table className="impl-table">
          <thead>
            <tr>
              <th>Template</th>
              <th>Enabled</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {FORM_TEMPLATES.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.name}</strong></td>
                <td>
                  <label className="impl-toggle">
                    <input type="checkbox" checked={enabled[t.id]} onChange={() => toggle(t.id)} />
                    {enabled[t.id] ? "Yes" : "No"}
                  </label>
                </td>
                <td>
                  <button type="button" className="impl-btn impl-btn-secondary">Edit Template</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="impl-section">
        <h3>Default Sections (MSE)</h3>
        <div className="impl-check-list">
          {["Appearance", "Behaviour", "Speech", "Mood & Affect", "Thought", "Perception", "Cognition", "Insight & Judgement"].map((s) => (
            <label key={s}>
              <input type="checkbox" defaultChecked /> {s}
            </label>
          ))}
        </div>
        <button type="button" className="impl-btn impl-btn-primary" style={{ marginTop: 12 }}>
          Save Form Builder Settings
        </button>
      </div>
    </div>
  );
}

export default PsychiatricClinicalFormBuilder;
