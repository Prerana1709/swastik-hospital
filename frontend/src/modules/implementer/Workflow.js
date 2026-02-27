// Workflow Settings: lab status flow, verification requirement toggle.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

const LAB_STATUSES = ["ORDERED", "SAMPLE_COLLECTED", "IN_TEST", "VERIFIED", "REPORTED", "CRITICAL"];

function Workflow() {
  const [verificationRequired, setVerificationRequired] = useState(true);
  const [statusOrder, setStatusOrder] = useState(LAB_STATUSES);

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Workflow saved:", { verificationRequired, statusOrder });
    alert("Workflow settings saved. (Check console)");
  };

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Workflow Settings</h2>
      <p className="section-subtitle">Configure lab status flow and verification requirements</p>

      <div className="impl-section">
        <h3>Lab Status Flow</h3>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
          Order of statuses: {statusOrder.join(" → ")}
        </p>
      </div>

      <div className="impl-section">
        <h3>Verification</h3>
        <form onSubmit={handleSave}>
          <div className="impl-form-row">
            <label className="impl-toggle">
              <input
                type="checkbox"
                checked={verificationRequired}
                onChange={(e) => setVerificationRequired(e.target.checked)}
              />
              Require verification before report is published
            </label>
          </div>
          <button type="submit" className="impl-btn impl-btn-primary">Save Workflow</button>
        </form>
      </div>
    </div>
  );
}

export default Workflow;
