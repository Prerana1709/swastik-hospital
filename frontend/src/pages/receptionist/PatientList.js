import React, { useState, useEffect } from "react";
import { STORAGE_KEYS } from "./receptionistData";
import "./ReceptionistDashboard.css";

export default function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_PATIENTS);
    setPatients(raw ? JSON.parse(raw) : []);
  }, []);

  return (
    <div className="recep-dash">
      <h1 className="recep-dash-title">Patient List</h1>
      <p className="recep-dash-subtitle">Registered patients (receptionist view – no diagnosis).</p>

      <section className="recep-dash-section">
        <div className="recep-table-wrap">
          <table className="recep-table">
            <thead>
              <tr>
                <th>UHID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Registered</th>
                <th>Risk Flag</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr><td colSpan={5} className="recep-table-empty">No patients registered yet</td></tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.uhid}>
                    <td>{p.uhid}</td>
                    <td>{p.fullName}</td>
                    <td>{p.contact}</td>
                    <td>{p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : "—"}</td>
                    <td>{p.riskFlag ? <span className="recep-badge-emergency">High Observation</span> : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
