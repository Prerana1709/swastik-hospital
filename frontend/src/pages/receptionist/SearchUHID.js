import React, { useState } from "react";
import { FiSearch, FiUser, FiPhone, FiCalendar, FiShield } from 'react-icons/fi';
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
      <h1 className="recep-dash-title">Patient Search</h1>
      <p className="recep-dash-subtitle">Look up existing patient records by their Unique Health ID (UHID).</p>

      <section className="recep-dash-section">
        <div className="recep-table-wrap" style={{ padding: '2rem' }}>
          <form onSubmit={handleSearch} className="recep-reg-form" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="recep-reg-field" style={{ flex: 1, maxWidth: 400 }}>
              <label>Enter UHID</label>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={uhid}
                  onChange={(e) => setUhid(e.target.value)}
                  placeholder="e.g. UHID-2026-123456"
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                />
              </div>
            </div>
            <button type="submit" className="recep-btn recep-btn-primary" style={{ height: '46px', padding: '0 2rem' }}>
              Search Records
            </button>
          </form>

          {searched && (
            <div style={{ marginTop: '2.5rem', animation: 'fadeIn 0.3s' }}>
              {result ? (
                <div className="recep-reg-paper" style={{ minWidth: '100%' }}>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: '#0f172a' }}>Patient Profile Found</h3>
                    <code style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{result.uhid}</code>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <p><strong><FiUser /> Name:</strong> {result.fullName}</p>
                    <p><strong><FiPhone /> Contact:</strong> {result.contact}</p>
                    <p><strong><FiShield /> Guardian:</strong> {result.guardianName} ({result.guardianRelation})</p>
                    <p><strong><FiCalendar /> Registered:</strong> {result.registeredAt ? new Date(result.registeredAt).toLocaleString() : "—"}</p>
                  </div>
                  {result.riskFlag && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <span className="recep-badge-emergency">High Priority Observation</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', background: '#fcfcfc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                  <p className="recep-table-empty">No patient found matching the UHID: <strong>{uhid}</strong></p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
