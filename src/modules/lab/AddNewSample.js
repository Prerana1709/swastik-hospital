// Add New Sample: patient details, test selection, sample details. Save logs and navigates to lab queue.
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./lab.css";

// Auto-generate Sample ID: LAB-YYYY-XXX
function generateSampleId() {
  const y = new Date().getFullYear();
  const x = String(Math.floor(100 + Math.random() * 900));
  return "LAB-" + y + "-" + x;
}

// Dummy tests with sample type
const MOCK_TESTS = [
  { id: "t1", name: "CBC", sampleType: "Blood" },
  { id: "t2", name: "RBS", sampleType: "Blood" },
  { id: "t3", name: "LFT", sampleType: "Blood" },
  { id: "t4", name: "KFT", sampleType: "Blood" },
  { id: "t5", name: "Urine Routine", sampleType: "Urine" },
  { id: "t6", name: "Urine Culture", sampleType: "Urine" },
  { id: "t7", name: "Throat Swab", sampleType: "Swab" },
  { id: "t8", name: "HbA1c", sampleType: "Blood" },
];

const VISIT_TYPES = ["OPD", "IPD", "Emergency", "External"];
const PRIORITIES = ["Normal", "Urgent"];

function AddNewSample() {
  const navigate = useNavigate();
  const [sampleId] = useState(() => generateSampleId());
  const [form, setForm] = useState({
    uhid: "",
    patientName: "",
    age: "",
    gender: "",
    phone: "",
    visitType: "OPD",
    collectionDateTime: new Date().toISOString().slice(0, 16),
    collectedBy: "",
    priority: "Normal",
  });
  const [selectedTests, setSelectedTests] = useState([]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleTest = (test) => {
    setSelectedTests((prev) =>
      prev.some((t) => t.id === test.id) ? prev.filter((t) => t.id !== test.id) : [...prev, test]
    );
  };

  const selectedSampleTypes = [...new Set(selectedTests.map((t) => t.sampleType))].join(", ") || "—";

  const handleSave = () => {
    const sample = {
      sampleId,
      status: "ORDERED",
      patient: {
        uhid: form.uhid || undefined,
        patientName: form.patientName,
        age: form.age,
        gender: form.gender,
        phone: form.phone,
        visitType: form.visitType,
      },
      tests: selectedTests,
      collectionDateTime: form.collectionDateTime,
      collectedBy: form.collectedBy,
      priority: form.priority,
    };
    console.log("New sample added to lab queue:", sample);
    navigate("/lab/orders");
  };

  const handlePrintLabel = () => {
    window.print();
  };

  const handleCancel = () => {
    navigate("/lab/orders");
  };

  return (
    <div className="content-area lab-page">
      <Link to="/lab/orders" className="lab-back-link no-print">
        <FaArrowLeft /> Back to Lab Orders
      </Link>
      <h2>Add New Sample</h2>
      <p className="section-subtitle">Register a new sample for the lab queue</p>

      <div className="lab-section no-print">
        <h3>Patient Details</h3>
        <div className="lab-form-grid">
          <div className="lab-form-row">
            <label>UHID / Patient ID (optional)</label>
            <input type="text" value={form.uhid} onChange={(e) => update("uhid", e.target.value)} placeholder="UHID" />
          </div>
          <div className="lab-form-row">
            <label>Patient Name</label>
            <input type="text" value={form.patientName} onChange={(e) => update("patientName", e.target.value)} placeholder="Full name" />
          </div>
          <div className="lab-form-row">
            <label>Age</label>
            <input type="text" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="Age" />
          </div>
          <div className="lab-form-row">
            <label>Gender</label>
            <select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="lab-form-row">
            <label>Phone Number</label>
            <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone" />
          </div>
          <div className="lab-form-row">
            <label>Visit Type</label>
            <select value={form.visitType} onChange={(e) => update("visitType", e.target.value)}>
              {VISIT_TYPES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="lab-section no-print">
        <h3>Test Selection</h3>
        <p className="lab-hint">Select tests; sample type is shown automatically.</p>
        <div className="lab-test-list">
          {MOCK_TESTS.map((test) => (
            <label key={test.id} className="lab-test-check">
              <input
                type="checkbox"
                checked={selectedTests.some((t) => t.id === test.id)}
                onChange={() => toggleTest(test)}
              />
              <span>{test.name}</span>
              <span className="lab-sample-type">{test.sampleType}</span>
            </label>
          ))}
        </div>
        <div className="lab-form-row" style={{ marginTop: 12 }}>
          <label>Sample type(s)</label>
          <input type="text" value={selectedSampleTypes} readOnly style={{ background: "#f3f4f6", maxWidth: 300 }} />
        </div>
      </div>

      <div className="lab-section no-print">
        <h3>Sample Details</h3>
        <div className="lab-form-grid">
          <div className="lab-form-row">
            <label>Sample ID (auto-generated)</label>
            <input type="text" value={sampleId} readOnly style={{ background: "#f3f4f6", maxWidth: 180 }} />
          </div>
          <div className="lab-form-row">
            <label>Collection Date & Time</label>
            <input
              type="datetime-local"
              value={form.collectionDateTime}
              onChange={(e) => update("collectionDateTime", e.target.value)}
            />
          </div>
          <div className="lab-form-row">
            <label>Collected By</label>
            <input type="text" value={form.collectedBy} onChange={(e) => update("collectedBy", e.target.value)} placeholder="Name" />
          </div>
          <div className="lab-form-row">
            <label>Priority</label>
            <select value={form.priority} onChange={(e) => update("priority", e.target.value)}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="lab-section no-print">
        <button type="button" className="lab-btn lab-btn-primary" onClick={handleSave}>
          Save & Add to Lab Queue
        </button>
        <button type="button" className="lab-btn lab-btn-secondary" onClick={handlePrintLabel} style={{ marginLeft: 12 }}>
          Print Sample Label
        </button>
        <button type="button" className="lab-btn lab-btn-secondary" onClick={handleCancel} style={{ marginLeft: 12 }}>
          Cancel
        </button>
      </div>

      <div className="sample-label-print">
        <div className="label-title">Sample Label</div>
        <p><strong>Patient Name:</strong> {form.patientName || "—"}</p>
        <p><strong>UHID:</strong> {form.uhid || "—"}</p>
        <p><strong>Test(s):</strong> {selectedTests.map((t) => t.name).join(", ") || "—"}</p>
        <p><strong>Sample ID:</strong> {sampleId}</p>
      </div>
    </div>
  );
}

export default AddNewSample;
