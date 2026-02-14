// Sample collection: auto Sample ID (LAB-YYYY-XXX), Print Sample Label, Mark collected.
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./lab.css";

const MOCK_PATIENT = { name: "Ramesh Patil", uhid: "UHID-2024-001", age: 45, gender: "Male" };
const MOCK_TESTS = [
  { testName: "CBC", sampleType: "Blood" },
  { testName: "RBS", sampleType: "Blood" },
];

// Auto-generate Sample ID: LAB-YYYY-XXX
function generateSampleId() {
  const y = new Date().getFullYear();
  const x = String(Math.floor(100 + Math.random() * 900));
  return "LAB-" + y + "-" + x;
}

function SampleCollection() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [sampleId] = useState(() => generateSampleId());
  const [collectionTime, setCollectionTime] = useState(() =>
    new Date().toISOString().slice(0, 16)
  );

  const handleMarkCollected = () => {
    const data = {
      orderId,
      sampleId,
      patient: MOCK_PATIENT,
      tests: MOCK_TESTS,
      collectionTime,
    };
    console.log("Sample collected:", data);
    navigate("/lab/orders");
  };

  const handlePrintLabel = () => {
    window.print();
  };

  return (
    <div className="content-area lab-page">
      <div className="no-print">
        <Link to="/lab/orders" className="lab-back-link">
          <FaArrowLeft /> Back to Lab Orders
        </Link>
        <h2>Sample Collection</h2>
        <p className="section-subtitle">Order: {orderId}</p>

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
        <h3>Ordered Tests</h3>
        <div className="lab-form-row no-print">
          <label>Sample ID (auto-generated)</label>
          <input type="text" value={sampleId} readOnly style={{ background: "#f3f4f6", maxWidth: 200 }} />
        </div>
        <table className="lab-table">
          <thead>
            <tr>
              <th>Test</th>
              <th>Sample Type</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TESTS.map((t, i) => (
              <tr key={i}>
                <td>{t.testName}</td>
                <td>{t.sampleType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lab-section">
        <h3>Collection Time</h3>
        <div className="lab-form-row">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            value={collectionTime}
            onChange={(e) => setCollectionTime(e.target.value)}
          />
        </div>
        <div className="no-print">
          <button type="button" className="lab-btn lab-btn-secondary" onClick={handlePrintLabel}>
            Print Sample Label
          </button>
          <button type="button" className="lab-btn lab-btn-primary" onClick={handleMarkCollected} style={{ marginLeft: 12 }}>
            Mark Sample Collected
          </button>
        </div>
      </div>
      </div>

      {/* Printable sample label: shown only when printing */}
      <div className="sample-label-print">
        <div className="label-title">Sample Label</div>
        <p><strong>Patient Name:</strong> {MOCK_PATIENT.name}</p>
        <p><strong>UHID:</strong> {MOCK_PATIENT.uhid}</p>
        <p><strong>Test Name:</strong> {MOCK_TESTS.map((t) => t.testName).join(", ")}</p>
        <p><strong>Sample ID:</strong> {sampleId}</p>
      </div>
    </div>
  );
}

export default SampleCollection;
