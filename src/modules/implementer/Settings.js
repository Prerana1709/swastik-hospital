// System Settings: hospital name, currency, UHID format, logo upload mock.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./implementer.css";

const CURRENCIES = ["INR (₹)", "USD ($)", "EUR (€)"];
const UHID_FORMATS = ["UHID-YYYY-XXXXXX", "GAN-YYYY-XXX", "HOSP-XXX-YYYY"];

function Settings() {
  const [hospitalName, setHospitalName] = useState("Swastik Hospital");
  const [currency, setCurrency] = useState("INR (₹)");
  const [uhidFormat, setUhidFormat] = useState("UHID-YYYY-XXXXXX");
  const [logoFile, setLogoFile] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    console.log("System settings saved:", { hospitalName, currency, uhidFormat, logoFile: logoFile ? "(file selected)" : null });
    alert("System settings saved. (Check console)");
  };

  return (
    <div className="content-area impl-page">
      <Link to="/implementer" className="impl-back-link">
        <FaArrowLeft /> Back to Configuration
      </Link>
      <h2>System Settings</h2>
      <p className="section-subtitle">Hospital name, currency, UHID format, and logo</p>

      <div className="impl-section">
        <h3>General</h3>
        <form onSubmit={handleSave}>
          <div className="impl-form-row">
            <label>Hospital Name</label>
            <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} />
          </div>
          <div className="impl-form-row">
            <label>Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="impl-form-row">
            <label>UHID Format</label>
            <select value={uhidFormat} onChange={(e) => setUhidFormat(e.target.value)}>
              {UHID_FORMATS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="impl-form-row">
            <label>Logo (mock upload)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
            {logoFile && <span style={{ fontSize: 13, color: "#666" }}>Selected: {logoFile.name}</span>}
          </div>
          <button type="submit" className="impl-btn impl-btn-primary">Save Settings</button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
