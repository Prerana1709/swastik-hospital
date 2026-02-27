// Psychiatric IPD Admission: Fully integrated with live clinical persistence.
import React from "react";
import { FaRegHospital, FaSave } from "react-icons/fa";

function IPDAdmission({ admissionData, setAdmissionData, onSave }) {
  const updateField = (field, value) => {
    setAdmissionData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="ipd-admission psych-consultation">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3><FaRegHospital /> Psychiatric IPD Admission</h3>
        <button className="lab-btn lab-btn-primary" onClick={onSave}><FaSave /> Save Admission Details</button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Admission Date *</label>
          <input
            type="date"
            value={admissionData.date || ""}
            onChange={(e) => updateField("date", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Select Ward *</label>
          <select value={admissionData.ward} onChange={(e) => updateField("ward", e.target.value)}>
            <option>Psychiatric Ward-A</option>
            <option>Psychiatric Ward-B</option>
            <option>Crisis Stabilization Unit</option>
            <option>Detox / Substance Use Ward</option>
            <option>Private Room</option>
          </select>
        </div>
        <div className="form-group">
          <label>Bed Number *</label>
          <input
            placeholder="e.g. B-102"
            value={admissionData.bedNumber || ""}
            onChange={(e) => updateField("bedNumber", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Admitting Doctor *</label>
          <select value={admissionData.doctor} onChange={(e) => updateField("doctor", e.target.value)}>
            <option>Dr. P. M. Chougule</option>
            <option>Dr. Nikhil Chougule</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label>Admission Diagnosis (DSM-5 / ICD-10) *</label>
          <textarea
            placeholder="Primary psychiatric diagnosis..."
            rows="2"
            value={admissionData.diagnosis || ""}
            onChange={(e) => updateField("diagnosis", e.target.value)}
          />
        </div>
        <div className="form-group full-width">
          <label>Reason for Admission & Risk Assessment</label>
          <textarea
            placeholder="Clinical justification, risk level, safety concerns..."
            rows="3"
            value={admissionData.reason || ""}
            onChange={(e) => updateField("reason", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default IPDAdmission;
