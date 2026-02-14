// Billing Configuration: consultation fees, IPD charges, link lab charges.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

function BillingConfig() {
  const [consultFee, setConsultFee] = useState(200);
  const [ipdPerDay, setIpdPerDay] = useState(1500);
  const [linkLabCharges, setLinkLabCharges] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Billing config saved:", { consultFee, ipdPerDay, linkLabCharges });
    alert("Billing configuration saved. (Check console)");
  };

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>Billing Configuration</h2>
      <p className="section-subtitle">Configure consultation fees, IPD charges, and lab charge linking</p>

      <div className="impl-section">
        <h3>Fee Settings</h3>
        <form onSubmit={handleSave}>
          <div className="impl-form-row">
            <label>Consultation Fee (₹)</label>
            <input type="number" value={consultFee} onChange={(e) => setConsultFee(Number(e.target.value))} min="0" />
          </div>
          <div className="impl-form-row">
            <label>IPD Charges per Day (₹)</label>
            <input type="number" value={ipdPerDay} onChange={(e) => setIpdPerDay(Number(e.target.value))} min="0" />
          </div>
          <div className="impl-form-row">
            <label className="impl-toggle">
              <input type="checkbox" checked={linkLabCharges} onChange={(e) => setLinkLabCharges(e.target.checked)} />
              Link lab charges to patient billing
            </label>
          </div>
          <button type="submit" className="impl-btn impl-btn-primary">Save Billing Config</button>
        </form>
      </div>
    </div>
  );
}

export default BillingConfig;
