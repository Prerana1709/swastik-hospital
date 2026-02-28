import React, { useState, useEffect } from "react";
import { FiUsers, FiFilter, FiDownload } from 'react-icons/fi';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 className="recep-dash-title">Patient Directory</h1>
          <p className="recep-dash-subtitle">Registry of all patients admitted or treated at Swastik Hospital.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <button className="recep-btn recep-btn-secondary"><FiFilter /> Filter</button>
          <button className="recep-btn recep-btn-secondary"><FiDownload /> Export</button>
        </div>
      </div>

      <section className="recep-dash-section">
        <div className="recep-table-wrap">
          <table className="recep-table">
            <thead>
              <tr>
                <th>Medical ID (UHID)</th>
                <th>Patient Full Name</th>
                <th>Primary Contact</th>
                <th>Registration Date</th>
                <th>Clinical Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr><td colSpan={5} className="recep-table-empty">No patient records found in the directory.</td></tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.uhid}>
                    <td><code style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{p.uhid}</code></td>
                    <td><strong>{p.fullName}</strong></td>
                    <td>{p.contact}</td>
                    <td>{p.registeredAt ? new Date(p.registeredAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "—"}</td>
                    <td>
                      {p.riskFlag ?
                        <span className="recep-badge-emergency">High Priority</span> :
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Standard Carry</span>
                      }
                    </td>
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
