import React from "react";
import { FiBell, FiInfo } from 'react-icons/fi';
import "./ReceptionistDashboard.css";

export default function Notifications() {
  return (
    <div className="recep-dash">
      <h1 className="recep-dash-title">Notifications</h1>
      <p className="recep-dash-subtitle">Stay updated with real-time hospital alerts and administrative tasks.</p>

      <section className="recep-dash-section">
        <div className="recep-table-wrap" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', color: '#e2e8f0', marginBottom: '1.5rem' }}>
            <FiBell />
          </div>
          <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>No new alerts</h2>
          <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
            When there are emergency arrivals, doctor absences, or IPD admission requests, they will appear here for your immediate attention.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#0d9488', fontSize: '0.9rem', fontWeight: 600 }}>
            <FiInfo /> System is up to date
          </div>
        </div>
      </section>
    </div>
  );
}
