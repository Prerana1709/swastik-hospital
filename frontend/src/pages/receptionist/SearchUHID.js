import React, { useState } from "react";
import { STORAGE_KEYS } from "./receptionistData";
import "./ReceptionistDashboard.css";

export default function SearchUHID() {
  const [uhid, setUhid] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_PATIENTS);
    const patients = raw ? JSON.parse(raw) : [];
    const found = patients.find((p) => (p.uhid || "").toLowerCase() === uhid.trim().toLowerCase());
    setResult(found || null);
  };

  return (
    <div className="recep-dash">
      <h1 className="recep-dash-title">Search UHID</h1>
      <p className="recep-dash-subtitle">Look up patient by UHID (basic info only – no diagnosis).</p>

      <section className="recep-dash-section">
        <form onSubmit={handleSearch} className="recep-reg-form">
          <div className="recep-reg-field" style={{ maxWidth: 320 }}>
            <label>UHID</label>
            <input
              type="text"
              value={uhid}
              onChange={(e) => setUhid(e.target.value)}
              placeholder="e.g. UHID-2026-123456"
            />
          </div>
          <button type="submit" className="recep-btn recep-btn-primary" style={{ marginTop: 12 }}>
            Search
          </button>
        </form>

        {searched && (
          <div style={{ marginTop: 24 }}>
            {result ? (
              <div className="recep-reg-paper">
                <p><strong>UHID:</strong> {result.uhid}</p>
                <p><strong>Name:</strong> {result.fullName}</p>
                <p><strong>Contact:</strong> {result.contact}</p>
                <p><strong>Guardian:</strong> {result.guardianName} ({result.guardianRelation})</p>
                <p><strong>Registered:</strong> {result.registeredAt ? new Date(result.registeredAt).toLocaleString() : "—"}</p>
                {result.riskFlag && <p><span className="recep-badge-emergency">High Observation</span></p>}
              </div>
            ) : (
              <p className="recep-table-empty">No patient found for this UHID.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
