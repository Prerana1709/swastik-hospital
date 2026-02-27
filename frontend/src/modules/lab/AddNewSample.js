// Psychiatric Lab Order Form: patient, diagnosis, medication, test type, risk level, ordered by, emergency flag.
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./lab.css";

function generateSampleId() {
  const y = new Date().getFullYear();
  const x = String(Math.floor(100 + Math.random() * 900));
  return "PSY-LAB-" + y + "-" + x;
}

const MEDICATIONS = [
  "",
  "Lithium",
  "Clozapine",
  "Valproate",
  "Carbamazepine",
  "Risperidone",
  "Olanzapine",
  "Quetiapine",
  "Aripiprazole",
  "Other",
];

const TEST_TYPES = [
  "",
  "Lithium level",
  "Clozapine level",
  "Valproate level",
  "CBC / ANC (Clozapine monitoring)",
  "Urine drug screen",
  "Alcohol (blood/serum)",
  "Lipid profile",
  "HbA1c",
  "Fasting blood sugar",
  "LFT",
  "RFT / Electrolytes",
  "Thyroid function",
  "Pre-admission screening panel",
  "Other",
];

const RISK_LEVELS = ["Low", "Moderate", "High"];
const ORDERED_BY_OPTIONS = ["Dr. P. M. Chougule", "Dr. Priya Sharma", "Dr. Suresh Nair", "Dr. Anjali Patel", "Other Psychiatrist"];

function AddNewSample() {
  const navigate = useNavigate();
  const [sampleId] = useState(() => generateSampleId());
  const [form, setForm] = useState({
    patientName: "",
    uhid: "",
    diagnosis: "",
    medication: "",
    testType: "",
    riskLevel: "Low",
    orderedBy: "Dr. P. M. Chougule",
    emergencyFlag: false,
    notes: "",
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    const order = {
      sampleId,
      status: "ORDERED",
      ...form,
    };
    console.log("Psychiatric lab order:", order);
    navigate("/lab/orders");
  };

  const handleCancel = () => navigate("/lab/orders");

  return (
    <div className="content-area lab-page lab-page-psych">
      <Link to="/lab" className="lab-back-link">
        <FaArrowLeft /> Back to Psychiatric Laboratory
      </Link>
      <h2>Psychiatric Lab Order</h2>
      <p className="section-subtitle">
        Add a new lab order for medication monitoring, substance screening, or metabolic monitoring
      </p>

      <div className="lab-section">
        <h3>Patient & Order Details</h3>
        <div className="lab-form-grid">
          <div className="lab-form-row">
            <label>Patient Name *</label>
            <input
              type="text"
              value={form.patientName}
              onChange={(e) => update("patientName", e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="lab-form-row">
            <label>UHID</label>
            <input
              type="text"
              value={form.uhid}
              onChange={(e) => update("uhid", e.target.value)}
              placeholder="Unique health ID"
            />
          </div>
          <div className="lab-form-row">
            <label>Diagnosis</label>
            <input
              type="text"
              value={form.diagnosis}
              onChange={(e) => update("diagnosis", e.target.value)}
              placeholder="e.g. Bipolar disorder, Schizophrenia"
            />
          </div>
          <div className="lab-form-row">
            <label>Medication</label>
            <select value={form.medication} onChange={(e) => update("medication", e.target.value)}>
              {MEDICATIONS.map((m) => (
                <option key={m || "blank"} value={m}>{m || "— Select —"}</option>
              ))}
            </select>
          </div>
          <div className="lab-form-row">
            <label>Test Type *</label>
            <select value={form.testType} onChange={(e) => update("testType", e.target.value)}>
              {TEST_TYPES.map((t) => (
                <option key={t || "blank"} value={t}>{t || "— Select —"}</option>
              ))}
            </select>
          </div>
          <div className="lab-form-row">
            <label>Risk Level</label>
            <select value={form.riskLevel} onChange={(e) => update("riskLevel", e.target.value)}>
              {RISK_LEVELS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="lab-form-row">
            <label>Ordered By (Psychiatrist)</label>
            <select value={form.orderedBy} onChange={(e) => update("orderedBy", e.target.value)}>
              {ORDERED_BY_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="lab-form-row lab-form-row-full">
            <label className="lab-check-label">
              <input
                type="checkbox"
                checked={form.emergencyFlag}
                onChange={(e) => update("emergencyFlag", e.target.checked)}
              />
              Emergency flag
            </label>
          </div>
          <div className="lab-form-row lab-form-row-full">
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Optional clinical notes"
              rows={2}
            />
          </div>
        </div>
        <div className="lab-form-row" style={{ marginTop: 8 }}>
          <label>Sample ID (auto-generated)</label>
          <input type="text" value={sampleId} readOnly className="lab-readonly" />
        </div>
      </div>

      <div className="lab-section">
        <button type="button" className="lab-btn lab-btn-primary" onClick={handleSave}>
          Save & Add to Lab Queue
        </button>
        <button type="button" className="lab-btn lab-btn-secondary" onClick={handleCancel} style={{ marginLeft: 12 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddNewSample;
