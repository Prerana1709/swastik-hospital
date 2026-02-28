import React, { useState, useEffect } from "react";
import { FiActivity, FiKey, FiMap, FiCreditCard, FiUsers } from 'react-icons/fi';
import { getAdmissionRequests, STORAGE_KEYS } from "./receptionistData";
import "./ReceptionistDashboard.css";

const WARD_TYPES = [
  "General Psychiatric Ward",
  "Private Room",
  "Observation Ward",
];

const defaultBeds = [
  { id: "b1", ward: "General Psychiatric Ward", number: "G-101", occupied: false },
  { id: "b2", ward: "General Psychiatric Ward", number: "G-102", occupied: true },
  { id: "b3", ward: "Private Room", number: "P-201", occupied: false },
  { id: "b4", ward: "Observation Ward", number: "O-301", occupied: false },
];

export default function Admissions() {
  const [admissionRequests, setAdmissionRequests] = useState([]);
  const [beds, setBeds] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [availableBeds, setAvailableBeds] = useState([]);

  useEffect(() => {
    setAdmissionRequests(getAdmissionRequests());
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BEDS);
      setBeds(raw ? JSON.parse(raw) : defaultBeds);
    } catch {
      setBeds(defaultBeds);
    }
  }, []);

  useEffect(() => {
    if (!selectedWard) {
      setAvailableBeds(beds.filter((b) => !b.occupied));
      return;
    }
    setAvailableBeds(beds.filter((b) => b.ward === selectedWard && !b.occupied));
  }, [selectedWard, beds]);

  return (
    <div className="recep-dash">
      <h1 className="recep-dash-title">Inpatient Admissions (IPD)</h1>
      <p className="recep-dash-subtitle">Manage ward availability, bed assignments, and admission documentation.</p>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title"><FiKey /> 1. Bed Inventory Overview</h2>
        <div className="recep-dash-cards">
          <div className="recep-dash-card">
            <div className="recep-dash-card-icon" style={{ background: '#f0fdfa', color: '#0d9488' }}><FiKey /></div>
            <span className="recep-dash-card-value">{beds.filter((b) => !b.occupied).length}</span>
            <span className="recep-dash-card-label">Available Beds</span>
          </div>
          <div className="recep-dash-card">
            <div className="recep-dash-card-icon" style={{ background: '#f1f5f9', color: '#64748b' }}><FiActivity /></div>
            <span className="recep-dash-card-value">{beds.filter((b) => b.occupied).length}</span>
            <span className="recep-dash-card-label">Currently Occupied</span>
          </div>
        </div>
      </section>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title"><FiMap /> 2. Ward Category Selection</h2>
        <div className="recep-table-wrap" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {WARD_TYPES.map((ward) => (
            <label key={ward} className="recep-reg-check" style={{ background: selectedWard === ward ? '#f0fdfa' : '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid', borderColor: selectedWard === ward ? '#0d9488' : '#e2e8f0', minWidth: '200px' }}>
              <input
                type="radio"
                name="ward"
                value={ward}
                checked={selectedWard === ward}
                onChange={(e) => setSelectedWard(e.target.value)}
              />
              <span style={{ fontWeight: 600 }}>{ward}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title"><FiKey /> 3. Select Available Bed</h2>
        {availableBeds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '20px', border: '1px dashed #e2e8f0' }}>
            <p className="recep-table-empty">No vacant beds found{selectedWard ? ` in ${selectedWard}` : ""}.</p>
          </div>
        ) : (
          <div className="recep-dash-cards">
            {availableBeds.map((bed) => (
              <div key={bed.id} className="recep-dash-card" style={{ cursor: "pointer", border: '2px solid transparent' }} onClick={() => { }}>
                <span className="recep-dash-card-value" style={{ color: '#0d9488' }}>{bed.number}</span>
                <span className="recep-dash-card-label">{bed.ward}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title"><FiUsers /> 4. Doctor Referral Requests</h2>
        <div className="recep-table-wrap">
          {admissionRequests.length === 0 ? (
            <p className="recep-table-empty" style={{ padding: '2rem' }}>No active admission referrals from clinical staff.</p>
          ) : (
            <table className="recep-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Referring Doctor</th>
                  <th>Clinical Urgency</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {admissionRequests.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.patientName}</strong></td>
                    <td>Dr. Mental Health Staff</td>
                    <td><span className="recep-status recep-status-pending">Standard Admission</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button type="button" className="recep-btn recep-btn-primary">Generate IPD Form</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title"><FiCreditCard /> 5. Finalize Admission</h2>
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '1.5rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, color: '#92400e', fontWeight: 600 }}>Deposit Required</p>
            <p style={{ margin: '0.25rem 0 0', color: '#b45309', fontSize: '0.9rem' }}>Please collect the initial deposit to confirm ward allocation.</p>
          </div>
          <button type="button" className="recep-btn" style={{ background: '#d97706', color: 'white' }}>Confirm & Notify Nursing</button>
        </div>
      </section>
    </div>
  );
}
