import React, { useState, useEffect } from "react";
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
      <h1 className="recep-dash-title">Admissions (IPD)</h1>
      <p className="recep-dash-subtitle">Check bed availability, assign ward, generate admission form, inform nursing.</p>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title">1. Bed Availability</h2>
        <div className="recep-dash-cards">
          <div className="recep-dash-card">
            <span className="recep-dash-card-value">{beds.filter((b) => !b.occupied).length}</span>
            <span className="recep-dash-card-label">Available Beds</span>
          </div>
          <div className="recep-dash-card">
            <span className="recep-dash-card-value">{beds.filter((b) => b.occupied).length}</span>
            <span className="recep-dash-card-label">Occupied</span>
          </div>
        </div>
      </section>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title">2. Select Ward Type</h2>
        <div className="recep-reg-grid" style={{ gridTemplateColumns: "1fr" }}>
          {WARD_TYPES.map((ward) => (
            <label key={ward} className="recep-reg-check">
              <input
                type="radio"
                name="ward"
                value={ward}
                checked={selectedWard === ward}
                onChange={(e) => setSelectedWard(e.target.value)}
              />
              {ward}
            </label>
          ))}
        </div>
      </section>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title">3. Assign Bed Number</h2>
        {availableBeds.length === 0 ? (
          <p className="recep-table-empty">No available beds{selectedWard ? ` in ${selectedWard}` : ""}.</p>
        ) : (
          <div className="recep-dash-cards">
            {availableBeds.map((bed) => (
              <div key={bed.id} className="recep-dash-card" style={{ cursor: "pointer" }}>
                <span className="recep-dash-card-value">{bed.number}</span>
                <span className="recep-dash-card-label">{bed.ward}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title">4. Admission Requests (from Doctor)</h2>
        {admissionRequests.length === 0 ? (
          <p className="recep-table-empty">No admission requests. When doctor recommends IPD, request will appear here.</p>
        ) : (
          <ul className="recep-list">
            {admissionRequests.map((a) => (
              <li key={a.id}>
                {a.patientName} – <button type="button" className="recep-btn recep-btn-small recep-btn-primary">Generate Admission Form</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="recep-dash-section">
        <h2 className="recep-dash-section-title">5. Collect Initial Deposit</h2>
        <p className="recep-dash-hint">After assigning bed, collect deposit and confirm admission. Nursing staff will be informed.</p>
        <button type="button" className="recep-btn recep-btn-secondary">Mark Deposit Collected</button>
      </section>
    </div>
  );
}
