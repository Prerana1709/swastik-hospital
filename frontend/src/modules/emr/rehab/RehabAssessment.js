// Psychiatric Rehab Assessment: Integrated with live clinical persistence.
import React from "react";
import { FaBrain, FaSave } from "react-icons/fa";

function RehabAssessment({ rehabData, setRehabData, onSave }) {
  const updateField = (field, value) => {
    setRehabData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rehab-assessment psych-consultation">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3><FaBrain /> Rehabilitation Assessment</h3>
        <button className="lab-btn lab-btn-primary" onClick={onSave}><FaSave /> Save Assessment</button>
      </div>

      <div className="assessment-grid">
        <div className="assessment-card">
          <h4>Initial Evaluation</h4>
          <textarea
            placeholder="Initial psychiatric/physical evaluation for rehab..."
            rows="5"
            value={rehabData.initialAssessment || ""}
            onChange={(e) => updateField("initialAssessment", e.target.value)}
          />
        </div>
        <div className="assessment-card">
          <h4>Psychological History</h4>
          <textarea
            placeholder="Past treatments, trauma history, personality traits..."
            rows="5"
            value={rehabData.psychologicalHistory || ""}
            onChange={(e) => updateField("psychologicalHistory", e.target.value)}
          />
        </div>
        <div className="assessment-card">
          <h4>Social & Family Support</h4>
          <textarea
            placeholder="Family dynamic, living situation, community support..."
            rows="5"
            value={rehabData.socialSupport || ""}
            onChange={(e) => updateField("socialSupport", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default RehabAssessment;
