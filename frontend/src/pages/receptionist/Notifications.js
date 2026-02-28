import React from "react";
import "./ReceptionistDashboard.css";

export default function Notifications() {
  return (
    <div className="recep-dash">
      <h1 className="recep-dash-title">Notifications</h1>
      <p className="recep-dash-subtitle">Alerts: emergency arrivals, doctor absence, admission requests.</p>
      <section className="recep-dash-section">
        <p className="recep-table-empty">No new notifications.</p>
      </section>
    </div>
  );
}
