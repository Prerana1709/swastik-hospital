// Lab result entry: compare value vs normal range; critical confirmation modal; Save Draft / Verify & Publish; Clinical Summary.
import React, { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./lab.css";

const MOCK_PATIENT = { name: "Sunita Kulkarni", uhid: "UHID-2024-002", age: 32, gender: "Female" };
const MOCK_CLINICAL = { chiefComplaint: "Fever and fatigue", provisionalDiagnosis: "Anemia", orderingDoctor: "Dr. Sharma" };
const MOCK_TESTS = [
  { id: 1, name: "Hemoglobin", unit: "g/dL", normalRange: "12-16", value: "", remarks: "", flag: "Normal" },
  { id: 2, name: "Serum Creatinine", unit: "mg/dL", normalRange: "0.6-1.2", value: "", remarks: "", flag: "Normal" },
];

// Parse "12-16" or "0.6-1.2" into { min, max }. Returns null if not parseable.
function parseNormalRange(rangeStr) {
  if (!rangeStr || typeof rangeStr !== "string") return null;
  const parts = rangeStr.trim().split(/-|–|—/);
  if (parts.length < 2) return null;
  const min = parseFloat(parts[0].trim());
  const max = parseFloat(parts[1].trim());
  if (Number.isNaN(min) || Number.isNaN(max)) return null;
  return { min, max };
}

// Check if value is outside normal range → suggest Critical
function isOutOfRange(value, normalRangeStr) {
  const parsed = parseNormalRange(normalRangeStr);
  if (!parsed) return false;
  const num = parseFloat(String(value).trim());
  if (Number.isNaN(num)) return false;
  return num < parsed.min || num > parsed.max;
}

function LabResultEntry() {
  const { orderId } = useParams();
  const [tests, setTests] = useState(MOCK_TESTS.map((t) => ({ ...t })));
  const [verified, setVerified] = useState(false);
  const [criticalModal, setCriticalModal] = useState(null);
  const [criticalTestId, setCriticalTestId] = useState(null);

  const updateTest = useCallback((id, field, val) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
  }, []);

  const checkCriticalOnBlur = (test) => {
    if (verified || !test.value) return;
    if (isOutOfRange(test.value, test.normalRange)) {
      setCriticalTestId(test.id);
      setCriticalModal({
        testName: test.name,
        value: test.value,
        normalRange: test.normalRange,
      });
    }
  };

  const confirmCritical = () => {
    if (criticalTestId) {
      updateTest(criticalTestId, "flag", "Critical");
    }
    setCriticalModal(null);
    setCriticalTestId(null);
  };

  const dismissCritical = () => {
    setCriticalModal(null);
    setCriticalTestId(null);
  };

  const handleSaveDraft = () => {
    const data = { orderId, patient: MOCK_PATIENT, tests, draft: true };
    console.log("Lab result draft saved:", data);
    alert("Draft saved. (Check console)");
  };

  const handleVerifyPublish = () => {
    const data = { orderId, patient: MOCK_PATIENT, tests, verified: true };
    console.log("Result verified & published:", data);
    setVerified(true);
    alert("Report verified and published. (Check console)");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="content-area lab-page">
      <Link to="/lab/orders" className="lab-back-link no-print">
        <FaArrowLeft /> Back to Lab Orders
      </Link>
      <h2>Lab Result Entry</h2>
      <p className="section-subtitle">Order: {orderId}</p>

      {/* Clinical Summary (read-only, UI only) */}
      <div className="lab-clinical-summary">
        <h4>Clinical Summary</h4>
        <div className="row"><strong>Chief Complaint:</strong> {MOCK_CLINICAL.chiefComplaint}</div>
        <div className="row"><strong>Provisional Diagnosis:</strong> {MOCK_CLINICAL.provisionalDiagnosis}</div>
        <div className="row"><strong>Ordering Doctor:</strong> {MOCK_CLINICAL.orderingDoctor}</div>
      </div>

      <div className="lab-section">
        <h3>Patient Summary</h3>
        <div className="lab-patient-summary">
          <div className="item"><strong>Name</strong>{MOCK_PATIENT.name}</div>
          <div className="item"><strong>UHID</strong>{MOCK_PATIENT.uhid}</div>
          <div className="item"><strong>Age</strong>{MOCK_PATIENT.age}</div>
          <div className="item"><strong>Gender</strong>{MOCK_PATIENT.gender}</div>
        </div>
      </div>

      <div className="lab-section">
        <h3>Results</h3>
        {tests.map((t) => (
          <div key={t.id} className="lab-result-row">
            <div className="lab-form-row">
              <label>{t.name} ({t.unit})</label>
              <input
                type="text"
                value={t.value}
                onChange={(e) => updateTest(t.id, "value", e.target.value)}
                onBlur={() => checkCriticalOnBlur(t)}
                placeholder="Result value"
                readOnly={verified}
              />
            </div>
            <div className="lab-form-row">
              <label>Normal range</label>
              <input type="text" value={t.normalRange} readOnly style={{ background: "#f3f4f6" }} />
            </div>
            <div className="lab-form-row">
              <label>Remarks</label>
              <input
                type="text"
                value={t.remarks}
                onChange={(e) => updateTest(t.id, "remarks", e.target.value)}
                placeholder="Remarks"
                readOnly={verified}
              />
            </div>
            <div className="lab-form-row">
              <label>Flag</label>
              <select
                value={t.flag}
                onChange={(e) => updateTest(t.id, "flag", e.target.value)}
                disabled={verified}
              >
                <option value="Normal">Normal</option>
                <option value="Abnormal">Abnormal</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="lab-section no-print">
        <button type="button" className="lab-btn lab-btn-secondary" onClick={handleSaveDraft} disabled={verified}>
          Save Draft
        </button>
        <button type="button" className="lab-btn lab-btn-primary" onClick={handleVerifyPublish} disabled={verified}>
          Verify & Publish
        </button>
        <button type="button" className="lab-btn lab-btn-secondary" onClick={handlePrint}>
          Print Report
        </button>
      </div>

      {/* Critical result confirmation modal */}
      {criticalModal && (
        <div className="lab-modal-overlay" onClick={dismissCritical}>
          <div className="lab-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Critical result?</h4>
            <p>
              <strong>{criticalModal.testName}</strong>: value "{criticalModal.value}" is outside normal range ({criticalModal.normalRange}). Mark as Critical?
            </p>
            <div className="lab-modal-actions">
              <button type="button" className="lab-btn lab-btn-secondary" onClick={dismissCritical}>
                No
              </button>
              <button type="button" className="lab-btn lab-btn-primary" onClick={confirmCritical}>
                Yes, mark Critical
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabResultEntry;
