// Psychiatric Rehab Therapy Plan: Integrated with live clinical persistence.
import React from "react";
import { FaProcedures, FaSave } from "react-icons/fa";

function RehabTherapy({ rehabData, setRehabData, onSave }) {
  const updateField = (field, value) => {
    setRehabData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rehab-therapy psych-consultation">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3><FaProcedures /> Rehab Therapy Plan</h3>
        <button className="lab-btn lab-btn-primary" onClick={onSave}><FaSave /> Save Therapy Plan</button>
      </div>

      <div className="therapy-plan">
        <div className="form-grid">
          <div className="form-group">
            <label>Primary Therapy Type *</label>
            <select value={rehabData.therapyType} onChange={(e) => updateField("therapyType", e.target.value)}>
              <option>CBT (Cognitive Behavioral Therapy)</option>
              <option>Individual Counseling</option>
              <option>Group Therapy</option>
              <option>Family Therapy</option>
              <option>Recovery Support</option>
              <option>Occupational Therapy</option>
              <option>Vocational Rehab</option>
            </select>
          </div>
          <div className="form-group">
            <label>Assigned Therapist *</label>
            <select value={rehabData.assignedTherapist} onChange={(e) => updateField("assignedTherapist", e.target.value)}>
              <option>Dr. Nikhil Chougule</option>
              <option>Dr. P. M. Chougule</option>
              <option>Staff Counselor - A</option>
              <option>Recovery Coach - B</option>
            </select>
          </div>
          <div className="form-group">
            <label>Frequency *</label>
            <select value={rehabData.therapyFrequency} onChange={(e) => updateField("therapyFrequency", e.target.value)}>
              <option>Daily</option>
              <option>Thrice Weekly</option>
              <option>Twice Weekly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="form-group">
            <label>Target Completion Date</label>
            <input
              type="date"
              value={rehabData.targetDate || ""}
              onChange={(e) => updateField("targetDate", e.target.value)}
            />
          </div>
          <div className="form-group full-width">
            <label>Specific Intervention Protocol & Milestones</label>
            <textarea
              placeholder="Step-by-step interventions, focus areas for this patient, relapse prevention strategies..."
              rows="6"
              value={rehabData.therapyDetails || ""}
              onChange={(e) => updateField("therapyDetails", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RehabTherapy;
